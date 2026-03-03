from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class EnrichmentSource(models.Model):
    """
    Data sources for transaction enrichment
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
    description = models.TextField(null=True, blank=True)
    
    # Source configuration
    is_active = models.BooleanField(default=True)
    api_endpoint = models.URLField(null=True, blank=True)
    api_key = models.CharField(max_length=255, null=True, blank=True)  # Encrypted
    
    # Request/response format
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
        db_table = 'enrichment_sources'
        indexes = [
            models.Index(fields=['source_id']),
            models.Index(fields=['source_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.source_type})"


class EnrichmentRequest(models.Model):
    """
    Requests for data enrichment
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    request_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    source = models.ForeignKey(EnrichmentSource, on_delete=models.CASCADE, related_name='requests')
    
    # Request details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    request_data = JSONField()
    response_data = JSONField(null=True, blank=True)
    
    # Error handling
    error_message = models.TextField(null=True, blank=True)
    retry_count = models.IntegerField(default=0)
    
    # Performance
    request_time = models.DateTimeField(null=True, blank=True)
    response_time = models.DateTimeField(null=True, blank=True)
    execution_time_ms = models.FloatField(null=True, blank=True)
    
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


class EnrichmentRule(models.Model):
    """
    Rules for transaction enrichment
    """
    rule_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Rule configuration
    is_active = models.BooleanField(default=True)
    transaction_types = JSONField()  # List of transaction types this rule applies to
    conditions = JSONField()  # Conditions for applying this rule
    
    # Enrichment details
    source = models.ForeignKey(EnrichmentSource, on_delete=models.CASCADE, related_name='rules')
    mapping = JSONField()  # Mapping between transaction fields and source fields
    
    # Rule management
    priority = models.IntegerField(default=100)  # Lower number = higher priority
    is_required = models.BooleanField(default=False)  # If True, transaction fails if enrichment fails
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'enrichment_rules'
        indexes = [
            models.Index(fields=['rule_id']),
            models.Index(fields=['is_active']),
            models.Index(fields=['priority']),
        ]
        
    def __str__(self):
        return self.name


class EnrichmentResult(models.Model):
    """
    Results of transaction enrichment
    """
    STATUS_CHOICES = (
        ('success', 'Success'),
        ('partial', 'Partial Success'),
        ('failed', 'Failed'),
        ('skipped', 'Skipped'),
    )
    
    result_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    rule = models.ForeignKey(EnrichmentRule, on_delete=models.CASCADE, related_name='results')
    
    # Result details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    enriched_data = JSONField(null=True, blank=True)  # Data added to transaction
    
    # Error details
    error_message = models.TextField(null=True, blank=True)
    
    # Performance
    enrichment_time_ms = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'enrichment_results'
        indexes = [
            models.Index(fields=['result_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
