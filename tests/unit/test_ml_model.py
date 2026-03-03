import unittest
import sys
import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the ML model
from services.ml_service.ml_service.apps.model_management.fraud_detection_model import FraudDetectionModel

class TestMLModel(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures"""
        self.ml_model = FraudDetectionModel()
        
        # Generate synthetic training data
        np.random.seed(42)
        n_samples = 1000
        
        # Features
        amount = np.random.exponential(scale=500, size=n_samples)
        hour_of_day = np.random.randint(0, 24, size=n_samples)
        day_of_week = np.random.randint(0, 7, size=n_samples)
        customer_age_days = np.random.randint(1, 1000, size=n_samples)
        merchant_category_codes = np.random.choice(['retail', 'travel', 'food', 'electronics', 'other'], size=n_samples)
        payment_methods = np.random.choice(['credit_card', 'debit_card', 'bank_transfer', 'wallet'], size=n_samples)
        countries = np.random.choice(['US', 'GB', 'CA', 'FR', 'DE', 'JP', 'AU'], size=n_samples)
        
        # Create fraud labels (about 5% fraud rate)
        is_fraud = np.zeros(n_samples, dtype=int)
        
        # Make high amounts more likely to be fraud
        fraud_idx = np.where(amount > 1000)[0]
        fraud_idx = np.random.choice(fraud_idx, size=int(0.2 * len(fraud_idx)), replace=False)
        is_fraud[fraud_idx] = 1
        
        # Make certain merchant categories more likely to be fraud
        high_risk_idx = np.where(merchant_category_codes == 'electronics')[0]
        high_risk_idx = np.random.choice(high_risk_idx, size=int(0.1 * len(high_risk_idx)), replace=False)
        is_fraud[high_risk_idx] = 1
        
        # Make certain hours more likely to be fraud
        night_hours_idx = np.where((hour_of_day >= 0) & (hour_of_day <= 5))[0]
        night_hours_idx = np.random.choice(night_hours_idx, size=int(0.1 * len(night_hours_idx)), replace=False)
        is_fraud[night_hours_idx] = 1
        
        # Make new customers more likely to be fraud
        new_customer_idx = np.where(customer_age_days < 30)[0]
        new_customer_idx = np.random.choice(new_customer_idx, size=int(0.1 * len(new_customer_idx)), replace=False)
        is_fraud[new_customer_idx] = 1
        
        # Create transaction IDs and timestamps
        transaction_ids = [f'tx_{i}' for i in range(n_samples)]
        base_time = datetime.now() - timedelta(days=30)
        timestamps = [base_time + timedelta(hours=i % 720) for i in range(n_samples)]
        
        # Create DataFrame
        self.training_data = pd.DataFrame({
            'transaction_id': transaction_ids,
            'amount': amount,
            'hour_of_day': hour_of_day,
            'day_of_week': day_of_week,
            'customer_age_days': customer_age_days,
            'merchant_category': merchant_category_codes,
            'payment_method': payment_methods,
            'country': countries,
            'is_fraud': is_fraud,
            'transaction_date': [ts.date() for ts in timestamps],
            'transaction_time': [ts.time() for ts in timestamps]
        })
        
        # Generate test transactions
        self.test_transactions = [
            {
                'transaction_id': 'test_tx_001',
                'amount': 100.00,
                'hour_of_day': 14,
                'day_of_week': 2,
                'customer_age_days': 500,
                'merchant_category': 'retail',
                'payment_method': 'credit_card',
                'country': 'US',
                'transaction_date': datetime.now().date(),
                'transaction_time': datetime.now().time()
            },
            {
                'transaction_id': 'test_tx_002',
                'amount': 2000.00,
                'hour_of_day': 2,
                'day_of_week': 6,
                'customer_age_days': 10,
                'merchant_category': 'electronics',
                'payment_method': 'credit_card',
                'country': 'US',
                'transaction_date': datetime.now().date(),
                'transaction_time': datetime.now().time()
            }
        ]
    
    def test_model_training(self):
        """Test model training functionality"""
        # Train the model
        training_results = self.ml_model.train(self.training_data)
        
        # Verify model is trained
        self.assertTrue(self.ml_model.is_trained)
        
        # Verify training results structure
        self.assertIn('confusion_matrix', training_results)
        self.assertIn('classification_report', training_results)
        self.assertIn('feature_importance', training_results)
        
        # Verify classification report has expected metrics
        report = training_results['classification_report']
        self.assertIn('accuracy', report)
        self.assertIn('precision', report)
        self.assertIn('recall', report)
        self.assertIn('f1-score', report)
        
        # Verify feature importance is returned
        self.assertGreater(len(training_results['feature_importance']), 0)
    
    def test_model_prediction(self):
        """Test model prediction functionality"""
        # Train the model first
        self.ml_model.train(self.training_data)
        
        # Convert test transactions to DataFrame
        test_df = pd.DataFrame(self.test_transactions)
        
        # Test prediction
        prediction = self.ml_model.predict(test_df)
        
        # Verify prediction structure
        self.assertIn('fraud_probability', prediction)
        self.assertIn('risk_score', prediction)
        self.assertIn('is_fraud', prediction)
        
        # Verify prediction lengths match input
        self.assertEqual(len(prediction['fraud_probability']), len(self.test_transactions))
        self.assertEqual(len(prediction['risk_score']), len(self.test_transactions))
        self.assertEqual(len(prediction['is_fraud']), len(self.test_transactions))
        
        # Verify risk scores are between 0 and 100
        for score in prediction['risk_score']:
            self.assertGreaterEqual(score, 0)
            self.assertLessEqual(score, 100)
        
        # Verify fraud probabilities are between 0 and 1
        for prob in prediction['fraud_probability']:
            self.assertGreaterEqual(prob, 0)
            self.assertLessEqual(prob, 1)
    
    def test_model_save_load(self):
        """Test model save and load functionality"""
        # Train the model
        self.ml_model.train(self.training_data)
        
        # Save the model
        model_path = '/tmp/test_fraud_model.pkl'
        self.ml_model.save(model_path)
        
        # Verify model file exists
        self.assertTrue(os.path.exists(model_path))
        self.assertTrue(os.path.exists(f"{os.path.splitext(model_path)[0]}_scaler.pkl"))
        
        # Load the model in a new instance
        loaded_model = FraudDetectionModel(model_path)
        
        # Verify loaded model is trained
        self.assertTrue(loaded_model.is_trained)
        
        # Test prediction with loaded model
        test_df = pd.DataFrame(self.test_transactions)
        prediction = loaded_model.predict(test_df)
        
        # Verify prediction structure
        self.assertIn('fraud_probability', prediction)
        self.assertIn('risk_score', prediction)
        self.assertIn('is_fraud', prediction)
        
        # Clean up
        os.remove(model_path)
        os.remove(f"{os.path.splitext(model_path)[0]}_scaler.pkl")
    
    def test_model_info(self):
        """Test model info functionality"""
        # Get info before training
        info = self.ml_model.get_model_info()
        self.assertEqual(info['status'], 'Not trained')
        
        # Train the model
        self.ml_model.train(self.training_data)
        
        # Get info after training
        info = self.ml_model.get_model_info()
        self.assertEqual(info['status'], 'Trained')
        self.assertEqual(info['model_type'], 'RandomForestClassifier')
        self.assertEqual(info['n_estimators'], 100)
        self.assertEqual(info['max_depth'], 10)
        self.assertGreater(info['feature_count'], 0)
    
    def test_high_risk_prediction(self):
        """Test prediction on high-risk transaction"""
        # Train the model
        self.ml_model.train(self.training_data)
        
        # Create a high-risk transaction
        high_risk_tx = pd.DataFrame([{
            'transaction_id': 'high_risk_tx',
            'amount': 5000.00,
            'hour_of_day': 3,
            'day_of_week': 6,
            'customer_age_days': 5,
            'merchant_category': 'electronics',
            'payment_method': 'credit_card',
            'country': 'RU',
            'transaction_date': datetime.now().date(),
            'transaction_time': datetime.now().time()
        }])
        
        # Test prediction
        prediction = self.ml_model.predict(high_risk_tx)
        
        # High-risk transaction should have higher fraud probability
        self.assertGreater(prediction['fraud_probability'][0], 0.3)
        self.assertGreater(prediction['risk_score'][0], 30)
    
    def test_low_risk_prediction(self):
        """Test prediction on low-risk transaction"""
        # Train the model
        self.ml_model.train(self.training_data)
        
        # Create a low-risk transaction
        low_risk_tx = pd.DataFrame([{
            'transaction_id': 'low_risk_tx',
            'amount': 50.00,
            'hour_of_day': 14,
            'day_of_week': 3,
            'customer_age_days': 500,
            'merchant_category': 'food',
            'payment_method': 'debit_card',
            'country': 'US',
            'transaction_date': datetime.now().date(),
            'transaction_time': datetime.now().time()
        }])
        
        # Test prediction
        prediction = self.ml_model.predict(low_risk_tx)
        
        # Low-risk transaction should have lower fraud probability
        self.assertLess(prediction['fraud_probability'][0], 0.3)
        self.assertLess(prediction['risk_score'][0], 30)
    
    def test_untrained_model_error(self):
        """Test error when using untrained model for prediction"""
        # Create a new model instance (untrained)
        untrained_model = FraudDetectionModel()
        
        # Try to predict with untrained model
        test_df = pd.DataFrame(self.test_transactions)
        
        # Should raise ValueError
        with self.assertRaises(ValueError):
            untrained_model.predict(test_df)
    
    def test_feature_preprocessing(self):
        """Test feature preprocessing functionality"""
        # Train the model
        self.ml_model.train(self.training_data)
        
        # Create a transaction with missing values
        tx_with_missing = pd.DataFrame([{
            'transaction_id': 'missing_values_tx',
            'amount': 100.00,
            'hour_of_day': None,
            'day_of_week': 3,
            'customer_age_days': None,
            'merchant_category': 'retail',
            'payment_method': None,
            'country': 'US',
            'transaction_date': datetime.now().date(),
            'transaction_time': datetime.now().time()
        }])
        
        # Test prediction - should handle missing values
        prediction = self.ml_model.predict(tx_with_missing)
        
        # Verify prediction structure
        self.assertIn('fraud_probability', prediction)
        self.assertIn('risk_score', prediction)
        self.assertIn('is_fraud', prediction)

if __name__ == '__main__':
    unittest.main()
