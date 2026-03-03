import unittest
import sys
import os
import pandas as pd
from datetime import datetime, timedelta

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the velocity engine
from services.velocity_service.velocity_service.apps.velocity_tracking.velocity_engine import VelocityEngine

class TestVelocityEngine(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures"""
        self.velocity_engine = VelocityEngine()
        
        # Sample velocity rules
        self.velocity_rules = [
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
            },
            {
                'id': 'velocity003',
                'name': 'Multiple Countries in 24 Hours',
                'description': 'Flags when customer transacts in more than 2 countries in 24 hours',
                'time_window': 24,  # 24 hours
                'threshold': 2,
                'field': 'country',
                'aggregation': 'unique_count',
                'comparison': 'greater_than',
                'risk_score': 70,
                'action': 'REVIEW',
                'active': True,
                'transaction_types': ['purchase', 'withdrawal', 'transfer']
            },
            {
                'id': 'velocity004',
                'name': 'Multiple Merchants in 1 Hour',
                'description': 'Flags when customer transacts with more than 5 merchants in 1 hour',
                'time_window': 1,  # 1 hour
                'threshold': 5,
                'field': 'merchant_id',
                'aggregation': 'unique_count',
                'comparison': 'greater_than',
                'risk_score': 50,
                'action': 'REVIEW',
                'active': True,
                'transaction_types': ['purchase']
            },
            {
                'id': 'velocity005',
                'name': 'Inactive Velocity Rule',
                'description': 'This rule should not trigger as it is inactive',
                'time_window': 1,  # 1 hour
                'threshold': 1,
                'aggregation': 'count',
                'comparison': 'greater_than',
                'risk_score': 10,
                'action': 'REVIEW',
                'active': False,
                'transaction_types': ['purchase', 'withdrawal']
            },
            {
                'id': 'velocity006',
                'name': 'Average Transaction Amount Spike',
                'description': 'Flags when average transaction amount exceeds $1000 in 24 hours',
                'time_window': 24,  # 24 hours
                'threshold': 1000,
                'field': 'amount',
                'aggregation': 'avg',
                'comparison': 'greater_than',
                'risk_score': 45,
                'action': 'REVIEW',
                'active': True,
                'transaction_types': ['purchase', 'withdrawal']
            },
            {
                'id': 'velocity007',
                'name': 'Group By Merchant Category',
                'description': 'Flags when customer makes more than 3 transactions in same merchant category in 1 hour',
                'time_window': 1,  # 1 hour
                'threshold': 3,
                'aggregation': 'count',
                'comparison': 'greater_than',
                'risk_score': 35,
                'action': 'REVIEW',
                'active': True,
                'group_by': 'merchant_category',
                'transaction_types': ['purchase']
            }
        ]
        
        # Load velocity rules into engine
        self.velocity_engine.load_velocity_rules(self.velocity_rules)
        
        # Sample customer ID
        self.customer_id = 'test_customer_001'
    
    def test_transaction_count_velocity(self):
        """Test transaction count velocity detection"""
        # Add multiple transactions in short time window
        for i in range(4):
            tx = {
                'transaction_id': f'velocity_test_{i}',
                'customer_id': self.customer_id,
                'amount': 100.00,
                'currency': 'USD',
                'transaction_type': 'purchase',
                'merchant_id': f'merchant_{i}',
                'merchant_category': 'retail',
                'timestamp': (datetime.now() - timedelta(minutes=i*10)).isoformat(),
                'country': 'US'
            }
            self.velocity_engine.add_transaction(tx)
        
        # Test velocity detection
        new_tx = {
            'transaction_id': 'velocity_test_new',
            'customer_id': self.customer_id,
            'amount': 100.00,
            'currency': 'USD',
            'transaction_type': 'purchase',
            'merchant_id': 'merchant_new',
            'merchant_category': 'retail',
            'timestamp': datetime.now().isoformat(),
            'country': 'US'
        }
        
        result = self.velocity_engine.evaluate_transaction(new_tx)
        
        # Verify velocity rule triggered
        self.assertGreater(len(result['triggered_rules']), 0)
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertIn('velocity001', triggered_rule_ids)
        self.assertEqual(result['decision'], 'REVIEW')
    
    def test_amount_sum_velocity(self):
        """Test amount sum velocity detection"""
        # Add transactions with high total amount
        for i in range(3):
            tx = {
                'transaction_id': f'amount_test_{i}',
                'customer_id': self.customer_id,
                'amount': 2000.00,  # Total will be $6000
                'currency': 'USD',
                'transaction_type': 'purchase',
                'merchant_id': f'merchant_{i}',
                'merchant_category': 'retail',
                'timestamp': (datetime.now() - timedelta(hours=i*2)).isoformat(),
                'country': 'US'
            }
            self.velocity_engine.add_transaction(tx)
        
        # Test velocity detection
        new_tx = {
            'transaction_id': 'amount_test_new',
            'customer_id': self.customer_id,
            'amount': 100.00,
            'currency': 'USD',
            'transaction_type': 'purchase',
            'merchant_id': 'merchant_new',
            'merchant_category': 'retail',
            'timestamp': datetime.now().isoformat(),
            'country': 'US'
        }
        
        result = self.velocity_engine.evaluate_transaction(new_tx)
        
        # Verify velocity rule triggered
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertIn('velocity002', triggered_rule_ids)
        self.assertEqual(result['decision'], 'REVIEW')
    
    def test_unique_countries_velocity(self):
        """Test unique countries velocity detection"""
        # Add transactions from multiple countries
        countries = ['US', 'GB', 'FR', 'DE']
        for i, country in enumerate(countries):
            tx = {
                'transaction_id': f'country_test_{i}',
                'customer_id': self.customer_id,
                'amount': 100.00,
                'currency': 'USD',
                'transaction_type': 'purchase',
                'merchant_id': f'merchant_{i}',
                'merchant_category': 'retail',
                'timestamp': (datetime.now() - timedelta(hours=i*2)).isoformat(),
                'country': country
            }
            self.velocity_engine.add_transaction(tx)
        
        # Test velocity detection
        new_tx = {
            'transaction_id': 'country_test_new',
            'customer_id': self.customer_id,
            'amount': 100.00,
            'currency': 'USD',
            'transaction_type': 'purchase',
            'merchant_id': 'merchant_new',
            'merchant_category': 'retail',
            'timestamp': datetime.now().isoformat(),
            'country': 'CA'  # Another country
        }
        
        result = self.velocity_engine.evaluate_transaction(new_tx)
        
        # Verify velocity rule triggered
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertIn('velocity003', triggered_rule_ids)
        self.assertEqual(result['decision'], 'REVIEW')
    
    def test_unique_merchants_velocity(self):
        """Test unique merchants velocity detection"""
        # Add transactions with multiple merchants
        for i in range(6):
            tx = {
                'transaction_id': f'merchant_test_{i}',
                'customer_id': self.customer_id,
                'amount': 100.00,
                'currency': 'USD',
                'transaction_type': 'purchase',
                'merchant_id': f'merchant_{i}',
                'merchant_category': 'retail',
                'timestamp': (datetime.now() - timedelta(minutes=i*5)).isoformat(),
                'country': 'US'
            }
            self.velocity_engine.add_transaction(tx)
        
        # Test velocity detection
        new_tx = {
            'transaction_id': 'merchant_test_new',
            'customer_id': self.customer_id,
            'amount': 100.00,
            'currency': 'USD',
            'transaction_type': 'purchase',
            'merchant_id': 'merchant_new',
            'merchant_category': 'retail',
            'timestamp': datetime.now().isoformat(),
            'country': 'US'
        }
        
        result = self.velocity_engine.evaluate_transaction(new_tx)
        
        # Verify velocity rule triggered
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertIn('velocity004', triggered_rule_ids)
        self.assertEqual(result['decision'], 'REVIEW')
    
    def test_inactive_velocity_rule(self):
        """Test inactive velocity rule does not trigger"""
        # Add a transaction
        tx = {
            'transaction_id': 'inactive_test',
            'customer_id': self.customer_id,
            'amount': 100.00,
            'currency': 'USD',
            'transaction_type': 'purchase',
            'merchant_id': 'merchant_test',
            'merchant_category': 'retail',
            'timestamp': datetime.now().isoformat(),
            'country': 'US'
        }
        self.velocity_engine.add_transaction(tx)
        
        # Test velocity detection
        new_tx = {
            'transaction_id': 'inactive_test_new',
            'customer_id': self.customer_id,
            'amount': 100.00,
            'currency': 'USD',
            'transaction_type': 'purchase',
            'merchant_id': 'merchant_new',
            'merchant_category': 'retail',
            'timestamp': datetime.now().isoformat(),
            'country': 'US'
        }
        
        result = self.velocity_engine.evaluate_transaction(new_tx)
        
        # Verify inactive rule did not trigger
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertNotIn('velocity005', triggered_rule_ids)
    
    def test_average_amount_velocity(self):
        """Test average amount velocity detection"""
        # Add transactions with high average amount
        for i in range(3):
            tx = {
                'transaction_id': f'avg_test_{i}',
                'customer_id': self.customer_id,
                'amount': 1500.00,  # Average will be $1500
                'currency': 'USD',
                'transaction_type': 'purchase',
                'merchant_id': f'merchant_{i}',
                'merchant_category': 'retail',
                'timestamp': (datetime.now() - timedelta(hours=i*2)).isoformat(),
                'country': 'US'
            }
            self.velocity_engine.add_transaction(tx)
        
        # Test velocity detection
        new_tx = {
            'transaction_id': 'avg_test_new',
            'customer_id': self.customer_id,
            'amount': 1500.00,
            'currency': 'USD',
            'transaction_type': 'purchase',
            'merchant_id': 'merchant_new',
            'merchant_category': 'retail',
            'timestamp': datetime.now().isoformat(),
            'country': 'US'
        }
        
        result = self.velocity_engine.evaluate_transaction(new_tx)
        
        # Verify velocity rule triggered
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertIn('velocity006', triggered_rule_ids)
        self.assertEqual(result['decision'], 'REVIEW')
    
    def test_group_by_merchant_category(self):
        """Test group by merchant category velocity detection"""
        # Add multiple transactions in same merchant category
        for i in range(4):
            tx = {
                'transaction_id': f'category_test_{i}',
                'customer_id': self.customer_id,
                'amount': 100.00,
                'currency': 'USD',
                'transaction_type': 'purchase',
                'merchant_id': f'merchant_{i}',
                'merchant_category': 'electronics',  # Same category
                'timestamp': (datetime.now() - timedelta(minutes=i*10)).isoformat(),
                'country': 'US'
            }
            self.velocity_engine.add_transaction(tx)
        
        # Test velocity detection
        new_tx = {
            'transaction_id': 'category_test_new',
            'customer_id': self.customer_id,
            'amount': 100.00,
            'currency': 'USD',
            'transaction_type': 'purchase',
            'merchant_id': 'merchant_new',
            'merchant_category': 'electronics',  # Same category
            'timestamp': datetime.now().isoformat(),
            'country': 'US'
        }
        
        result = self.velocity_engine.evaluate_transaction(new_tx)
        
        # Verify velocity rule triggered
        triggered_rule_ids = [r['rule_id'] for r in result['triggered_rules']]
        self.assertIn('velocity007', triggered_rule_ids)
        self.assertEqual(result['decision'], 'REVIEW')
    
    def test_customer_velocity_metrics(self):
        """Test customer velocity metrics calculation"""
        # Add various transactions
        for i in range(5):
            tx = {
                'transaction_id': f'metrics_test_{i}',
                'customer_id': self.customer_id,
                'amount': 100.00 * (i + 1),
                'currency': 'USD',
                'transaction_type': 'purchase',
                'merchant_id': f'merchant_{i % 3}',  # 3 unique merchants
                'merchant_category': 'retail',
                'timestamp': (datetime.now() - timedelta(hours=i)).isoformat(),
                'country': 'US' if i % 2 == 0 else 'CA'  # 2 unique countries
            }
            self.velocity_engine.add_transaction(tx)
        
        # Get velocity metrics
        metrics = self.velocity_engine.get_customer_velocity_
(Content truncated due to size limit. Use line ranges to read in chunks)