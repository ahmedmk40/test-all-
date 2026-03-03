import unittest
import json
import os
import sys
from datetime import datetime, timedelta

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the fraud detection components
from services.ml_service.ml_service.apps.model_management.fraud_detection_model import FraudDetectionModel
from services.rule_service.rule_service.apps.rule_engine.rule_engine import RuleEngine
from services.velocity_service.velocity_service.apps.velocity_tracking.velocity_engine import VelocityEngine
from services.aml_service.aml_service.apps.screening.aml_screening_engine import AMLScreeningEngine

class TestFraudDetectionSystem(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures"""
        # Initialize all components
        self.ml_model = FraudDetectionModel()
        self.rule_engine = RuleEngine()
        self.velocity_engine = VelocityEngine()
        self.aml_engine = AMLScreeningEngine()
        
        # Load test data
        self.load_test_data()
        
        # Load rules
        self.load_rules()
        
        # Load watchlists
        self.load_watchlists()
    
    def load_test_data(self):
        """Load test transaction data"""
        # Sample transaction data
        self.test_transactions = [
            {
                'transaction_id': 'tx001',
                'customer_id': 'cust001',
                'merchant_id': 'merch001',
                'amount': 100.00,
                'currency': 'USD',
                'transaction_type': 'purchase',
                'payment_method': 'credit_card',
                'card_number_hash': 'hash123',
                'timestamp': datetime.now().isoformat(),
                'ip_address': '192.168.1.1',
                'country': 'US',
                'merchant_category': 'retail',
                'is_fraud': 0  # For ML model training
            },
            {
                'transaction_id': 'tx002',
                'customer_id': 'cust001',
                'merchant_id': 'merch002',
                'amount': 999.99,
                'currency': 'USD',
                'transaction_type': 'purchase',
                'payment_method': 'credit_card',
                'card_number_hash': 'hash123',
                'timestamp': datetime.now().isoformat(),
                'ip_address': '192.168.1.1',
                'country': 'US',
                'merchant_category': 'electronics',
                'is_fraud': 0
            },
            {
                'transaction_id': 'tx003',
                'customer_id': 'cust002',
                'merchant_id': 'merch003',
                'amount': 5000.00,
                'currency': 'USD',
                'transaction_type': 'withdrawal',
                'payment_method': 'bank_transfer',
                'account_number_hash': 'hash456',
                'timestamp': datetime.now().isoformat(),
                'ip_address': '10.0.0.1',
                'country': 'GB',
                'merchant_category': 'financial',
                'is_fraud': 1  # Fraudulent transaction
            }
        ]
        
        # Sample customer data
        self.test_customers = [
            {
                'id': 'cust001',
                'type': 'person',
                'first_name': 'John',
                'last_name': 'Doe',
                'date_of_birth': '1980-01-01',
                'nationality': 'US',
                'country': 'US',
                'address': '123 Main St, Anytown, USA',
                'risk_level': 'low'
            },
            {
                'id': 'cust002',
                'type': 'person',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'date_of_birth': '1985-05-15',
                'nationality': 'GB',
                'country': 'GB',
                'address': '456 High St, London, UK',
                'risk_level': 'medium'
            },
            {
                'id': 'cust003',
                'type': 'organization',
                'name': 'Acme Corp',
                'registration_number': 'REG123456',
                'tax_id': 'TAX987654',
                'incorporation_country': 'US',
                'country': 'US',
                'address': '789 Corporate Ave, Business City, USA',
                'risk_level': 'low'
            }
        ]
        
        # Sample merchant data
        self.test_merchants = [
            {
                'id': 'merch001',
                'type': 'organization',
                'name': 'Retail Store Inc',
                'registration_number': 'M123456',
                'tax_id': 'MT987654',
                'incorporation_country': 'US',
                'country': 'US',
                'category': 'retail',
                'risk_level': 'low'
            },
            {
                'id': 'merch002',
                'type': 'organization',
                'name': 'Electronics Emporium',
                'registration_number': 'M234567',
                'tax_id': 'MT876543',
                'incorporation_country': 'US',
                'country': 'US',
                'category': 'electronics',
                'risk_level': 'low'
            },
            {
                'id': 'merch003',
                'type': 'organization',
                'name': 'International Finance Ltd',
                'registration_number': 'M345678',
                'tax_id': 'MT765432',
                'incorporation_country': 'GB',
                'country': 'GB',
                'category': 'financial',
                'risk_level': 'medium'
            }
        ]
    
    def load_rules(self):
        """Load test rules for rule engine and velocity engine"""
        # Rule engine rules
        self.rule_engine_rules = [
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
            }
        ]
        
        # Velocity engine rules
        self.velocity_engine_rules = [
            {
                'id': 'velocity001',
                'name': 'Multiple Transactions in Short Time',
                'description': 'Flags when customer makes more than 3 transactions in 1 hour',
                'time_window': 1,  # 1 hour
                'threshold': 3,
                'aggregation': 'count',
                'comparison': 'greater_than',
                'risk_score': 40,
                'action': 'REVIEW',
                'active': True,
                'transaction_types': ['purchase', 'withdrawal']
            },
            {
                'id': 'velocity002',
                'name': 'High Total Amount in 24 Hours',
                'description': 'Flags when customer spends more than $5000 in 24 hours',
                'time_window': 24,  # 24 hours
                'threshold': 5000,
                'field': 'amount',
                'aggregation': 'sum',
                'comparison': 'greater_than',
                'risk_score': 60,
                'action': 'REVIEW',
                'active': True,
                'transaction_types': ['purchase', 'withdrawal']
            }
        ]
        
        # AML screening rules
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
            }
        ]
        
        # Load rules into engines
        self.rule_engine.load_rules(self.rule_engine_rules)
        self.velocity_engine.load_velocity_rules(self.velocity_engine_rules)
        self.aml_engine.load_screening_rules(self.aml_screening_rules)
    
    def load_watchlists(self):
        """Load test watchlists for AML screening"""
        self.watchlists = {
            'watchlist001': {
                'id': 'watchlist001',
                'name': 'Test Sanctions List',
                'description': 'Test watchlist for sanctions screening',
                'match_threshold': 70,
                'risk_weight': 100,
                'entries': [
                    {
                        'id': 'entry001',
                        'type': 'person',
                        'first_name': 'John',
                        'last_name': 'Sanctioned',
                        'date_of_birth': '1980-01-01',
                        'nationality': 'US',
                        'reason': 'Test sanctions entry'
                    },
                    {
                        'id': 'entry002',
                        'type': 'organization',
                        'name': 'Sanctioned Corp',
                        'registration_number': 'SC123456',
                        'incorporation_country': 'IR',
                        'reason': 'Test sanctions entry for organization'
                    }
                ]
            }
        }
        
        # Load watchlists into AML engine
        self.aml_engine.load_watchlists(self.watchlists)
    
    def test_ml_model(self):
        """Test machine learning model functionality"""
        # Train model on test data
        import pandas as pd
        df = pd.DataFrame(self.test_transactions)
        
        # Train the model
        training_results = self.ml_model.train(df)
        
        # Verify model is trained
        self.assertTrue(self.ml_model.is_trained)
        
        # Test prediction
        test_tx = pd.DataFrame([self.test_transactions[0]])
        prediction = self.ml_model.predict(test_tx)
        
        # Verify prediction structure
        self.assertIn('fraud_probability', prediction)
        self.assertIn('risk_score', prediction)
        self.assertIn('is_fraud', prediction)
    
    def test_rule_engine(self):
        """Test rule engine functionality"""
        # Test high amount rule
        high_amount_tx = self.test_transactions[2].copy()  # $5000 transaction
        result = self.rule_engine.evaluate_transaction(high_amount_tx)
        
        # Verify rule triggered
        self.assertEqual(len(result['triggered_rules']), 1)
        self.assertEqual(result['triggered_rules'][0]['rule_id'], 'rule001')
        self.assertEqual(result['decision'], 'REVIEW')
        
        # Test international transaction rule
        intl_tx = self.test_transactions[2].copy()  # GB country
        result = self.rule_engine.evaluate_transaction(intl_tx)
        
        # Verify rule triggered
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertIn('rule002', triggered_rule_ids)
        self.assertEqual(result['decision'], 'REVIEW')
        
        # Test non-triggering transaction
        normal_tx = self.test_transactions[0].copy()  # $100 US transaction
        result = self.rule_engine.evaluate_transaction(normal_tx)
        
        # Verify no rules triggered
        self.assertEqual(len(result['triggered_rules']), 0)
        self.assertEqual(result['decision'], 'APPROVE')
    
    def test_velocity_engine(self):
        """Test velocity engine functionality"""
        # Add transactions to velocity engine
        customer_id = 'cust001'
        
        # Create multiple transactions in short time window
        for i in range(5):
            tx = self.test_transactions[0].copy()
            tx['transaction_id'] = f'velocity_test_{i}'
            tx['timestamp'] = (datetime.now() - timedelta(minutes=i*10)).isoformat()
            self.velocity_engine.add_transaction(tx)
        
        # Test velocity detection
        new_tx = self.test_transactions[0].copy()
        new_tx['transaction_id'] = 'velocity_test_new'
        result = self.velocity_engine.evaluate_transaction(new_tx)
        
        # Verify velocity rule triggered
        self.assertGreater(len(result['triggered_rules']), 0)
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertIn('velocity001', triggered_rule_ids)
        
        # Test customer velocity metrics
        metrics = self.velocity_engine.get_customer_velocity_metrics(customer_id, time_window=1)
        self.assertEqual(metrics['customer_id'], customer_id)
        self.assertGreaterEqual(metrics['transaction_count'], 5)
    
    def test_aml_screening(self):
        """Test AML screening functionality"""
        # Test entity screening against watchlist
        # Create a test entity similar to watchlist entry
        test_entity = {
            'id': 'test_entity',
            'type': 'person',
            'first_name': 'John',
            'last_name': 'Sanction',  # Similar but not exact
            'date_of_birth': '1980-01-01',
            'nationality': 'US'
        }
        
        result = self.aml_engine.screen_entity(test_entity)
        
        # Verify screening found a match
        self.assertGreater(len(result['matches']), 0)
        self.assertGreater(result['risk_score'], 0)
        
        # Test transaction evaluation
        high_
(Content truncated due to size limit. Use line ranges to read in chunks)