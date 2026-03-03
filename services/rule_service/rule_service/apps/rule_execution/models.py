from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class RuleExecution(models.Model):
    """
    Record of rule executions
    """
    RESULT_CHOICES = (
        ('match', 'Match'),
        ('no_match', 'No Match'),
        ('error', 'Error'),
    )
    
    execution_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    rule_id = models.CharField(max_length=100)
    rule_version = models.CharField(max_length=20)
    
    # Execution details
    result = models.CharField(max_length=10, choices=RESULT_CHOICES)
    execution_time = models.DateTimeField(default=timezone.now)
    
    # Match details
    conditions_evaluated = JSONField()  # Conditions evaluated
    conditions_matched = JSONField(null=True, blank=True)  # Conditions that matched
    actions_taken = JSONField(null=True, blank=True)  # Actions taken
    
    # Performance
    execution_time_ms = models.FloatField(null=True, blank=True)
    
    # Error details
    error_message = models.TextField(null=True, blank=True)
    
    class Meta:
        db_table = 'rule_executions'
        indexes = [
            models.Index(fields=['execution_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['rule_id']),
            models.Index(fields=['result']),
            models.Index(fields=['execution_time']),
        ]


class RuleSignal(models.Model):
    """
    Signals sent to Signal Service
    """
    signal_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    execution_id = models.CharField(max_length=100)
    
    # Signal details
    rule_id = models.CharField(max_length=100)
    rule_name = models.CharField(max_length=255)
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
        db_table = 'rule_signals'
        indexes = [
            models.Index(fields=['signal_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['execution_id']),
            models.Index(fields=['rule_id']),
            models.Index(fields=['is_delivered']),
            models.Index(fields=['created_at']),
        ]


class RulePerformanceMetrics(models.Model):
    """
    Performance metrics for rules
    """
    rule_id = models.CharField(max_length=100)
    date = models.DateField()
    
    # Execution metrics
    total_executions = models.IntegerField(default=0)
    match_count = models.IntegerField(default=0)
    no_match_count = models.IntegerField(default=0)
    error_count = models.IntegerField(default=0)
    
    # Performance metrics
    average_execution_time_ms = models.FloatField(null=True, blank=True)
    p95_execution_time_ms = models.FloatField(null=True, blank=True)
    p99_execution_time_ms = models.FloatField(null=True, blank=True)
    
    # Business metrics
    match_rate = models.FloatField(null=True, blank=True)  # Percentage of matches
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rule_performance_metrics'
        indexes = [
            models.Index(fields=['rule_id']),
            models.Index(fields=['date']),
        ]
        unique_together = ('rule_id', 'date')


class RuleExecutionBatch(models.Model):
    """
    Batch of rule executions
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    batch_id = models.CharField(max_length=100, unique=True)
    
    # Batch details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rule_set_id = models.CharField(max_length=100, null=True, blank=True)
    transaction_ids = JSONField()  # List of transaction IDs to process
    
    # Batch results
    total_transactions = models.IntegerField(default=0)
    processed_transactions = models.IntegerField(default=0)
    matched_transactions = models.IntegerField(default=0)
    error_transactions = models.IntegerField(default=0)
    
    # Performance
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    total_execution_time_ms = models.FloatField(null=True, blank=True)
    
    # Error details
    error_message = models.TextField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rule_execution_batches'
        indexes = [
            models.Index(fields=['batch_id']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
