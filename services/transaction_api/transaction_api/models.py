from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class TransactionProcessor(models.Model):
    """
    Transaction processing configuration and status
    """
    processor_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Configuration
    is_active = models.BooleanField(default=True)
    transaction_types = JSONField()  # List of supported transaction types
    channels = JSONField()  # List of supported channels
    
    # Processing details
    validation_rules = JSONField(null=True, blank=True)
    normalization_rules = JSONField(null=True, blank=True)
    enrichment_rules = JSONField(null=True, blank=True)
    
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
        ('normalizing', 'Normalizing'),
        ('enriching', 'Enriching'),
        ('submitting', 'Submitting to Signal Service'),
        ('completed', 'Processing Completed'),
        ('failed', 'Processing Failed'),
    )
    
    transaction_id = models.CharField(max_length=100, unique=True)
    processor = models.ForeignKey(TransactionProcessor, on_delete=models.CASCADE, related_name='processed_transactions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='received')
    
    # Processing details
    validation_results = JSONField(null=True, blank=True)
    normalization_results = JSONField(null=True, blank=True)
    enrichment_results = JSONField(null=True, blank=True)
    
    # Original and processed data
    original_data = JSONField()
    processed_data = JSONField(null=True, blank=True)
    
    # Error handling
    error_message = models.TextField(null=True, blank=True)
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
            models.Index(fields=['status']),
            models.Index(fields=['received_at']),
        ]


class DataEnrichmentSource(models.Model):
    """
    External data sources for transaction enrichment
    """
    SOURCE_TYPES = (
        ('ip_geolocation', 'IP Geolocation'),
        ('device_intelligence', 'Device Intelligence'),
        ('merchant_data', 'Merchant Data'),
        ('user_profile', 'User Profile'),
        ('card_metadata', 'Card Metadata'),
    )
    
    source_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPES)
    
    # Configuration
    is_active = models.BooleanField(default=True)
    api_endpoint = models.URLField(null=True, blank=True)
    api_key = models.CharField(max_length=255, null=True, blank=True)  # Encrypted
    request_format = JSONField(null=True, blank=True)
    response_format = JSONField(null=True, blank=True)
    
    # Performance metrics
    average_response_time_ms = models.FloatField(null=True, blank=True)
    success_rate = models.FloatField(null=True, blank=True)
    
    # Rate limiting
    rate_limit = models.IntegerField(default=0)  # 0 = no limit
    current_usage = models.IntegerField(default=0)
    reset_time = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'data_enrichment_sources'
        indexes = [
            models.Index(fields=['source_id']),
            models.Index(fields=['source_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.source_type})"


class EnrichmentRequest(models.Model):
    """
    Record of data enrichment requests
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    request_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    source = models.ForeignKey(DataEnrichmentSource, on_delete=models.CASCADE, related_name='requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Request details
    request_data = JSONField()
    response_data = JSONField(null=True, blank=True)
    
    # Error handling
    error_message = models.TextField(null=True, blank=True)
    retry_count = models.IntegerField(default=0)
    
    # Performance
    response_time_ms = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'enrichment_requests'
        indexes = [
            models.Index(fields=['request_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
