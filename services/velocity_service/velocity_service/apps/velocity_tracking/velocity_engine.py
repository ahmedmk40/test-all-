import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class VelocityEngine:
    def __init__(self):
        """
        Initialize the velocity engine for fraud detection.
        """
        self.velocity_rules = {}
        self.transaction_history = {}
    
    def load_velocity_rules(self, rules_data):
        """
        Load velocity rules into the engine.
        
        Args:
            rules_data: List of velocity rule dictionaries
        """
        for rule in rules_data:
            self.velocity_rules[rule['id']] = rule
    
    def add_transaction(self, transaction):
        """
        Add a transaction to the history for velocity tracking.
        
        Args:
            transaction: Dictionary containing transaction data
        """
        customer_id = transaction.get('customer_id')
        if not customer_id:
            return
            
        if customer_id not in self.transaction_history:
            self.transaction_history[customer_id] = []
            
        self.transaction_history[customer_id].append({
            'transaction_id': transaction.get('transaction_id'),
            'amount': transaction.get('amount', 0),
            'currency': transaction.get('currency', 'USD'),
            'merchant_id': transaction.get('merchant_id'),
            'merchant_category': transaction.get('merchant_category'),
            'transaction_type': transaction.get('transaction_type'),
            'timestamp': transaction.get('timestamp', datetime.now().isoformat()),
            'country': transaction.get('country'),
            'ip_address': transaction.get('ip_address')
        })
    
    def evaluate_transaction(self, transaction):
        """
        Evaluate a transaction against velocity rules.
        
        Args:
            transaction: Dictionary containing transaction data
            
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
        
        customer_id = transaction.get('customer_id')
        if not customer_id or customer_id not in self.transaction_history:
            return results
            
        # Add current transaction to history temporarily for evaluation
        current_transaction = {
            'transaction_id': transaction.get('transaction_id'),
            'amount': transaction.get('amount', 0),
            'currency': transaction.get('currency', 'USD'),
            'merchant_id': transaction.get('merchant_id'),
            'merchant_category': transaction.get('merchant_category'),
            'transaction_type': transaction.get('transaction_type'),
            'timestamp': transaction.get('timestamp', datetime.now().isoformat()),
            'country': transaction.get('country'),
            'ip_address': transaction.get('ip_address')
        }
        
        history = self.transaction_history[customer_id] + [current_transaction]
        
        # Evaluate each active velocity rule
        for rule_id, rule in self.velocity_rules.items():
            if not rule.get('active', False):
                continue
                
            # Skip rules that don't apply to this transaction type
            if 'transaction_types' in rule and transaction.get('transaction_type') not in rule['transaction_types']:
                continue
            
            # Evaluate velocity rule
            triggered, details = self._evaluate_velocity_rule(rule, history)
            
            if triggered:
                rule_result = {
                    'rule_id': rule_id,
                    'rule_name': rule.get('name', ''),
                    'risk_score': rule.get('risk_score', 0),
                    'description': rule.get('description', ''),
                    'details': details,
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
    
    def _evaluate_velocity_rule(self, rule, transaction_history):
        """
        Evaluate a velocity rule against transaction history.
        
        Args:
            rule: Velocity rule dictionary
            transaction_history: List of transaction dictionaries
            
        Returns:
            Tuple of (triggered, details)
        """
        time_window = rule.get('time_window', 24)  # Default 24 hours
        threshold = rule.get('threshold', 0)
        aggregation = rule.get('aggregation', 'count')
        field = rule.get('field', None)
        group_by = rule.get('group_by', None)
        
        # Convert time_window to timedelta
        time_window = timedelta(hours=time_window)
        
        # Get current time from the latest transaction
        current_time = datetime.fromisoformat(transaction_history[-1]['timestamp'])
        
        # Filter transactions within time window
        filtered_transactions = []
        for tx in transaction_history:
            tx_time = datetime.fromisoformat(tx['timestamp'])
            if current_time - tx_time <= time_window:
                filtered_transactions.append(tx)
        
        # If no transactions in window, rule is not triggered
        if not filtered_transactions:
            return False, {}
        
        # If grouping is specified, evaluate for each group
        if group_by:
            groups = {}
            for tx in filtered_transactions:
                group_value = tx.get(group_by)
                if group_value not in groups:
                    groups[group_value] = []
                groups[group_value].append(tx)
            
            # Check each group
            triggered_groups = []
            for group_value, group_txs in groups.items():
                result = self._calculate_aggregation(group_txs, aggregation, field)
                if self._compare_to_threshold(result, threshold, rule.get('comparison', 'greater_than')):
                    triggered_groups.append({
                        'group': group_value,
                        'value': result,
                        'threshold': threshold,
                        'transaction_count': len(group_txs)
                    })
            
            if triggered_groups:
                return True, {
                    'triggered_groups': triggered_groups,
                    'time_window_hours': time_window.total_seconds() / 3600
                }
            return False, {}
        else:
            # Evaluate across all transactions
            result = self._calculate_aggregation(filtered_transactions, aggregation, field)
            if self._compare_to_threshold(result, threshold, rule.get('comparison', 'greater_than')):
                return True, {
                    'value': result,
                    'threshold': threshold,
                    'transaction_count': len(filtered_transactions),
                    'time_window_hours': time_window.total_seconds() / 3600
                }
            return False, {}
    
    def _calculate_aggregation(self, transactions, aggregation, field=None):
        """
        Calculate aggregation value for transactions.
        
        Args:
            transactions: List of transaction dictionaries
            aggregation: Type of aggregation (count, sum, avg, min, max)
            field: Field to aggregate (required for all except count)
            
        Returns:
            Aggregated value
        """
        if aggregation == 'count':
            return len(transactions)
        
        if not field:
            return 0
            
        values = [tx.get(field, 0) for tx in transactions]
        
        if aggregation == 'sum':
            return sum(values)
        elif aggregation == 'avg':
            return sum(values) / len(values) if values else 0
        elif aggregation == 'min':
            return min(values) if values else 0
        elif aggregation == 'max':
            return max(values) if values else 0
        elif aggregation == 'unique_count':
            return len(set(values))
        
        return 0
    
    def _compare_to_threshold(self, value, threshold, comparison):
        """
        Compare value to threshold using the specified comparison.
        
        Args:
            value: Calculated aggregation value
            threshold: Threshold value from rule
            comparison: Comparison operator
            
        Returns:
            Boolean result of comparison
        """
        if comparison == 'equals':
            return value == threshold
        elif comparison == 'not_equals':
            return value != threshold
        elif comparison == 'greater_than':
            return value > threshold
        elif comparison == 'less_than':
            return value < threshold
        elif comparison == 'greater_than_or_equals':
            return value >= threshold
        elif comparison == 'less_than_or_equals':
            return value <= threshold
        
        return False
    
    def get_customer_velocity_metrics(self, customer_id, time_window=24):
        """
        Get velocity metrics for a customer.
        
        Args:
            customer_id: Customer ID
            time_window: Time window in hours
            
        Returns:
            Dictionary with velocity metrics
        """
        if customer_id not in self.transaction_history:
            return {
                'customer_id': customer_id,
                'transaction_count': 0,
                'total_amount': 0,
                'average_amount': 0,
                'unique_merchants': 0,
                'unique_countries': 0,
                'time_window_hours': time_window
            }
        
        # Convert time_window to timedelta
        time_window = timedelta(hours=time_window)
        
        # Get current time
        current_time = datetime.now()
        
        # Filter transactions within time window
        filtered_transactions = []
        for tx in self.transaction_history[customer_id]:
            tx_time = datetime.fromisoformat(tx['timestamp'])
            if current_time - tx_time <= time_window:
                filtered_transactions.append(tx)
        
        # Calculate metrics
        transaction_count = len(filtered_transactions)
        amounts = [tx.get('amount', 0) for tx in filtered_transactions]
        total_amount = sum(amounts)
        average_amount = total_amount / transaction_count if transaction_count > 0 else 0
        unique_merchants = len(set(tx.get('merchant_id') for tx in filtered_transactions if tx.get('merchant_id')))
        unique_countries = len(set(tx.get('country') for tx in filtered_transactions if tx.get('country')))
        
        return {
            'customer_id': customer_id,
            'transaction_count': transaction_count,
            'total_amount': total_amount,
            'average_amount': average_amount,
            'unique_merchants': unique_merchants,
            'unique_countries': unique_countries,
            'time_window_hours': time_window.total_seconds() / 3600
        }
    
    def clear_old_transactions(self, max_age_hours=168):  # Default 7 days
        """
        Clear transactions older than specified age.
        
        Args:
            max_age_hours: Maximum age of transactions to keep in hours
        """
        max_age = timedelta(hours=max_age_hours)
        current_time = datetime.now()
        
        for customer_id in list(self.transaction_history.keys()):
            updated_history = []
            for tx in self.transaction_history[customer_id]:
                tx_time = datetime.fromisoformat(tx['timestamp'])
                if current_time - tx_time <= max_age:
                    updated_history.append(tx)
            
            if updated_history:
                self.transaction_history[customer_id] = updated_history
            else:
                del self.transaction_history[customer_id]
