from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class Signal(models.Model):
    """
    Base model for signals in the system
    """
    SIGNAL_TYPES = (
        ('block', 'Block Signal'),
        ('rule', 'Rule Signal'),
        ('velocity', 'Velocity Signal'),
        ('ml', 'ML Signal'),
        ('aml', 'AML Signal'),
    )
    
    SOURCES = (
        ('block_service', 'Block Service'),
        ('rule_service', 'Rule Service'),
        ('velocity_service', 'Velocity Service'),
        ('ml_service', 'ML Service'),
        ('aml_service', 'AML Service'),
    )
    
    signal_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    signal_type = models.CharField(max_length=20, choices=SIGNAL_TYPES)
    source = models.CharField(max_length=20, choices=SOURCES)
    timestamp = models.DateTimeField(default=timezone.now)
    priority = models.IntegerField(default=5)  # Lower number = higher priority
    payload = JSONField()  # Signal-specific data
    metadata = JSONField(null=True, blank=True)  # Additional metadata
    
    # Processing status
    is_processed = models.BooleanField(default=False)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'signals'
        indexes = [
            models.Index(fields=['signal_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['signal_type']),
            models.Index(fields=['source']),
            models.Index(fields=['timestamp']),
            models.Index(fields=['is_processed']),
        ]
        
    def __str__(self):
        return f"{self.signal_id} - {self.signal_type} from {self.source}"


class TransactionState(models.Model):
    """
    Tracks the state of a transaction throughout the evaluation process
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('timeout', 'Timeout'),
        ('error', 'Error'),
    )
    
    transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Service status tracking
    block_service_status = models.CharField(max_length=20, default='pending')
    rule_service_status = models.CharField(max_length=20, default='pending')
    velocity_service_status = models.CharField(max_length=20, default='pending')
    ml_service_status = models.CharField(max_length=20, default='pending')
    aml_service_status = models.CharField(max_length=20, default='pending')
    response_service_status = models.CharField(max_length=20, default='pending')
    
    # Timing information
    started_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    timeout_at = models.DateTimeField(null=True, blank=True)
    
    # Result tracking
    final_decision = models.CharField(max_length=50, null=True, blank=True)
    risk_score = models.FloatField(null=True, blank=True)
    
    # Error handling
    error_message = models.TextField(null=True, blank=True)
    retry_count = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'transaction_states'
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['status']),
            models.Index(fields=['started_at']),
        ]


class ServiceRegistry(models.Model):
    """
    Registry of available services for service discovery
    """
    SERVICE_TYPES = (
        ('block', 'Block Service'),
        ('rule', 'Rule Service'),
        ('velocity', 'Velocity Service'),
        ('ml', 'ML Service'),
        ('aml', 'AML Service'),
        ('response', 'Response Service'),
    )
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('degraded', 'Degraded'),
    )
    
    service_id = models.CharField(max_length=100, unique=True)
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPES)
    host = models.CharField(max_length=255)
    port = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Health metrics
    last_heartbeat = models.DateTimeField(default=timezone.now)
    response_time_ms = models.FloatField(null=True, blank=True)
    error_count = models.IntegerField(default=0)
    
    # Circuit breaker
    circuit_open = models.BooleanField(default=False)
    circuit_open_until = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    version = models.CharField(max_length=20, null=True, blank=True)
    metadata = JSONField(null=True, blank=True)
    
    # Timestamps
    registered_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'service_registry'
        indexes = [
            models.Index(fields=['service_id']),
            models.Index(fields=['service_type']),
            models.Index(fields=['status']),
            models.Index(fields=['last_heartbeat']),
        ]
        
    def __str__(self):
        return f"{self.service_type} at {self.host}:{self.port}"


class SignalAggregation(models.Model):
    """
    Aggregated signals for a transaction
    """
    transaction_id = models.CharField(max_length=100, unique=True)
    
    # Aggregated risk scores
    block_score = models.FloatField(null=True, blank=True)
    rule_score = models.FloatField(null=True, blank=True)
    velocity_score = models.FloatField(null=True, blank=True)
    ml_score = models.FloatField(null=True, blank=True)
    aml_score = models.FloatField(null=True, blank=True)
    
    # Overall scores
    weighted_score = models.FloatField(null=True, blank=True)
    final_decision = models.CharField(max_length=50, null=True, blank=True)
    
    # Signal counts
    total_signals = models.IntegerField(default=0)
    block_signals = models.IntegerField(default=0)
    rule_signals = models.IntegerField(default=0)
    velocity_signals = models.IntegerField(default=0)
    ml_signals = models.IntegerField(default=0)
    aml_signals = models.IntegerField(default=0)
    
    # Decision factors
    decision_factors = JSONField(null=True, blank=True)  # Key factors in the decision
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'signal_aggregations'
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['final_decision']),
            models.Index(fields=['created_at']),
        ]


class CircuitBreaker(models.Model):
    """
    Circuit breaker configuration and state
    """
    service_type = models.CharField(max_length=50, unique=True)
    
    # Configuration
    failure_threshold = models.IntegerField(default=5)
    reset_timeout_seconds = models.IntegerField(default=60)
    half_open_requests = models.IntegerField(default=1)
    
    # State
    state = models.CharField(max_length=20, default='closed')  # closed, open, half-open
    failure_count = models.IntegerField(default=0)
    last_failure = models.DateTimeField(null=True, blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    
    # Metrics
    total_failures = models.IntegerField(default=0)
    total_successes = models.IntegerField(default=0)
    total_timeouts = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'circuit_breakers'
        
    def __str__(self):
        return f"{self.service_type} - {self.state}"
