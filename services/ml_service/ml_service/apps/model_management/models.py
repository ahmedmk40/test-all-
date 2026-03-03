from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class MLModel(models.Model):
    """
    Machine learning model metadata
    """
    MODEL_TYPES = (
        ('classification', 'Classification'),
        ('regression', 'Regression'),
        ('clustering', 'Clustering'),
        ('anomaly_detection', 'Anomaly Detection'),
    )
    
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('training', 'Training'),
        ('trained', 'Trained'),
        ('evaluating', 'Evaluating'),
        ('deployed', 'Deployed'),
        ('archived', 'Archived'),
    )
    
    model_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    model_type = models.CharField(max_length=20, choices=MODEL_TYPES)
    
    # Model details
    algorithm = models.CharField(max_length=100)
    version = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Model storage
    model_path = models.CharField(max_length=255, null=True, blank=True)
    model_format = models.CharField(max_length=50, null=True, blank=True)  # e.g., 'pickle', 'h5', 'onnx'
    
    # Model configuration
    hyperparameters = JSONField(null=True, blank=True)
    features = JSONField()  # List of features used by the model
    target = models.CharField(max_length=100, null=True, blank=True)
    
    # Performance metrics
    performance_metrics = JSONField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deployed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'ml_models'
        indexes = [
            models.Index(fields=['model_id']),
            models.Index(fields=['model_type']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
        
    def __str__(self):
        return f"{self.name} v{self.version}"


class ModelVersion(models.Model):
    """
    Version history for ML models
    """
    version_id = models.CharField(max_length=100, unique=True)
    model_id = models.CharField(max_length=100)
    version = models.CharField(max_length=20)
    
    # Version details
    model_path = models.CharField(max_length=255, null=True, blank=True)
    hyperparameters = JSONField(null=True, blank=True)
    features = JSONField()
    
    # Performance metrics
    performance_metrics = JSONField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    created_by = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        db_table = 'model_versions'
        indexes = [
            models.Index(fields=['version_id']),
            models.Index(fields=['model_id', 'version']),
            models.Index(fields=['created_at']),
        ]
        unique_together = ('model_id', 'version')


class FeatureDefinition(models.Model):
    """
    Definition of features used in ML models
    """
    FEATURE_TYPES = (
        ('numeric', 'Numeric'),
        ('categorical', 'Categorical'),
        ('text', 'Text'),
        ('datetime', 'DateTime'),
        ('boolean', 'Boolean'),
        ('derived', 'Derived'),
    )
    
    feature_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    feature_type = models.CharField(max_length=20, choices=FEATURE_TYPES)
    
    # Feature details
    source_field = models.CharField(max_length=255, null=True, blank=True)
    transformation = models.TextField(null=True, blank=True)  # Description or code for transformation
    
    # Feature metadata
    is_active = models.BooleanField(default=True)
    importance_score = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'feature_definitions'
        indexes = [
            models.Index(fields=['feature_id']),
            models.Index(fields=['feature_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return self.name
