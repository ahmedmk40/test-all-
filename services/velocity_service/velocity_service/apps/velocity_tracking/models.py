from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class VelocityCounter(models.Model):
    """
    Counter for tracking transaction velocity
    """
    ENTITY_TYPES = (
        ('user', 'User'),
        ('card', 'Payment Card'),
        ('ip', 'IP Address'),
        ('device', 'Device'),
        ('merchant', 'Merchant'),
        ('email', 'Email'),
    )
    
    counter_id = models.CharField(max_length=100, unique=True)
    entity_type = models.CharField(max_length=20, choices=ENTITY_TYPES)
    entity_id = models.CharField(max_length=255)  # Hashed value for sensitive data
    
    # Counter details
    transaction_type = models.CharField(max_length=50)
    count_1m = models.IntegerField(default=0)  # Count in last 1 minute
    count_5m = models.IntegerField(default=0)  # Count in last 5 minutes
    count_15m = models.IntegerField(default=0)  # Count in last 15 minutes
    count_1h = models.IntegerField(default=0)  # Count in last 1 hour
    count_6h = models.IntegerField(default=0)  # Count in last 6 hours
    count_24h = models.IntegerField(default=0)  # Count in last 24 hours
    count_7d = models.IntegerField(default=0)  # Count in last 7 days
    
    # Amount details
    amount_1h = models.FloatField(default=0.0)  # Total amount in last 1 hour
    amount_24h = models.FloatField(default=0.0)  # Total amount in last 24 hours
    amount_7d = models.FloatField(default=0.0)  # Total amount in last 7 days
    
    # Timestamps
    last_updated = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'velocity_counters'
        indexes = [
            models.Index(fields=['counter_id']),
            models.Index(fields=['entity_type', 'entity_id']),
            models.Index(fields=['transaction_type']),
            models.Index(fields=['last_updated']),
        ]
        unique_together = ('entity_type', 'entity_id', 'transaction_type')


class VelocityTransaction(models.Model):
    """
    Record of transactions for velocity tracking
    """
    transaction_id = models.CharField(max_length=100, unique=True)
    
    # Transaction details
    transaction_type = models.CharField(max_length=50)
    amount = models.FloatField()
    currency = models.CharField(max_length=3)
    
    # Entity details
    user_id = models.CharField(max_length=255, null=True, blank=True)
    card_id = models.CharField(max_length=255, null=True, blank=True)
    ip_address = models.CharField(max_length=255, null=True, blank=True)
    device_id = models.CharField(max_length=255, null=True, blank=True)
    merchant_id = models.CharField(max_length=255, null=True, blank=True)
    email = models.CharField(max_length=255, null=True, blank=True)
    
    # Timestamps
    transaction_time = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'velocity_transactions'
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['transaction_type']),
            models.Index(fields=['user_id']),
            models.Index(fields=['card_id']),
            models.Index(fields=['ip_address']),
            models.Index(fields=['device_id']),
            models.Index(fields=['merchant_id']),
            models.Index(fields=['email']),
            models.Index(fields=['transaction_time']),
        ]


class VelocityWindow(models.Model):
    """
    Configuration for velocity windows
    """
    window_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Window configuration
    duration_seconds = models.IntegerField()
    entity_types = JSONField()  # List of entity types to track
    transaction_types = JSONField()  # List of transaction types to track
    
    # Window management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'velocity_windows'
        indexes = [
            models.Index(fields=['window_id']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return self.name
