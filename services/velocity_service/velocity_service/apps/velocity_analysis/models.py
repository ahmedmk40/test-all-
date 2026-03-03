from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class VelocityAnalysis(models.Model):
    """
    Analysis of transaction velocity
    """
    ANALYSIS_TYPES = (
        ('threshold', 'Threshold Analysis'),
        ('pattern', 'Pattern Analysis'),
        ('anomaly', 'Anomaly Detection'),
        ('trend', 'Trend Analysis'),
    )
    
    analysis_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    analysis_type = models.CharField(max_length=20, choices=ANALYSIS_TYPES)
    
    # Analysis details
    entity_type = models.CharField(max_length=20)
    entity_id = models.CharField(max_length=255)
    transaction_type = models.CharField(max_length=50)
    
    # Analysis results
    velocity_scores = JSONField()  # Scores for different time windows
    threshold_breaches = JSONField(null=True, blank=True)  # Thresholds that were breached
    anomaly_score = models.FloatField(null=True, blank=True)  # Overall anomaly score
    
    # Risk assessment
    risk_level = models.CharField(max_length=20, null=True, blank=True)  # e.g., 'low', 'medium', 'high'
    risk_factors = JSONField(null=True, blank=True)  # Factors contributing to risk
    
    # Timestamps
    analysis_time = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'velocity_analyses'
        indexes = [
            models.Index(fields=['analysis_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['analysis_type']),
            models.Index(fields=['entity_type', 'entity_id']),
            models.Index(fields=['analysis_time']),
        ]


class VelocityThreshold(models.Model):
    """
    Thresholds for velocity analysis
    """
    threshold_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Threshold configuration
    entity_type = models.CharField(max_length=20)
    transaction_type = models.CharField(max_length=50)
    window_seconds = models.IntegerField()  # Time window in seconds
    
    # Threshold values
    count_threshold = models.IntegerField(null=True, blank=True)  # Max count in window
    amount_threshold = models.FloatField(null=True, blank=True)  # Max amount in window
    
    # Risk levels
    medium_risk_percentage = models.FloatField(default=70.0)  # % of threshold for medium risk
    high_risk_percentage = models.FloatField(default=90.0)  # % of threshold for high risk
    
    # Threshold management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'velocity_thresholds'
        indexes = [
            models.Index(fields=['threshold_id']),
            models.Index(fields=['entity_type']),
            models.Index(fields=['transaction_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return self.name


class VelocityPattern(models.Model):
    """
    Patterns for velocity analysis
    """
    pattern_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Pattern configuration
    entity_type = models.CharField(max_length=20)
    transaction_type = models.CharField(max_length=50)
    
    # Pattern definition
    pattern_type = models.CharField(max_length=50)  # e.g., 'spike', 'drop', 'oscillation'
    pattern_definition = JSONField()  # Definition of the pattern
    
    # Risk assessment
    risk_level = models.CharField(max_length=20)  # e.g., 'low', 'medium', 'high'
    
    # Pattern management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'velocity_patterns'
        indexes = [
            models.Index(fields=['pattern_id']),
            models.Index(fields=['entity_type']),
            models.Index(fields=['transaction_type']),
            models.Index(fields=['pattern_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return self.name
