from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class VelocitySignal(models.Model):
    """
    Signals sent to Signal Service
    """
    signal_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    analysis_id = models.CharField(max_length=100)
    
    # Signal details
    entity_type = models.CharField(max_length=20)
    entity_id = models.CharField(max_length=255)
    signal_type = models.CharField(max_length=50)  # e.g., 'threshold_breach', 'pattern_match', 'anomaly'
    
    # Signal content
    velocity_data = JSONField()  # Velocity data that triggered the signal
    risk_score = models.FloatField(null=True, blank=True)
    risk_level = models.CharField(max_length=20, null=True, blank=True)  # e.g., 'low', 'medium', 'high'
    
    # Delivery status
    is_delivered = models.BooleanField(default=False)
    delivery_attempts = models.IntegerField(default=0)
    last_attempt = models.DateTimeField(null=True, blank=True)
    delivery_error = models.TextField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'velocity_signals'
        indexes = [
            models.Index(fields=['signal_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['analysis_id']),
            models.Index(fields=['entity_type', 'entity_id']),
            models.Index(fields=['signal_type']),
            models.Index(fields=['is_delivered']),
            models.Index(fields=['created_at']),
        ]


class SignalTemplate(models.Model):
    """
    Templates for velocity signals
    """
    template_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Template configuration
    signal_type = models.CharField(max_length=50)
    template_content = JSONField()  # Template with placeholders
    
    # Template management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'velocity_signal_templates'
        indexes = [
            models.Index(fields=['template_id']),
            models.Index(fields=['signal_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.signal_type})"


class VelocityMetrics(models.Model):
    """
    Metrics for velocity service
    """
    date = models.DateField(unique=True)
    
    # Transaction metrics
    total_transactions = models.IntegerField(default=0)
    analyzed_transactions = models.IntegerField(default=0)
    
    # Signal metrics
    total_signals = models.IntegerField(default=0)
    threshold_breach_signals = models.IntegerField(default=0)
    pattern_match_signals = models.IntegerField(default=0)
    anomaly_signals = models.IntegerField(default=0)
    
    # Risk level metrics
    low_risk_count = models.IntegerField(default=0)
    medium_risk_count = models.IntegerField(default=0)
    high_risk_count = models.IntegerField(default=0)
    
    # Entity type metrics
    entity_type_counts = JSONField(null=True, blank=True)
    
    # Performance metrics
    average_analysis_time_ms = models.FloatField(null=True, blank=True)
    p95_analysis_time_ms = models.FloatField(null=True, blank=True)
    p99_analysis_time_ms = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'velocity_metrics'
        indexes = [
            models.Index(fields=['date']),
        ]
