import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import re
import requests
from fuzzywuzzy import fuzz

class AMLScreeningEngine:
    def __init__(self):
        """
        Initialize the AML screening engine for anti-money laundering detection.
        """
        self.watchlists = {}
        self.screening_rules = {}
        self.screening_history = {}
    
    def load_watchlists(self, watchlists_data):
        """
        Load watchlists into the engine.
        
        Args:
            watchlists_data: Dictionary of watchlists
        """
        self.watchlists = watchlists_data
    
    def load_screening_rules(self, rules_data):
        """
        Load AML screening rules into the engine.
        
        Args:
            rules_data: List of screening rule dictionaries
        """
        for rule in rules_data:
            self.screening_rules[rule['id']] = rule
    
    def screen_entity(self, entity_data, watchlist_ids=None):
        """
        Screen an entity against watchlists.
        
        Args:
            entity_data: Dictionary containing entity data (person or organization)
            watchlist_ids: List of watchlist IDs to check (if None, check all)
            
        Returns:
            Dictionary with screening results
        """
        results = {
            'entity_id': entity_data.get('id'),
            'entity_type': entity_data.get('type', 'person'),
            'matches': [],
            'risk_score': 0,
            'decision': 'APPROVE',
            'screening_time': datetime.now().isoformat()
        }
        
        # Determine which watchlists to check
        if watchlist_ids:
            watchlists_to_check = {wl_id: self.watchlists[wl_id] for wl_id in watchlist_ids if wl_id in self.watchlists}
        else:
            watchlists_to_check = self.watchlists
        
        # Screen against each watchlist
        for watchlist_id, watchlist in watchlists_to_check.items():
            watchlist_matches = self._screen_against_watchlist(entity_data, watchlist)
            
            if watchlist_matches:
                for match in watchlist_matches:
                    match['watchlist_id'] = watchlist_id
                    match['watchlist_name'] = watchlist.get('name', '')
                    results['matches'].append(match)
                    results['risk_score'] += match.get('match_score', 0) * (watchlist.get('risk_weight', 1) / 100)
        
        # Cap risk score at 100
        results['risk_score'] = min(results['risk_score'], 100)
        
        # Determine decision based on risk score
        if results['risk_score'] >= 75:
            results['decision'] = 'BLOCK'
        elif results['risk_score'] >= 50:
            results['decision'] = 'REVIEW'
        
        # Record screening in history
        self._record_screening(entity_data, results)
        
        return results
    
    def _screen_against_watchlist(self, entity_data, watchlist):
        """
        Screen an entity against a specific watchlist.
        
        Args:
            entity_data: Dictionary containing entity data
            watchlist: Watchlist dictionary
            
        Returns:
            List of matches
        """
        matches = []
        
        # Extract entity fields for matching
        entity_fields = self._extract_entity_fields(entity_data)
        
        # Check each entry in the watchlist
        for entry in watchlist.get('entries', []):
            entry_fields = self._extract_entity_fields(entry)
            
            # Calculate match scores for each field
            field_scores = {}
            for field in entity_fields:
                if field in entry_fields and entity_fields[field] and entry_fields[field]:
                    field_scores[field] = self._calculate_match_score(
                        entity_fields[field], 
                        entry_fields[field],
                        field
                    )
            
            # Calculate overall match score
            if field_scores:
                # Weight the scores based on field importance
                weighted_scores = []
                for field, score in field_scores.items():
                    field_weight = self._get_field_weight(field)
                    weighted_scores.append(score * field_weight)
                
                overall_score = sum(weighted_scores) / sum(self._get_field_weight(f) for f in field_scores)
                
                # If score exceeds threshold, add to matches
                if overall_score >= watchlist.get('match_threshold', 70):
                    matches.append({
                        'entry_id': entry.get('id'),
                        'match_score': overall_score,
                        'field_scores': field_scores,
                        'entry_data': entry
                    })
        
        # Sort matches by score (highest first)
        matches.sort(key=lambda x: x['match_score'], reverse=True)
        
        return matches
    
    def _extract_entity_fields(self, entity_data):
        """
        Extract relevant fields from entity data for matching.
        
        Args:
            entity_data: Dictionary containing entity data
            
        Returns:
            Dictionary of extracted fields
        """
        fields = {}
        
        # Common fields
        fields['id'] = entity_data.get('id')
        fields['type'] = entity_data.get('type', 'person')
        
        # Person-specific fields
        if entity_data.get('type') != 'organization':
            fields['name'] = entity_data.get('name', '')
            fields['first_name'] = entity_data.get('first_name', '')
            fields['last_name'] = entity_data.get('last_name', '')
            fields['middle_name'] = entity_data.get('middle_name', '')
            fields['date_of_birth'] = entity_data.get('date_of_birth', '')
            fields['nationality'] = entity_data.get('nationality', '')
            fields['passport_number'] = entity_data.get('passport_number', '')
            fields['id_number'] = entity_data.get('id_number', '')
        
        # Organization-specific fields
        if entity_data.get('type') == 'organization':
            fields['name'] = entity_data.get('name', '')
            fields['registration_number'] = entity_data.get('registration_number', '')
            fields['tax_id'] = entity_data.get('tax_id', '')
            fields['incorporation_country'] = entity_data.get('incorporation_country', '')
        
        # Common address fields
        fields['country'] = entity_data.get('country', '')
        fields['address'] = entity_data.get('address', '')
        
        return fields
    
    def _calculate_match_score(self, value1, value2, field_type):
        """
        Calculate match score between two values.
        
        Args:
            value1: First value
            value2: Second value
            field_type: Type of field being compared
            
        Returns:
            Match score (0-100)
        """
        # Convert values to strings
        str1 = str(value1).lower().strip()
        str2 = str(value2).lower().strip()
        
        # Exact match
        if str1 == str2:
            return 100
        
        # Special handling for different field types
        if field_type in ['date_of_birth', 'incorporation_date']:
            # Try to parse dates and compare
            try:
                date1 = datetime.strptime(str1, '%Y-%m-%d')
                date2 = datetime.strptime(str2, '%Y-%m-%d')
                if date1 == date2:
                    return 100
                return 0
            except:
                pass
        
        if field_type in ['passport_number', 'id_number', 'registration_number', 'tax_id']:
            # For ID numbers, remove spaces and special characters
            clean1 = re.sub(r'[^a-zA-Z0-9]', '', str1)
            clean2 = re.sub(r'[^a-zA-Z0-9]', '', str2)
            if clean1 == clean2:
                return 100
            # Partial match for IDs
            if len(clean1) >= 4 and len(clean2) >= 4:
                if clean1 in clean2 or clean2 in clean1:
                    return 90
            return 0
        
        # For names and addresses, use fuzzy matching
        if field_type in ['name', 'first_name', 'last_name', 'middle_name', 'address']:
            # Token sort ratio handles rearranged words
            ratio = fuzz.token_sort_ratio(str1, str2)
            return ratio
        
        # Default to partial ratio for other fields
        return fuzz.partial_ratio(str1, str2)
    
    def _get_field_weight(self, field):
        """
        Get weight for a field type.
        
        Args:
            field: Field name
            
        Returns:
            Weight value
        """
        weights = {
            'name': 10,
            'first_name': 8,
            'last_name': 9,
            'date_of_birth': 10,
            'passport_number': 10,
            'id_number': 10,
            'nationality': 6,
            'country': 5,
            'address': 4,
            'registration_number': 10,
            'tax_id': 10,
            'incorporation_country': 7
        }
        
        return weights.get(field, 5)
    
    def _record_screening(self, entity_data, results):
        """
        Record screening results in history.
        
        Args:
            entity_data: Entity data that was screened
            results: Screening results
        """
        entity_id = entity_data.get('id')
        if not entity_id:
            return
            
        if entity_id not in self.screening_history:
            self.screening_history[entity_id] = []
            
        self.screening_history[entity_id].append({
            'entity_data': entity_data,
            'results': results,
            'timestamp': datetime.now().isoformat()
        })
    
    def get_screening_history(self, entity_id):
        """
        Get screening history for an entity.
        
        Args:
            entity_id: Entity ID
            
        Returns:
            List of screening records
        """
        return self.screening_history.get(entity_id, [])
    
    def evaluate_transaction(self, transaction, customer_data=None, merchant_data=None):
        """
        Evaluate a transaction for AML risks.
        
        Args:
            transaction: Dictionary containing transaction data
            customer_data: Dictionary containing customer data
            merchant_data: Dictionary containing merchant data
            
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
        
        # Screen customer if data provided
        if customer_data:
            customer_screening = self.screen_entity(customer_data)
            if customer_screening['matches']:
                results['customer_screening'] = customer_screening
                results['risk_score'] += customer_screening['risk_score'] * 0.7  # Weight customer screening higher
                
                if customer_screening['decision'] == 'BLOCK':
                    results['decision'] = 'BLOCK'
                elif customer_screening['decision'] == 'REVIEW' and results['decision'] != 'BLOCK':
                    results['decision'] = 'REVIEW'
        
        # Screen merchant if data provided
        if merchant_data:
            merchant_screening = self.screen_entity(merchant_data)
            if merchant_screening['matches']:
                results['merchant_screening'] = merchant_screening
                results['risk_score'] += merchant_screening['risk_score'] * 0.3  # Weight merchant screening lower
                
                if merchant_screening['decision'] == 'BLOCK':
                    results['decision'] = 'BLOCK'
                elif merchant_screening['decision'] == 'REVIEW' and results['decision'] != 'BLOCK':
                    results['decision'] = 'REVIEW'
        
        # Evaluate transaction against AML rules
        for rule_id, rule in self.screening_rules.items():
            if not rule.get('active', False):
                continue
                
            # Skip rules that don't apply to this transaction type
            if 'transaction_types' in rule and transaction.get('transaction_type') not in rule['transaction_types']:
                continue
            
            # Evaluate rule conditions
            triggered = self._evaluate_aml_conditions(rule, transaction, customer_data, merchant_data)
            
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
    
    def _evaluate_aml_conditions(self, rule, transaction, customer_data, merchant_data):
        """
        Evaluate AML rule conditions.
        
        Args:
            rule: Rule dictionary
            transaction: Transaction data
            customer_data: Customer data
            merchant_data: Merchant data
            
        Returns:
            Boolean indicating if conditions were met
        """
        conditions = rule.get('conditions', {})
        operator = conditions.get('operator', 'AND')
        
        if 'conditions' in conditions:
            # This is a group of conditions
            results = []
            for condition in conditions['conditions']:
                result = self._evaluate_aml_conditions(
                    {'conditions': condition}, 
                    transaction, 
                    customer_data, 
                    merchant_data
                )
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
            
            # Extract field value based on prefix
            if field.startswith('transaction.'):
                field_parts = field.split('.', 1)
                field_value = self._get_nested_value(transaction, field_parts[1])
            elif field.startswith('customer.'):
                if not customer_data:
                    return False
                field_parts = field.split('.', 1)
                field_value = self._get_nested_value(customer_data, field_parts[1])
            elif field.startswith('merchant.'):
                if not merchant_data:
                    return False
                field_parts = f
(Content truncated due to size limit. Use line ranges to read in chunks)