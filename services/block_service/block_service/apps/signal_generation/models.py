from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class BlockSignal(models.Model):
    """
    Signals sent to Signal Service
    """
    SIGNAL_TYPES = (
        ('block', 'Block'),
        ('allow', 'Allow'),
        ('warning', 'Warning'),
    )
    
    signal_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    signal_type = models.CharField(max_length=10, choices=SIGNAL_TYPES)
    timestamp = models.DateTimeField(default=timezone.now)
    
    # Signal details
    reason = models.CharField(max_length=255, null=True, blank=True)
    confidence = models.FloatField(default=1.0)
    entity_type = models.CharField(max_length=20, null=True, blank=True)
    entity_id = models.CharField(max_length=255, null=True, blank=True)
    
    # Evaluation reference
    evaluation_id = models.CharField(max_length=100, null=True, blank=True)
    
    # Delivery status
    is_delivered = models.BooleanField(default=False)
    delivery_attempts = models.IntegerField(default=0)
    last_attempt = models.DateTimeField(null=True, blank=True)
    delivery_error = models.TextField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'block_signals'
        indexes = [
            models.Index(fields=['signal_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['signal_type']),
            models.Index(fields=['timestamp']),
            models.Index(fields=['is_delivered']),
        ]


class SignalTemplate(models.Model):
    """
    Templates for block signals
    """
    template_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Template configuration
    signal_type = models.CharField(max_length=10)
    template_content = JSONField()  # Template with placeholders
    
    # Template management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'signal_templates'
        indexes = [
            models.Index(fields=['template_id']),
            models.Index(fields=['signal_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.signal_type})"


class SignalDeliveryMetrics(models.Model):
    """
    Metrics for signal delivery
    """
    date = models.DateField(unique=True)
    
    # Volume metrics
    total_signals = models.IntegerField(default=0)
    delivered_signals = models.IntegerField(default=0)
    failed_signals = models.IntegerField(default=0)
    
    # Signal type metrics
    block_signals = models.IntegerField(default=0)
    allow_signals = models.IntegerField(default=0)
    warning_signals = models.IntegerField(default=0)
    
    # Delivery metrics
    average_delivery_time_ms = models.FloatField(null=True, blank=True)
    p95_delivery_time_ms = models.FloatField(null=True, blank=True)
    p99_delivery_time_ms = models.FloatField(null=True, blank=True)
    
    # Retry metrics
    signals_with_retries = models.IntegerField(default=0)
    average_retry_count = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'signal_delivery_metrics'
        indexes = [
            models.Index(fields=['date']),
        ]
