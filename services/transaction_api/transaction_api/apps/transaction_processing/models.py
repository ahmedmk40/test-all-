from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class TransactionProcessor(models.Model):
    """
    Configuration for transaction processing
    """
    processor_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Configuration
    is_active = models.BooleanField(default=True)
    transaction_types = JSONField()  # List of supported transaction types
    channels = JSONField()  # List of supported channels
    
    # Processing steps
    validation_enabled = models.BooleanField(default=True)
    enrichment_enabled = models.BooleanField(default=True)
    signal_submission_enabled = models.BooleanField(default=True)
    
    # Performance metrics
    average_processing_time_ms = models.FloatField(null=True, blank=True)
    success_rate = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'transaction_processors'
        indexes = [
            models.Index(fields=['processor_id']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return self.name


class ProcessedTransaction(models.Model):
    """
    Record of transaction processing
    """
    STATUS_CHOICES = (
        ('received', 'Received'),
        ('validating', 'Validating'),
        ('enriching', 'Enriching'),
        ('submitting', 'Submitting to Signal Service'),
        ('completed', 'Processing Completed'),
        ('failed', 'Processing Failed'),
    )
    
    transaction_id = models.CharField(max_length=100, unique=True)
    processor = models.ForeignKey(TransactionProcessor, on_delete=models.CASCADE, related_name='processed_transactions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='received')
    
    # Transaction details
    transaction_type = models.CharField(max_length=50)
    channel = models.CharField(max_length=50)
    
    # Processing details
    original_data = JSONField()
    processed_data = JSONField(null=True, blank=True)
    
    # Processing steps
    validation_results = JSONField(null=True, blank=True)
    enrichment_results = JSONField(null=True, blank=True)
    signal_submission_result = JSONField(null=True, blank=True)
    
    # Error handling
    error_message = models.TextField(null=True, blank=True)
    error_code = models.CharField(max_length=50, null=True, blank=True)
    retry_count = models.IntegerField(default=0)
    
    # Performance
    processing_time_ms = models.FloatField(null=True, blank=True)
    
    # Timestamps
    received_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'processed_transactions'
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['transaction_type']),
            models.Index(fields=['channel']),
            models.Index(fields=['status']),
            models.Index(fields=['received_at']),
        ]


class ProcessingMetrics(models.Model):
    """
    Metrics for transaction processing
    """
    date = models.DateField(unique=True)
    
    # Volume metrics
    total_transactions = models.IntegerField(default=0)
    successful_transactions = models.IntegerField(default=0)
    failed_transactions = models.IntegerField(default=0)
    
    # Transaction types
    transaction_type_counts = JSONField(null=True, blank=True)
    channel_counts = JSONField(null=True, blank=True)
    
    # Processing steps
    validation_failures = models.IntegerField(default=0)
    enrichment_failures = models.IntegerField(default=0)
    signal_submission_failures = models.IntegerField(default=0)
    
    # Performance metrics
    average_processing_time_ms = models.FloatField(null=True, blank=True)
    p95_processing_time_ms = models.FloatField(null=True, blank=True)
    p99_processing_time_ms = models.FloatField(null=True, blank=True)
    
    class Meta:
        db_table = 'processing_metrics'
        indexes = [
            models.Index(fields=['date']),
        ]


class ProcessingQueue(models.Model):
    """
    Queue for transaction processing
    """
    PRIORITY_CHOICES = (
        (1, 'Highest'),
        (2, 'High'),
        (3, 'Medium'),
        (4, 'Low'),
        (5, 'Lowest'),
    )
    
    STATUS_CHOICES = (
        ('queued', 'Queued'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    queue_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    
    # Queue details
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=3)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='queued')
    
    # Processing details
    processor = models.ForeignKey(TransactionProcessor, null=True, blank=True, on_delete=models.SET_NULL)
    retry_count = models.IntegerField(default=0)
    max_retries = models.IntegerField(default=3)
    
    # Error details
    error_message = models.TextField(null=True, blank=True)
    
    # Timestamps
    queued_at = models.DateTimeField(default=timezone.now)
    processing_started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'processing_queue'
        indexes = [
            models.Index(fields=['queue_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
            models.Index(fields=['queued_at']),
        ]
