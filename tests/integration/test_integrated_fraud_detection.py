import unittest
import sys
import os
from datetime import datetime

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import all the components
from services.rule_service.rule_service.apps.rule_engine.rule_engine import RuleEngine
from services.velocity_service.velocity_service.apps.velocity_tracking.velocity_engine import VelocityEngine
from services.ml_service.ml_service.apps.model_management.fraud_detection_model import FraudDetectionModel
from services.aml_service.aml_service.apps.screening.aml_screening_engine import AMLScreeningEngine
from services.signal_service.signal_service.apps.event_stream.models import Signal

class TestIntegratedFraudDetection(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures"""
        # Initialize all engines
        self.rule_engine = RuleEngine()
        self.velocity_engine = VelocityEngine()
        self.ml_model = FraudDetectionModel()
        self.aml_engine = AMLScreeningEngine()
        
        # Load sample rules, models, and watchlists
        self._setup_rule_engine()
        self._setup_velocity_engine()
        self._setup_ml_model()
        self._setup_aml_engine()
        
        # Sample customer data
        self.customer = {
            'id': 'cust001',
            'type': 'person',
            'first_name': 'John',
            'last_name': 'Doe',
            'date_of_birth': '1980-01-01',
            'nationality': 'US',
            'country': 'US',
            'customer_age_days': 500
        }
        
        # Sample transaction data
        self.transaction = {
            'transaction_id': 'tx001',
            'customer_id': 'cust001',
            'amount': 500.00,
            'currency': 'USD',
            'transaction_type': 'purchase',
            'merchant_id': 'merchant_001',
            'merchant_category': 'retail',
            'timestamp': datetime.now().isoformat(),
            'country': 'US',
            'payment_method': 'credit_card',
            'hour_of_day': datetime.now().hour,
            'day_of_week': datetime.now().weekday()
        }
    
    def _setup_rule_engine(self):
        """Set up rule engine with sample rules"""
        rules = [
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
        self.rule_engine.load_rules(rules)
    
    def _setup_velocity_engine(self):
        """Set up velocity engine with sample rules"""
        velocity_rules = [
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
            }
        ]
        self.velocity_engine.load_velocity_rules(velocity_rules)
    
    def _setup_ml_model(self):
        """Set up ML model with sample training data"""
        # For testing purposes, we'll just set a mock prediction function
        self.ml_model.is_trained = True
        self.ml_model._mock_prediction = True
    
    def _setup_aml_engine(self):
        """Set up AML engine with sample watchlists and rules"""
        watchlists = {
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
                        'first_name': 'Sanctioned',
                        'last_name': 'Person',
                        'date_of_birth': '1980-01-01',
                        'nationality': 'IR',
                        'country': 'IR',
                        'reason': 'Test sanctions entry'
                    }
                ]
            }
        }
        
        aml_rules = [
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
                        }
                    ]
                },
                'risk_score': 70,
                'action': 'REVIEW',
                'active': True,
                'transaction_types': ['purchase', 'withdrawal', 'transfer']
            }
        ]
        
        self.aml_engine.load_watchlists(watchlists)
        self.aml_engine.load_screening_rules(aml_rules)
    
    def test_integrated_fraud_detection(self):
        """Test integrated fraud detection with all engines"""
        # Create a transaction that should trigger rules
        high_risk_tx = self.transaction.copy()
        high_risk_tx['amount'] = 2000.00
        high_risk_tx['country'] = 'IR'
        
        # Process transaction through all engines
        rule_result = self.rule_engine.evaluate_transaction(high_risk_tx)
        velocity_result = self.velocity_engine.evaluate_transaction(high_risk_tx)
        ml_result = self.ml_model.predict([high_risk_tx])
        aml_result = self.aml_engine.evaluate_transaction(high_risk_tx, self.customer)
        
        # Combine results
        combined_result = self._combine_results(high_risk_tx, rule_result, velocity_result, ml_result, aml_result)
        
        # Verify combined result
        self.assertEqual(combined_result['transaction_id'], high_risk_tx['transaction_id'])
        self.assertGreater(combined_result['risk_score'], 0)
        self.assertEqual(combined_result['decision'], 'REVIEW')
        self.assertGreater(len(combined_result['signals']), 0)
    
    def test_low_risk_transaction(self):
        """Test integrated fraud detection with low-risk transaction"""
        # Create a transaction that should not trigger rules
        low_risk_tx = self.transaction.copy()
        
        # Process transaction through all engines
        rule_result = self.rule_engine.evaluate_transaction(low_risk_tx)
        velocity_result = self.velocity_engine.evaluate_transaction(low_risk_tx)
        ml_result = self.ml_model.predict([low_risk_tx])
        aml_result = self.aml_engine.evaluate_transaction(low_risk_tx, self.customer)
        
        # Combine results
        combined_result = self._combine_results(low_risk_tx, rule_result, velocity_result, ml_result, aml_result)
        
        # Verify combined result
        self.assertEqual(combined_result['transaction_id'], low_risk_tx['transaction_id'])
        self.assertEqual(combined_result['decision'], 'APPROVE')
        self.assertEqual(len(combined_result['signals']), 0)
    
    def test_watchlist_match(self):
        """Test integrated fraud detection with watchlist match"""
        # Create a customer that matches watchlist
        sanctioned_customer = self.customer.copy()
        sanctioned_customer['first_name'] = 'Sanctioned'
        sanctioned_customer['last_name'] = 'Person'
        
        # Create a normal transaction
        normal_tx = self.transaction.copy()
        
        # Process transaction through all engines
        rule_result = self.rule_engine.evaluate_transaction(normal_tx)
        velocity_result = self.velocity_engine.evaluate_transaction(normal_tx)
        ml_result = self.ml_model.predict([normal_tx])
        aml_result = self.aml_engine.evaluate_transaction(normal_tx, sanctioned_customer)
        
        # Combine results
        combined_result = self._combine_results(normal_tx, rule_result, velocity_result, ml_result, aml_result)
        
        # Verify combined result
        self.assertEqual(combined_result['transaction_id'], normal_tx['transaction_id'])
        self.assertEqual(combined_result['decision'], 'BLOCK')
        self.assertGreater(len(combined_result['signals']), 0)
    
    def test_multiple_signals(self):
        """Test integrated fraud detection with multiple signals"""
        # Create a transaction that should trigger multiple rules
        multi_signal_tx = self.transaction.copy()
        multi_signal_tx['amount'] = 2000.00
        multi_signal_tx['country'] = 'IR'
        
        # Add velocity history
        for i in range(3):
            history_tx = multi_signal_tx.copy()
            history_tx['transaction_id'] = f'history_{i}'
            self.velocity_engine.add_transaction(history_tx)
        
        # Process transaction through all engines
        rule_result = self.rule_engine.evaluate_transaction(multi_signal_tx)
        velocity_result = self.velocity_engine.evaluate_transaction(multi_signal_tx)
        ml_result = self.ml_model.predict([multi_signal_tx])
        aml_result = self.aml_engine.evaluate_transaction(multi_signal_tx, self.customer)
        
        # Combine results
        combined_result = self._combine_results(multi_signal_tx, rule_result, velocity_result, ml_result, aml_result)
        
        # Verify combined result
        self.assertEqual(combined_result['transaction_id'], multi_signal_tx['transaction_id'])
        self.assertGreater(combined_result['risk_score'], 100)
        self.assertEqual(combined_result['decision'], 'REVIEW')
        self.assertGreater(len(combined_result['signals']), 2)
    
    def _combine_results(self, transaction, rule_result, velocity_result, ml_result, aml_result):
        """Combine results from all engines"""
        signals = []
        total_risk_score = 0
        decisions = []
        
        # Process rule engine results
        if rule_result['triggered_rules']:
            for rule in rule_result['triggered_rules']:
                signals.append({
                    'source': 'rule_engine',
                    'type': 'rule_trigger',
                    'rule_id': rule['rule_id'],
                    'risk_score': rule['risk_score']
                })
                total_risk_score += rule['risk_score']
            decisions.append(rule_result['decision'])
        
        # Process velocity engine results
        if velocity_result['triggered_rules']:
            for rule in velocity_result['triggered_rules']:
                signals.append({
                    'source': 'velocity_engine',
                    'type': 'velocity_trigger',
                    'rule_id': rule['rule_id'],
                    'risk_score': rule['risk_score']
                })
                total_risk_score += rule['risk_score']
            decisions.append(velocity_result['decision'])
        
        # Process ML model results
        if hasattr(ml_result, 'get') and ml_result.get('risk_score') and ml_result['risk_score'][0] > 50:
            signals.append({
                'source': 'ml_model',
                'type': 'ml_prediction',
                'risk_score': ml_result['risk_score'][0]
            })
            total_risk_score += ml_result['risk_score'][0]
            decisions.append('REVIEW')
        
        # Process AML engine results
        if aml_result['triggered_rules'] or (aml_result.get('customer_screening') and aml_result['customer_screening']['matches']):
            if aml_result['triggered_rules']:
                for rule in aml_result['triggered_rules']:
                    signals.append({
                        'source': 'aml_engine',
                        'type': 'aml_rule_trigger',
                        'rule_id': rule['rule_id'],
                        'risk_score': rule['risk_score']
                    })
                    total_risk_score += rule['risk_score']
            
            if aml_result.get('customer_screening') and aml_result['customer_screening']['matches']:
                signals.append({
                    'source': 'aml_engine',
                    'type': 'watchlist_match',
                    'watchlist_id': aml_result['customer_screening']['matches'][0]['watchlist_id'],
                    'risk_score': 100
                })
                total_risk_score += 100
                decisions.append('BLOCK')
            else:
                decisions.append(aml_result['decision'])
        
        # Determine final decision
        final_decision = 'APPROVE'
        if 'BLOCK' in decisions:
            final_decision = 'BLOCK'
        elif 'REVIEW' in decisions:
            final_decision = 'REVIEW'
        
        return {
            'transaction_id': transaction['transaction_id'],
            'customer_id': transaction['customer_id'],
            'risk_score': total_risk_score,
            'decision': final_decision,
            'signals': signals,
            'timestamp': datetime.now().isoformat()
        }

if __name__ == '__main__':
    unittest.main()
