from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class BlockList(models.Model):
    """
    Blocklist for quick rejection of high-risk entities
    """
    ENTITY_TYPES = (
        ('user', 'User'),
        ('card', 'Payment Card'),
        ('ip', 'IP Address'),
        ('device', 'Device'),
        ('merchant', 'Merchant'),
        ('email', 'Email'),
    )
    
    entity_type = models.CharField(max_length=20, choices=ENTITY_TYPES)
    entity_id = models.CharField(max_length=255)  # Hashed value for sensitive data
    reason = models.TextField(null=True, blank=True)
    source = models.CharField(max_length=100)  # Who added this entry
    
    # Status
    is_active = models.BooleanField(default=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'block_lists'
        indexes = [
            models.Index(fields=['entity_type', 'entity_id']),
            models.Index(fields=['is_active']),
        ]
        unique_together = ('entity_type', 'entity_id')
        
    def __str__(self):
        return f"{self.entity_type}: {self.entity_id}"


class BlockEvaluation(models.Model):
    """
    Record of blocklist evaluations
    """
    RESULT_CHOICES = (
        ('blocked', 'Blocked'),
        ('allowed', 'Allowed'),
        ('error', 'Error'),
    )
    
    transaction_id = models.CharField(max_length=100)
    evaluation_time = models.DateTimeField(default=timezone.now)
    result = models.CharField(max_length=10, choices=RESULT_CHOICES)
    
    # Evaluation details
    entities_checked = JSONField()  # List of entities checked
    matched_entity_type = models.CharField(max_length=20, null=True, blank=True)
    matched_entity_id = models.CharField(max_length=255, null=True, blank=True)
    block_list_entry = models.ForeignKey(BlockList, null=True, blank=True, on_delete=models.SET_NULL)
    
    # Performance
    execution_time_ms = models.FloatField(null=True, blank=True)
    
    class Meta:
        db_table = 'block_evaluations'
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['evaluation_time']),
            models.Index(fields=['result']),
        ]


class BlockSignal(models.Model):
    """
    Signals sent to Signal Service
    """
    signal_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    timestamp = models.DateTimeField(default=timezone.now)
    
    # Signal details
    is_blocked = models.BooleanField()
    reason = models.CharField(max_length=255, null=True, blank=True)
    confidence = models.FloatField(default=1.0)
    entity_type = models.CharField(max_length=20, null=True, blank=True)
    entity_id = models.CharField(max_length=255, null=True, blank=True)
    
    # Delivery status
    is_delivered = models.BooleanField(default=False)
    delivery_attempts = models.IntegerField(default=0)
    last_attempt = models.DateTimeField(null=True, blank=True)
    delivery_error = models.TextField(null=True, blank=True)
    
    class Meta:
        db_table = 'block_signals'
        indexes = [
            models.Index(fields=['signal_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['timestamp']),
            models.Index(fields=['is_delivered']),
        ]


class BlockMetrics(models.Model):
    """
    Performance metrics for Block Service
    """
    date = models.DateField(unique=True)
    
    # Volume metrics
    total_evaluations = models.IntegerField(default=0)
    blocked_count = models.IntegerField(default=0)
    allowed_count = models.IntegerField(default=0)
    error_count = models.IntegerField(default=0)
    
    # Performance metrics
    average_execution_time_ms = models.FloatField(null=True, blank=True)
    p95_execution_time_ms = models.FloatField(null=True, blank=True)
    p99_execution_time_ms = models.FloatField(null=True, blank=True)
    
    # Block list metrics
    active_block_list_entries = models.IntegerField(default=0)
    new_block_list_entries = models.IntegerField(default=0)
    expired_block_list_entries = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'block_metrics'
        indexes = [
            models.Index(fields=['date']),
        ]
