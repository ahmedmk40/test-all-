import re
import json
from datetime import datetime, timedelta

class RuleEngine:
    def __init__(self):
        """
        Initialize the rule engine for fraud detection.
        """
        self.rules = {}
        self.rule_sets = {}
    
    def load_rules(self, rules_data):
        """
        Load rules into the rule engine.
        
        Args:
            rules_data: List of rule dictionaries
        """
        for rule in rules_data:
            self.rules[rule['id']] = rule
    
    def load_rule_sets(self, rule_sets_data):
        """
        Load rule sets into the rule engine.
        
        Args:
            rule_sets_data: List of rule set dictionaries
        """
        for rule_set in rule_sets_data:
            self.rule_sets[rule_set['id']] = rule_set
    
    def evaluate_transaction(self, transaction, context=None):
        """
        Evaluate a transaction against all active rules.
        
        Args:
            transaction: Dictionary containing transaction data
            context: Additional context data (e.g., customer history)
            
        Returns:
            Dictionary with evaluation results
        """
        results = {
            'transaction_id': transaction.get('transaction_id', None),
            'triggered_rules': [],
            'risk_score': 0,
            'decision': 'APPROVE',
            'evaluation_time': datetime.now().isoformat()
        }
        
        # Default context if none provided
        if context is None:
            context = {}
        
        # Evaluate each active rule
        for rule_id, rule in self.rules.items():
            if not rule.get('active', False):
                continue
                
            # Skip rules that don't apply to this transaction type
            if 'transaction_types' in rule and transaction.get('transaction_type') not in rule['transaction_types']:
                continue
            
            # Evaluate rule conditions
            triggered = self._evaluate_conditions(rule['conditions'], transaction, context)
            
            if triggered:
                rule_result = {
                    'rule_id': rule_id,
                    'rule_name': rule.get('name', ''),
                    'risk_score': rule.get('risk_score', 0),
                    'description': rule.get('description', ''),
                    'triggered_at': datetime.now().isoformat()
                }
                
                results['triggered_rules'].append(rule_result)
                results['risk_score'] += rule.get('risk_score', 0)
                
                # Apply rule action if defined
                if 'action' in rule:
                    if rule['action'] == 'BLOCK' and results['decision'] != 'BLOCK':
                        results['decision'] = 'BLOCK'
                    elif rule['action'] == 'REVIEW' and results['decision'] == 'APPROVE':
                        results['decision'] = 'REVIEW'
        
        # Cap risk score at 100
        results['risk_score'] = min(results['risk_score'], 100)
        
        # If risk score exceeds threshold, set decision to REVIEW
        if results['risk_score'] >= 75 and results['decision'] == 'APPROVE':
            results['decision'] = 'REVIEW'
            
        return results
    
    def evaluate_rule_set(self, rule_set_id, transaction, context=None):
        """
        Evaluate a transaction against a specific rule set.
        
        Args:
            rule_set_id: ID of the rule set to evaluate
            transaction: Dictionary containing transaction data
            context: Additional context data
            
        Returns:
            Dictionary with evaluation results
        """
        if rule_set_id not in self.rule_sets:
            raise ValueError(f"Rule set {rule_set_id} not found")
            
        rule_set = self.rule_sets[rule_set_id]
        results = {
            'transaction_id': transaction.get('transaction_id', None),
            'rule_set_id': rule_set_id,
            'rule_set_name': rule_set.get('name', ''),
            'triggered_rules': [],
            'risk_score': 0,
            'decision': 'APPROVE',
            'evaluation_time': datetime.now().isoformat()
        }
        
        # Default context if none provided
        if context is None:
            context = {}
        
        # Evaluate each rule in the rule set
        for rule_id in rule_set.get('rules', []):
            if rule_id not in self.rules:
                continue
                
            rule = self.rules[rule_id]
            if not rule.get('active', False):
                continue
            
            # Evaluate rule conditions
            triggered = self._evaluate_conditions(rule['conditions'], transaction, context)
            
            if triggered:
                rule_result = {
                    'rule_id': rule_id,
                    'rule_name': rule.get('name', ''),
                    'risk_score': rule.get('risk_score', 0),
                    'description': rule.get('description', ''),
                    'triggered_at': datetime.now().isoformat()
                }
                
                results['triggered_rules'].append(rule_result)
                results['risk_score'] += rule.get('risk_score', 0)
                
                # Apply rule action if defined
                if 'action' in rule:
                    if rule['action'] == 'BLOCK' and results['decision'] != 'BLOCK':
                        results['decision'] = 'BLOCK'
                    elif rule['action'] == 'REVIEW' and results['decision'] == 'APPROVE':
                        results['decision'] = 'REVIEW'
        
        # Cap risk score at 100
        results['risk_score'] = min(results['risk_score'], 100)
        
        return results
    
    def _evaluate_conditions(self, conditions, transaction, context):
        """
        Evaluate rule conditions against transaction data.
        
        Args:
            conditions: Dictionary of rule conditions
            transaction: Transaction data
            context: Additional context data
            
        Returns:
            Boolean indicating if conditions were met
        """
        operator = conditions.get('operator', 'AND')
        
        if 'conditions' in conditions:
            # This is a group of conditions
            results = []
            for condition in conditions['conditions']:
                result = self._evaluate_conditions(condition, transaction, context)
                results.append(result)
            
            if operator == 'AND':
                return all(results)
            elif operator == 'OR':
                return any(results)
            elif operator == 'NOT':
                return not results[0] if results else True
        else:
            # This is a leaf condition
            field = conditions.get('field', '')
            value = conditions.get('value', None)
            comparison = conditions.get('comparison', 'equals')
            
            # Extract field value from transaction or context
            if field.startswith('context.'):
                field_parts = field.split('.', 1)
                field_value = self._get_nested_value(context, field_parts[1])
            else:
                field_value = self._get_nested_value(transaction, field)
            
            # Perform comparison
            return self._compare_values(field_value, value, comparison)
    
    def _get_nested_value(self, data, field_path):
        """
        Get a value from a nested dictionary using dot notation.
        
        Args:
            data: Dictionary to extract value from
            field_path: Path to the field using dot notation
            
        Returns:
            The value at the specified path or None if not found
        """
        parts = field_path.split('.')
        current = data
        
        for part in parts:
            if isinstance(current, dict) and part in current:
                current = current[part]
            else:
                return None
                
        return current
    
    def _compare_values(self, field_value, rule_value, comparison):
        """
        Compare values using the specified comparison operator.
        
        Args:
            field_value: Value from transaction or context
            rule_value: Value from rule condition
            comparison: Comparison operator
            
        Returns:
            Boolean result of comparison
        """
        if field_value is None:
            return False
            
        if comparison == 'equals':
            return field_value == rule_value
        elif comparison == 'not_equals':
            return field_value != rule_value
        elif comparison == 'greater_than':
            return float(field_value) > float(rule_value)
        elif comparison == 'less_than':
            return float(field_value) < float(rule_value)
        elif comparison == 'greater_than_or_equals':
            return float(field_value) >= float(rule_value)
        elif comparison == 'less_than_or_equals':
            return float(field_value) <= float(rule_value)
        elif comparison == 'contains':
            return str(rule_value) in str(field_value)
        elif comparison == 'not_contains':
            return str(rule_value) not in str(field_value)
        elif comparison == 'starts_with':
            return str(field_value).startswith(str(rule_value))
        elif comparison == 'ends_with':
            return str(field_value).endswith(str(rule_value))
        elif comparison == 'matches_regex':
            try:
                pattern = re.compile(rule_value)
                return bool(pattern.match(str(field_value)))
            except:
                return False
        elif comparison == 'in_list':
            if isinstance(rule_value, list):
                return field_value in rule_value
            return False
        elif comparison == 'not_in_list':
            if isinstance(rule_value, list):
                return field_value not in rule_value
            return True
        
        return False
