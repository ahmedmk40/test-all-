import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import os

class FraudDetectionModel:
    def __init__(self, model_path=None):
        """
        Initialize the fraud detection model.
        
        Args:
            model_path: Path to a saved model file. If None, a new model will be created.
        """
        if model_path and os.path.exists(model_path):
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(f"{os.path.splitext(model_path)[0]}_scaler.pkl")
            self.is_trained = True
        else:
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                min_samples_split=10,
                min_samples_leaf=5,
                random_state=42,
                class_weight='balanced'
            )
            self.scaler = StandardScaler()
            self.is_trained = False
    
    def preprocess_data(self, data):
        """
        Preprocess transaction data for model training or prediction.
        
        Args:
            data: DataFrame containing transaction data
            
        Returns:
            Preprocessed features ready for model input
        """
        # Handle missing values
        data = data.fillna(0)
        
        # Extract features
        features = data.drop(['transaction_id', 'is_fraud', 'customer_id', 'merchant_id', 
                             'transaction_date', 'transaction_time'], axis=1, errors='ignore')
        
        # Convert categorical features to numeric
        for col in features.select_dtypes(include=['object']).columns:
            features[col] = pd.factorize(features[col])[0]
        
        # Scale features
        if self.is_trained:
            features_scaled = self.scaler.transform(features)
        else:
            features_scaled = self.scaler.fit_transform(features)
        
        return features_scaled, features.columns
    
    def train(self, data):
        """
        Train the fraud detection model.
        
        Args:
            data: DataFrame containing transaction data with 'is_fraud' label
            
        Returns:
            Training metrics
        """
        # Preprocess data
        X, feature_names = self.preprocess_data(data)
        y = data['is_fraud']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # Train model
        self.model.fit(X_train, y_train)
        self.is_trained = True
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        
        # Calculate feature importance
        feature_importance = pd.DataFrame({
            'feature': feature_names,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        return {
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
            'classification_report': classification_report(y_test, y_pred, output_dict=True),
            'feature_importance': feature_importance.to_dict(orient='records')
        }
    
    def predict(self, transaction_data):
        """
        Predict fraud probability for a transaction.
        
        Args:
            transaction_data: DataFrame containing transaction data
            
        Returns:
            Dictionary with fraud probability and risk score
        """
        if not self.is_trained:
            raise ValueError("Model is not trained yet")
        
        # Preprocess data
        X, _ = self.preprocess_data(transaction_data)
        
        # Get prediction probability
        fraud_prob = self.model.predict_proba(X)[:, 1]
        
        # Calculate risk score (0-100)
        risk_score = (fraud_prob * 100).astype(int)
        
        # Get prediction
        prediction = self.model.predict(X)
        
        return {
            'fraud_probability': fraud_prob.tolist(),
            'risk_score': risk_score.tolist(),
            'is_fraud': prediction.tolist()
        }
    
    def save(self, model_path):
        """
        Save the trained model to disk.
        
        Args:
            model_path: Path to save the model
        """
        if not self.is_trained:
            raise ValueError("Cannot save untrained model")
        
        joblib.dump(self.model, model_path)
        joblib.dump(self.scaler, f"{os.path.splitext(model_path)[0]}_scaler.pkl")
        
    def get_model_info(self):
        """
        Get information about the model.
        
        Returns:
            Dictionary with model information
        """
        if not self.is_trained:
            return {"status": "Not trained"}
        
        return {
            "status": "Trained",
            "model_type": type(self.model).__name__,
            "n_estimators": self.model.n_estimators,
            "max_depth": self.model.max_depth,
            "feature_count": len(self.model.feature_importances_)
        }
