from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class TrainingJob(models.Model):
    """
    Machine learning model training job
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('preparing_data', 'Preparing Data'),
        ('training', 'Training'),
        ('evaluating', 'Evaluating'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    job_id = models.CharField(max_length=100, unique=True)
    model_id = models.CharField(max_length=100)
    
    # Job details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    hyperparameters = JSONField(null=True, blank=True)
    features = JSONField()
    
    # Data details
    training_data_source = models.CharField(max_length=255)
    validation_data_source = models.CharField(max_length=255, null=True, blank=True)
    data_filters = JSONField(null=True, blank=True)
    
    # Results
    model_version = models.CharField(max_length=20, null=True, blank=True)
    model_path = models.CharField(max_length=255, null=True, blank=True)
    performance_metrics = JSONField(null=True, blank=True)
    
    # Error details
    error_message = models.TextField(null=True, blank=True)
    
    # Performance
    training_time_seconds = models.FloatField(null=True, blank=True)
    
    # Timestamps
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'training_jobs'
        indexes = [
            models.Index(fields=['job_id']),
            models.Index(fields=['model_id']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]


class TrainingDataset(models.Model):
    """
    Dataset for model training
    """
    DATASET_TYPES = (
        ('training', 'Training'),
        ('validation', 'Validation'),
        ('test', 'Test'),
    )
    
    dataset_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Dataset details
    dataset_type = models.CharField(max_length=20, choices=DATASET_TYPES)
    source = models.CharField(max_length=255)
    format = models.CharField(max_length=50)  # e.g., 'csv', 'parquet', 'database'
    
    # Dataset metadata
    size_rows = models.IntegerField(null=True, blank=True)
    size_bytes = models.BigIntegerField(null=True, blank=True)
    features = JSONField()
    
    # Dataset management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'training_datasets'
        indexes = [
            models.Index(fields=['dataset_id']),
            models.Index(fields=['dataset_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.dataset_type})"


class FeatureEngineering(models.Model):
    """
    Feature engineering configuration
    """
    TRANSFORMATION_TYPES = (
        ('scaling', 'Scaling'),
        ('normalization', 'Normalization'),
        ('encoding', 'Encoding'),
        ('imputation', 'Imputation'),
        ('extraction', 'Feature Extraction'),
        ('selection', 'Feature Selection'),
    )
    
    transformation_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Transformation details
    transformation_type = models.CharField(max_length=20, choices=TRANSFORMATION_TYPES)
    source_features = JSONField()  # Input features
    target_features = JSONField()  # Output features
    
    # Transformation configuration
    configuration = JSONField()
    
    # Transformation management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'feature_engineering'
        indexes = [
            models.Index(fields=['transformation_id']),
            models.Index(fields=['transformation_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return self.name


class HyperparameterTuning(models.Model):
    """
    Hyperparameter tuning job
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    TUNING_METHODS = (
        ('grid_search', 'Grid Search'),
        ('random_search', 'Random Search'),
        ('bayesian', 'Bayesian Optimization'),
    )
    
    tuning_id = models.CharField(max_length=100, unique=True)
    model_id = models.CharField(max_length=100)
    
    # Tuning details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    tuning_method = models.CharField(max_length=20, choices=TUNING_METHODS)
    parameter_space = JSONField()  # Parameters to tune and their ranges
    
    # Tuning configuration
    max_trials = models.IntegerField(default=10)
    metric = models.CharField(max_length=50)  # Metric to optimize
    
    # Results
    best_parameters = JSONField(null=True, blank=True)
    best_score = models.FloatField(null=True, blank=True)
    all_trials = JSONField(null=True, blank=True)  # All trial results
    
    # Error details
    error_message = models.TextField(null=True, blank=True)
    
    # Performance
    tuning_time_seconds = models.FloatField(null=True, blank=True)
    
    # Timestamps
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'hyperparameter_tuning'
        indexes = [
            models.Index(fields=['tuning_id']),
            models.Index(fields=['model_id']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
