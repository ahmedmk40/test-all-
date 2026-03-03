from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class MLModel(models.Model):
    """
    Machine Learning model metadata
    """
    MODEL_TYPES = (
        ('anomaly_detection', 'Anomaly Detection'),
        ('classification', 'Classification'),
        ('behavioral', 'Behavioral Analysis'),
        ('network', 'Network Analysis'),
        ('adaptive_threshold', 'Adaptive Threshold'),
    )
    
    STATUS_CHOICES = (
        ('development', 'In Development'),
        ('training', 'Training'),
        ('validation', 'Validation'),
        ('production', 'In Production'),
        ('deprecated', 'Deprecated'),
        ('archived', 'Archived'),
    )
    
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    model_type = models.CharField(max_length=20, choices=MODEL_TYPES)
    version = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='development')
    
    # Model details
    algorithm = models.CharField(max_length=100)
    hyperparameters = JSONField()
    features = JSONField()  # List of features used by the model
    model_path = models.CharField(max_length=255)  # Path to stored model file
    
    # Performance metrics
    accuracy = models.FloatField(null=True, blank=True)
    precision = models.FloatField(null=True, blank=True)
    recall = models.FloatField(null=True, blank=True)
    f1_score = models.FloatField(null=True, blank=True)
    auc_roc = models.FloatField(null=True, blank=True)
    
    # A/B testing
    is_control = models.BooleanField(default=False)
    test_percentage = models.IntegerField(default=0)  # Percentage of traffic to route to this model
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    trained_at = models.DateTimeField(null=True, blank=True)
    deployed_at = models.DateTimeField(null=True, blank=True)
    created_by = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        db_table = 'ml_models'
        indexes = [
            models.Index(fields=['model_type']),
            models.Index(fields=['status']),
            models.Index(fields=['is_control']),
        ]
        unique_together = ('name', 'version')
        
    def __str__(self):
        return f"{self.name} v{self.version}"


class MLPrediction(models.Model):
    """
    Predictions made by ML models
    """
    model = models.ForeignKey(MLModel, on_delete=models.CASCADE, related_name='predictions')
    transaction_id = models.CharField(max_length=100)
    prediction_time = models.DateTimeField(default=timezone.now)
    prediction_value = models.FloatField()  # Risk score or classification result
    prediction_label = models.CharField(max_length=50, null=True, blank=True)  # e.g., 'fraud', 'legitimate'
    confidence = models.FloatField(null=True, blank=True)
    execution_time_ms = models.FloatField(null=True, blank=True)  # Execution time in milliseconds
    
    # Explainability
    feature_importance = JSONField(null=True, blank=True)  # Feature importance values
    explanation = JSONField(null=True, blank=True)  # SHAP or LIME explanation
    
    class Meta:
        db_table = 'ml_predictions'
        indexes = [
            models.Index(fields=['model']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['prediction_time']),
        ]


class MLFeature(models.Model):
    """
    Feature definitions for ML models
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    feature_type = models.CharField(max_length=50)  # e.g., 'numeric', 'categorical', 'text'
    data_source = models.CharField(max_length=100)  # e.g., 'transaction', 'user_profile', 'derived'
    transformation = models.TextField(null=True, blank=True)  # Description of any transformations applied
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'ml_features'
        
    def __str__(self):
        return self.name


class MLTrainingJob(models.Model):
    """
    ML model training job
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    )
    
    model = models.ForeignKey(MLModel, on_delete=models.CASCADE, related_name='training_jobs')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Training parameters
    training_data_start = models.DateTimeField()
    training_data_end = models.DateTimeField()
    validation_data_start = models.DateTimeField()
    validation_data_end = models.DateTimeField()
    hyperparameters = JSONField()
    
    # Job details
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.IntegerField(null=True, blank=True)
    log_file_path = models.CharField(max_length=255, null=True, blank=True)
    
    # Results
    training_accuracy = models.FloatField(null=True, blank=True)
    validation_accuracy = models.FloatField(null=True, blank=True)
    training_loss = models.FloatField(null=True, blank=True)
    validation_loss = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        db_table = 'ml_training_jobs'
        indexes = [
            models.Index(fields=['model']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]


class MLModelPerformance(models.Model):
    """
    Performance metrics for ML models over time
    """
    model = models.ForeignKey(MLModel, on_delete=models.CASCADE, related_name='performance_metrics')
    date = models.DateField()
    prediction_count = models.IntegerField(default=0)
    true_positive_count = models.IntegerField(default=0)
    false_positive_count = models.IntegerField(default=0)
    true_negative_count = models.IntegerField(default=0)
    false_negative_count = models.IntegerField(default=0)
    average_execution_time_ms = models.FloatField(null=True, blank=True)
    
    # Derived metrics
    accuracy = models.FloatField(null=True, blank=True)
    precision = models.FloatField(null=True, blank=True)
    recall = models.FloatField(null=True, blank=True)
    f1_score = models.FloatField(null=True, blank=True)
    
    class Meta:
        db_table = 'ml_model_performance'
        indexes = [
            models.Index(fields=['model']),
            models.Index(fields=['date']),
        ]
        unique_together = ('model', 'date')
