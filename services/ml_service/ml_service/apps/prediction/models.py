from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class Prediction(models.Model):
    """
    Record of model predictions
    """
    PREDICTION_TYPES = (
        ('fraud_score', 'Fraud Score'),
        ('risk_classification', 'Risk Classification'),
        ('anomaly_score', 'Anomaly Score'),
        ('segment', 'Customer Segment'),
    )
    
    prediction_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    model_id = models.CharField(max_length=100)
    model_version = models.CharField(max_length=20)
    
    # Prediction details
    prediction_type = models.CharField(max_length=20, choices=PREDICTION_TYPES)
    prediction_value = JSONField()  # Could be a score, class, etc.
    confidence = models.FloatField(null=True, blank=True)
    
    # Input data
    input_features = JSONField()
    
    # Explanation
    feature_importance = JSONField(null=True, blank=True)
    explanation = JSONField(null=True, blank=True)
    
    # Performance
    execution_time_ms = models.FloatField(null=True, blank=True)
    
    # Timestamps
    prediction_time = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'predictions'
        indexes = [
            models.Index(fields=['prediction_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['model_id', 'model_version']),
            models.Index(fields=['prediction_type']),
            models.Index(fields=['prediction_time']),
        ]


class PredictionFeedback(models.Model):
    """
    Feedback on model predictions
    """
    FEEDBACK_TYPES = (
        ('true_positive', 'True Positive'),
        ('false_positive', 'False Positive'),
        ('true_negative', 'True Negative'),
        ('false_negative', 'False Negative'),
        ('other', 'Other'),
    )
    
    feedback_id = models.CharField(max_length=100, unique=True)
    prediction_id = models.CharField(max_length=100)
    
    # Feedback details
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_TYPES)
    feedback_value = JSONField(null=True, blank=True)  # Additional feedback data
    comments = models.TextField(null=True, blank=True)
    
    # Source
    source = models.CharField(max_length=100)  # Who provided the feedback
    
    # Timestamps
    feedback_time = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'prediction_feedback'
        indexes = [
            models.Index(fields=['feedback_id']),
            models.Index(fields=['prediction_id']),
            models.Index(fields=['feedback_type']),
            models.Index(fields=['feedback_time']),
        ]


class PredictionSignal(models.Model):
    """
    Signals sent to Signal Service
    """
    signal_id = models.CharField(max_length=100, unique=True)
    prediction_id = models.CharField(max_length=100)
    transaction_id = models.CharField(max_length=100)
    
    # Signal details
    signal_type = models.CharField(max_length=50)
    risk_score = models.FloatField(null=True, blank=True)
    
    # Signal content
    payload = JSONField()
    
    # Delivery status
    is_delivered = models.BooleanField(default=False)
    delivery_attempts = models.IntegerField(default=0)
    last_attempt = models.DateTimeField(null=True, blank=True)
    delivery_error = models.TextField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'prediction_signals'
        indexes = [
            models.Index(fields=['signal_id']),
            models.Index(fields=['prediction_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['is_delivered']),
            models.Index(fields=['created_at']),
        ]


class PredictionMetrics(models.Model):
    """
    Performance metrics for predictions
    """
    model_id = models.CharField(max_length=100)
    model_version = models.CharField(max_length=20)
    date = models.DateField()
    
    # Volume metrics
    total_predictions = models.IntegerField(default=0)
    
    # Performance metrics
    average_execution_time_ms = models.FloatField(null=True, blank=True)
    p95_execution_time_ms = models.FloatField(null=True, blank=True)
    p99_execution_time_ms = models.FloatField(null=True, blank=True)
    
    # Accuracy metrics
    true_positives = models.IntegerField(default=0)
    false_positives = models.IntegerField(default=0)
    true_negatives = models.IntegerField(default=0)
    false_negatives = models.IntegerField(default=0)
    
    # Derived metrics
    precision = models.FloatField(null=True, blank=True)
    recall = models.FloatField(null=True, blank=True)
    f1_score = models.FloatField(null=True, blank=True)
    auc_roc = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'prediction_metrics'
        indexes = [
            models.Index(fields=['model_id', 'model_version']),
            models.Index(fields=['date']),
        ]
        unique_together = ('model_id', 'model_version', 'date')
