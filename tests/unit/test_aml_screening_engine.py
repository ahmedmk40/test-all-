import unittest
import sys
import os
from datetime import datetime, timedelta

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the AML screening engine
from services.aml_service.aml_service.apps.screening.aml_screening_engine import AMLScreeningEngine

class TestAMLScreeningEngine(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures"""
        self.aml_engine = AMLScreeningEngine()
        
        # Sample watchlists
        self.watchlists = {
            'watchlist001': {
                'id': 'watchlist001',
                'name': 'Global Sanctions List',
                'description': 'Test watchlist for global sanctions screening',
                'match_threshold': 70,
                'risk_weight': 100,
                'entries': [
                    {
                        'id': 'entry001',
                        'type': 'person',
                        'first_name': 'John',
                        'last_name': 'Sanctioned',
                        'date_of_birth': '1980-01-01',
                        'nationality': 'IR',
                        'country': 'IR',
                        'reason': 'Test sanctions entry'
                    },
                    {
                        'id': 'entry002',
                        'type': 'organization',
                        'name': 'Sanctioned Corp',
                        'registration_number': 'SC123456',
                        'incorporation_country': 'IR',
                        'country': 'IR',
                        'reason': 'Test sanctions entry for organization'
                    },
                    {
                        'id': 'entry003',
                        'type': 'person',
                        'first_name': 'James',
                        'last_name': 'Smith',
                        'middle_name': 'Robert',
                        'date_of_birth': '1975-05-15',
                        'nationality': 'US',
                        'country': 'US',
                        'passport_number': 'US123456',
                        'reason': 'Test sanctions entry with multiple identifiers'
                    }
                ]
            },
            'watchlist002': {
                'id': 'watchlist002',
                'name': 'PEP List',
                'description': 'Test watchlist for politically exposed persons',
                'match_threshold': 80,
                'risk_weight': 70,
                'entries': [
                    {
                        'id': 'entry004',
                        'type': 'person',
                        'first_name': 'Political',
                        'last_name': 'Figure',
                        'date_of_birth': '1970-10-10',
                        'nationality': 'GB',
                        'country': 'GB',
                        'reason': 'Test PEP entry'
                    }
                ]
            }
        }
        
        # Sample AML screening rules
        self.aml_screening_rules = [
            {
                'id': 'aml001',
                'name': 'High-Risk Country Transaction',
                'description': 'Flags transactions from high-risk countries',
                'conditions': {
                    'operator': 'OR',
                    'conditions': [
                        {
                            'field': 'transaction.country',
                            'comparison': 'is_high_risk_country',
                            'value': True
                        },
                        {
                            'field': 'customer.country',
                            'comparison': 'is_high_risk_country',
                            'value': True
                        }
                    ]
                },
                'risk_score': 70,
                'action': 'REVIEW',
                'active': True,
                'transaction_types': ['purchase', 'withdrawal', 'transfer']
            },
            {
                'id': 'aml002',
                'name': 'Large Cash Transaction',
                'description': 'Flags large cash transactions for AML reporting',
                'conditions': {
                    'operator': 'AND',
                    'conditions': [
                        {
                            'field': 'transaction.amount',
                            'comparison': 'greater_than',
                            'value': 10000
                        },
                        {
                            'field': 'transaction.payment_method',
                            'comparison': 'equals',
                            'value': 'cash'
                        }
                    ]
                },
                'risk_score': 80,
                'action': 'REVIEW',
                'active': True,
                'transaction_types': ['deposit', 'withdrawal']
            },
            {
                'id': 'aml003',
                'name': 'Structured Transactions',
                'description': 'Flags potential structuring activity',
                'conditions': {
                    'operator': 'AND',
                    'conditions': [
                        {
                            'field': 'transaction.amount',
                            'comparison': 'greater_than',
                            'value': 8000
                        },
                        {
                            'field': 'transaction.amount',
                            'comparison': 'less_than',
                            'value': 10000
                        }
                    ]
                },
                'risk_score': 60,
                'action': 'REVIEW',
                'active': True,
                'transaction_types': ['deposit', 'withdrawal', 'transfer']
            }
        ]
        
        # Load watchlists and rules into engine
        self.aml_engine.load_watchlists(self.watchlists)
        self.aml_engine.load_screening_rules(self.aml_screening_rules)
    
    def test_exact_name_match(self):
        """Test exact name match in watchlist screening"""
        # Entity that exactly matches a watchlist entry
        entity = {
            'id': 'test001',
            'type': 'person',
            'first_name': 'John',
            'last_name': 'Sanctioned',
            'date_of_birth': '1980-01-01',
            'nationality': 'US',
            'country': 'US'
        }
        
        result = self.aml_engine.screen_entity(entity)
        
        # Verify match found
        self.assertGreater(len(result['matches']), 0)
        self.assertEqual(result['matches'][0]['entry_id'], 'entry001')
        self.assertEqual(result['matches'][0]['match_score'], 100)
        self.assertEqual(result['decision'], 'BLOCK')
    
    def test_fuzzy_name_match(self):
        """Test fuzzy name match in watchlist screening"""
        # Entity with similar but not exact name
        entity = {
            'id': 'test002',
            'type': 'person',
            'first_name': 'Jon',  # Misspelled
            'last_name': 'Sanctiond',  # Misspelled
            'date_of_birth': '1980-01-01',
            'nationality': 'US',
            'country': 'US'
        }
        
        result = self.aml_engine.screen_entity(entity)
        
        # Verify match found
        self.assertGreater(len(result['matches']), 0)
        self.assertEqual(result['matches'][0]['entry_id'], 'entry001')
        self.assertGreater(result['matches'][0]['match_score'], 70)  # Should be high but not 100
        self.assertIn(result['decision'], ['BLOCK', 'REVIEW'])
    
    def test_organization_match(self):
        """Test organization match in watchlist screening"""
        # Organization entity
        entity = {
            'id': 'test003',
            'type': 'organization',
            'name': 'Sanctioned Corp',
            'registration_number': 'SC123456',
            'incorporation_country': 'US',
            'country': 'US'
        }
        
        result = self.aml_engine.screen_entity(entity)
        
        # Verify match found
        self.assertGreater(len(result['matches']), 0)
        self.assertEqual(result['matches'][0]['entry_id'], 'entry002')
        self.assertGreater(result['matches'][0]['match_score'], 80)
        self.assertIn(result['decision'], ['BLOCK', 'REVIEW'])
    
    def test_no_match(self):
        """Test no match in watchlist screening"""
        # Entity that doesn't match any watchlist entry
        entity = {
            'id': 'test004',
            'type': 'person',
            'first_name': 'Jane',
            'last_name': 'Doe',
            'date_of_birth': '1990-05-15',
            'nationality': 'US',
            'country': 'US'
        }
        
        result = self.aml_engine.screen_entity(entity)
        
        # Verify no match found
        self.assertEqual(len(result['matches']), 0)
        self.assertEqual(result['risk_score'], 0)
        self.assertEqual(result['decision'], 'APPROVE')
    
    def test_multiple_watchlist_screening(self):
        """Test screening against multiple watchlists"""
        # Entity that might match entries in multiple watchlists
        entity = {
            'id': 'test005',
            'type': 'person',
            'first_name': 'Political',
            'last_name': 'Figure',
            'date_of_birth': '1970-10-10',
            'nationality': 'GB',
            'country': 'GB'
        }
        
        # Screen against all watchlists
        result = self.aml_engine.screen_entity(entity)
        
        # Verify match found in PEP list
        self.assertGreater(len(result['matches']), 0)
        self.assertEqual(result['matches'][0]['watchlist_id'], 'watchlist002')
        self.assertEqual(result['matches'][0]['entry_id'], 'entry004')
        
        # Screen against specific watchlist
        result = self.aml_engine.screen_entity(entity, watchlist_ids=['watchlist002'])
        
        # Verify match found
        self.assertGreater(len(result['matches']), 0)
        self.assertEqual(result['matches'][0]['watchlist_id'], 'watchlist002')
        
        # Screen against different watchlist
        result = self.aml_engine.screen_entity(entity, watchlist_ids=['watchlist001'])
        
        # Verify no match found
        self.assertEqual(len(result['matches']), 0)
    
    def test_high_risk_country_rule(self):
        """Test high-risk country rule"""
        # Transaction from high-risk country
        transaction = {
            'transaction_id': 'aml_test_001',
            'customer_id': 'cust001',
            'amount': 1000,
            'payment_method': 'bank_transfer',
            'country': 'IR',  # High-risk country
            'transaction_type': 'transfer'
        }
        
        # Customer data
        customer = {
            'id': 'cust001',
            'type': 'person',
            'first_name': 'Test',
            'last_name': 'Customer',
            'country': 'US'
        }
        
        result = self.aml_engine.evaluate_transaction(transaction, customer)
        
        # Verify rule triggered
        self.assertGreater(len(result['triggered_rules']), 0)
        self.assertEqual(result['triggered_rules'][0]['rule_id'], 'aml001')
        self.assertEqual(result['decision'], 'REVIEW')
        
        # Transaction from normal country but customer from high-risk country
        transaction = {
            'transaction_id': 'aml_test_002',
            'customer_id': 'cust002',
            'amount': 1000,
            'payment_method': 'bank_transfer',
            'country': 'US',
            'transaction_type': 'transfer'
        }
        
        # Customer data
        customer = {
            'id': 'cust002',
            'type': 'person',
            'first_name': 'Test',
            'last_name': 'Customer',
            'country': 'IR'  # High-risk country
        }
        
        result = self.aml_engine.evaluate_transaction(transaction, customer)
        
        # Verify rule triggered
        self.assertGreater(len(result['triggered_rules']), 0)
        self.assertEqual(result['triggered_rules'][0]['rule_id'], 'aml001')
        self.assertEqual(result['decision'], 'REVIEW')
    
    def test_large_cash_transaction_rule(self):
        """Test large cash transaction rule"""
        # Large cash transaction
        transaction = {
            'transaction_id': 'aml_test_003',
            'customer_id': 'cust001',
            'amount': 15000,
            'payment_method': 'cash',
            'country': 'US',
            'transaction_type': 'deposit'
        }
        
        # Customer data
        customer = {
            'id': 'cust001',
            'type': 'person',
            'first_name': 'Test',
            'last_name': 'Customer',
            'country': 'US'
        }
        
        result = self.aml_engine.evaluate_transaction(transaction, customer)
        
        # Verify rule triggered
        self.assertGreater(len(result['triggered_rules']), 0)
        self.assertEqual(result['triggered_rules'][0]['rule_id'], 'aml002')
        self.assertEqual(result['decision'], 'REVIEW')
        
        # Not cash transaction
        transaction = {
            'transaction_id': 'aml_test_004',
            'customer_id': 'cust001',
            'amount': 15000,
            'payment_method': 'bank_transfer',
            'country': 'US',
            'transaction_type': 'deposit'
        }
        
        result = self.aml_engine.evaluate_transaction(transaction, customer)
        
        # Verify rule not triggered
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertNotIn('aml002', triggered_rule_ids)
    
    def test_structured_transaction_rule(self):
        """Test structured transaction rule"""
        # Transaction that might be structuring
        transaction = {
            'transaction_id': 'aml_test_005',
            'customer_id': 'cust001',
            'amount': 9500,
            'payment_method': 'cash',
            'country': 'US',
            'transaction_type': 'deposit'
        }
        
        # Customer data
        customer = {
            'id': 'cust001',
            'type': 'person',
            'first_name': 'Test',
            'last_name': 'Customer',
            'country': 'US'
        }
        
        result = self.aml_engine.evaluate_transaction(transaction, customer)
        
        # Verify rule triggered
        self.assertGreater(len(result['triggered_rules']), 0)
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertIn('aml003', triggered_rule_ids)
        self.assertEqual(result['decision'], 'REVIEW')
    
    def test_screening_history(self):
        """Test screening history functionality"""
        # Entity to screen
        entity = {
            'id': 'history_test',
            'type': 'person',
            'first_name': 'John',
            'last_name': 'Doe',
            'date_of_birth': '1980-01-01',
            'nationality': 'US',
            'country': 'US'
        }
        
        # Screen entity multiple times
        for i in range(3):
            self.aml_engine.screen_entity(entity)
        
        # Get screening history
        history = self.aml_engine.get_screening_history('history_test')
        
        # Verify history
        self.assertEqual(len(history), 3)
        self.assertEqual(history[0]['entity_data']['id'], 'history_test')
        self.assertEqual(history[0]['results']['entity_id'], 'history_test')
    
    def test_combined_screening_and_rules(self):
        """Test combined entity screening and rule evaluation"""
        # Entity that matches watchlist
        entity = {
            'id': 'combined_test',
            'type': 'person',
            'first_name': 'John',
            'last_
(Content truncated due to size limit. Use line ranges to read in chunks)