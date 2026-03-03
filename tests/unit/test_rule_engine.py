import unittest
import sys
import os

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the rule engine
from services.rule_service.rule_service.apps.rule_engine.rule_engine import RuleEngine

class TestRuleEngine(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures"""
        self.rule_engine = RuleEngine()
        
        # Sample rules
        self.rules = [
            {
                'id': 'rule001',
                'name': 'High Amount Transaction',
                'description': 'Flags transactions with amount over $1000',
                'conditions': {
                    'operator': 'AND',
                    'conditions': [
                        {
                            'field': 'amount',
                            'comparison': 'greater_than',
                            'value': 1000
                        }
                    ]
                },
                'risk_score': 50,
                'action': 'REVIEW',
                'active': True,
                'transaction_types': ['purchase', 'withdrawal']
            },
            {
                'id': 'rule002',
                'name': 'International Transaction',
                'description': 'Flags transactions from countries other than US',
                'conditions': {
                    'operator': 'AND',
                    'conditions': [
                        {
                            'field': 'country',
                            'comparison': 'not_equals',
                            'value': 'US'
                        }
                    ]
                },
                'risk_score': 30,
                'action': 'REVIEW',
                'active': True,
                'transaction_types': ['purchase', 'withdrawal', 'transfer']
            },
            {
                'id': 'rule003',
                'name': 'Suspicious Merchant Category',
                'description': 'Flags transactions with suspicious merchant categories',
                'conditions': {
                    'operator': 'OR',
                    'conditions': [
                        {
                            'field': 'merchant_category',
                            'comparison': 'equals',
                            'value': 'gambling'
                        },
                        {
                            'field': 'merchant_category',
                            'comparison': 'equals',
                            'value': 'cryptocurrency'
                        }
                    ]
                },
                'risk_score': 40,
                'action': 'REVIEW',
                'active': True,
                'transaction_types': ['purchase']
            },
            {
                'id': 'rule004',
                'name': 'Complex Rule with Nested Conditions',
                'description': 'Tests complex nested conditions',
                'conditions': {
                    'operator': 'AND',
                    'conditions': [
                        {
                            'field': 'amount',
                            'comparison': 'greater_than',
                            'value': 500
                        },
                        {
                            'operator': 'OR',
                            'conditions': [
                                {
                                    'field': 'country',
                                    'comparison': 'not_equals',
                                    'value': 'US'
                                },
                                {
                                    'field': 'payment_method',
                                    'comparison': 'equals',
                                    'value': 'gift_card'
                                }
                            ]
                        }
                    ]
                },
                'risk_score': 60,
                'action': 'REVIEW',
                'active': True,
                'transaction_types': ['purchase', 'withdrawal']
            },
            {
                'id': 'rule005',
                'name': 'Inactive Rule',
                'description': 'This rule should not trigger as it is inactive',
                'conditions': {
                    'operator': 'AND',
                    'conditions': [
                        {
                            'field': 'amount',
                            'comparison': 'greater_than',
                            'value': 0
                        }
                    ]
                },
                'risk_score': 10,
                'action': 'REVIEW',
                'active': False,
                'transaction_types': ['purchase', 'withdrawal']
            }
        ]
        
        # Load rules into engine
        self.rule_engine.load_rules(self.rules)
        
        # Sample rule sets
        self.rule_sets = [
            {
                'id': 'ruleset001',
                'name': 'Basic Fraud Detection',
                'description': 'Basic set of fraud detection rules',
                'rules': ['rule001', 'rule002']
            },
            {
                'id': 'ruleset002',
                'name': 'Advanced Fraud Detection',
                'description': 'Advanced set of fraud detection rules',
                'rules': ['rule001', 'rule002', 'rule003', 'rule004']
            }
        ]
        
        # Load rule sets into engine
        self.rule_engine.load_rule_sets(self.rule_sets)
    
    def test_high_amount_rule(self):
        """Test high amount rule triggers correctly"""
        # Transaction that should trigger the rule
        transaction = {
            'transaction_id': 'test001',
            'amount': 1500,
            'country': 'US',
            'transaction_type': 'purchase'
        }
        
        result = self.rule_engine.evaluate_transaction(transaction)
        
        # Verify rule triggered
        self.assertEqual(len(result['triggered_rules']), 1)
        self.assertEqual(result['triggered_rules'][0]['rule_id'], 'rule001')
        self.assertEqual(result['decision'], 'REVIEW')
        
        # Transaction that should not trigger the rule
        transaction = {
            'transaction_id': 'test002',
            'amount': 500,
            'country': 'US',
            'transaction_type': 'purchase'
        }
        
        result = self.rule_engine.evaluate_transaction(transaction)
        
        # Verify rule did not trigger
        self.assertEqual(len(result['triggered_rules']), 0)
        self.assertEqual(result['decision'], 'APPROVE')
    
    def test_international_transaction_rule(self):
        """Test international transaction rule triggers correctly"""
        # Transaction that should trigger the rule
        transaction = {
            'transaction_id': 'test003',
            'amount': 500,
            'country': 'GB',
            'transaction_type': 'purchase'
        }
        
        result = self.rule_engine.evaluate_transaction(transaction)
        
        # Verify rule triggered
        self.assertEqual(len(result['triggered_rules']), 1)
        self.assertEqual(result['triggered_rules'][0]['rule_id'], 'rule002')
        self.assertEqual(result['decision'], 'REVIEW')
    
    def test_suspicious_merchant_category_rule(self):
        """Test suspicious merchant category rule triggers correctly"""
        # Transaction that should trigger the rule
        transaction = {
            'transaction_id': 'test004',
            'amount': 500,
            'country': 'US',
            'transaction_type': 'purchase',
            'merchant_category': 'gambling'
        }
        
        result = self.rule_engine.evaluate_transaction(transaction)
        
        # Verify rule triggered
        self.assertEqual(len(result['triggered_rules']), 1)
        self.assertEqual(result['triggered_rules'][0]['rule_id'], 'rule003')
        self.assertEqual(result['decision'], 'REVIEW')
        
        # Another transaction that should trigger the rule
        transaction = {
            'transaction_id': 'test005',
            'amount': 500,
            'country': 'US',
            'transaction_type': 'purchase',
            'merchant_category': 'cryptocurrency'
        }
        
        result = self.rule_engine.evaluate_transaction(transaction)
        
        # Verify rule triggered
        self.assertEqual(len(result['triggered_rules']), 1)
        self.assertEqual(result['triggered_rules'][0]['rule_id'], 'rule003')
        self.assertEqual(result['decision'], 'REVIEW')
        
        # Transaction that should not trigger the rule
        transaction = {
            'transaction_id': 'test006',
            'amount': 500,
            'country': 'US',
            'transaction_type': 'purchase',
            'merchant_category': 'retail'
        }
        
        result = self.rule_engine.evaluate_transaction(transaction)
        
        # Verify rule did not trigger
        self.assertEqual(len(result['triggered_rules']), 0)
        self.assertEqual(result['decision'], 'APPROVE')
    
    def test_complex_nested_rule(self):
        """Test complex rule with nested conditions triggers correctly"""
        # Transaction that should trigger the rule (high amount + international)
        transaction = {
            'transaction_id': 'test007',
            'amount': 600,
            'country': 'GB',
            'transaction_type': 'purchase',
            'payment_method': 'credit_card'
        }
        
        result = self.rule_engine.evaluate_transaction(transaction)
        
        # Verify rule triggered
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertIn('rule004', triggered_rule_ids)
        self.assertEqual(result['decision'], 'REVIEW')
        
        # Transaction that should trigger the rule (high amount + gift card)
        transaction = {
            'transaction_id': 'test008',
            'amount': 600,
            'country': 'US',
            'transaction_type': 'purchase',
            'payment_method': 'gift_card'
        }
        
        result = self.rule_engine.evaluate_transaction(transaction)
        
        # Verify rule triggered
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertIn('rule004', triggered_rule_ids)
        self.assertEqual(result['decision'], 'REVIEW')
        
        # Transaction that should not trigger the rule (low amount)
        transaction = {
            'transaction_id': 'test009',
            'amount': 400,
            'country': 'GB',
            'transaction_type': 'purchase',
            'payment_method': 'credit_card'
        }
        
        result = self.rule_engine.evaluate_transaction(transaction)
        
        # Verify rule did not trigger
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertNotIn('rule004', triggered_rule_ids)
    
    def test_inactive_rule(self):
        """Test inactive rule does not trigger"""
        # Transaction that would trigger the rule if it were active
        transaction = {
            'transaction_id': 'test010',
            'amount': 100,
            'country': 'US',
            'transaction_type': 'purchase'
        }
        
        result = self.rule_engine.evaluate_transaction(transaction)
        
        # Verify rule did not trigger
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertNotIn('rule005', triggered_rule_ids)
    
    def test_multiple_rules_trigger(self):
        """Test multiple rules can trigger for a single transaction"""
        # Transaction that should trigger multiple rules
        transaction = {
            'transaction_id': 'test011',
            'amount': 1500,
            'country': 'GB',
            'transaction_type': 'purchase',
            'merchant_category': 'gambling',
            'payment_method': 'credit_card'
        }
        
        result = self.rule_engine.evaluate_transaction(transaction)
        
        # Verify multiple rules triggered
        self.assertGreater(len(result['triggered_rules']), 1)
        
        # Verify specific rules triggered
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertIn('rule001', triggered_rule_ids)  # High amount
        self.assertIn('rule002', triggered_rule_ids)  # International
        self.assertIn('rule003', triggered_rule_ids)  # Suspicious merchant
        self.assertIn('rule004', triggered_rule_ids)  # Complex rule
        
        # Verify risk score is cumulative
        self.assertGreater(result['risk_score'], 50)
        
        # Verify decision is REVIEW
        self.assertEqual(result['decision'], 'REVIEW')
    
    def test_rule_set_evaluation(self):
        """Test rule set evaluation works correctly"""
        # Transaction that should trigger multiple rules
        transaction = {
            'transaction_id': 'test012',
            'amount': 1500,
            'country': 'GB',
            'transaction_type': 'purchase',
            'merchant_category': 'gambling',
            'payment_method': 'credit_card'
        }
        
        # Evaluate with basic rule set
        result = self.rule_engine.evaluate_rule_set('ruleset001', transaction)
        
        # Verify only rules in the set triggered
        self.assertEqual(len(result['triggered_rules']), 2)
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertIn('rule001', triggered_rule_ids)  # High amount
        self.assertIn('rule002', triggered_rule_ids)  # International
        self.assertNotIn('rule003', triggered_rule_ids)  # Not in this rule set
        self.assertNotIn('rule004', triggered_rule_ids)  # Not in this rule set
        
        # Evaluate with advanced rule set
        result = self.rule_engine.evaluate_rule_set('ruleset002', transaction)
        
        # Verify all applicable rules in the set triggered
        self.assertEqual(len(result['triggered_rules']), 4)
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertIn('rule001', triggered_rule_ids)  # High amount
        self.assertIn('rule002', triggered_rule_ids)  # International
        self.assertIn('rule003', triggered_rule_ids)  # Suspicious merchant
        self.assertIn('rule004', triggered_rule_ids)  # Complex rule

if __name__ == '__main__':
    unittest.main()
