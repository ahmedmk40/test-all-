from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class TransactionValidator(models.Model):
    """
    Configuration for transaction validation
    """
    VALIDATOR_TYPES = (
        ('schema', 'Schema Validation'),
        ('business_rule', 'Business Rule Validation'),
        ('format', 'Format Validation'),
        ('required_field', 'Required Field Validation'),
    )
    
    validator_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    validator_type = models.CharField(max_length=20, choices=VALIDATOR_TYPES)
    description = models.TextField(null=True, blank=True)
    
    # Validation configuration
    is_active = models.BooleanField(default=True)
    transaction_types = JSONField()  # List of transaction types this validator applies to
    validation_rules = JSONField()  # Rules for validation
    
    # Error handling
    error_message = models.TextField(null=True, blank=True)
    is_blocking = models.BooleanField(default=True)  # If True, blocks transaction on failure
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'transaction_validators'
        indexes = [
            models.Index(fields=['validator_id']),
            models.Index(fields=['validator_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.validator_type})"


class ValidationResult(models.Model):
    """
    Results of transaction validation
    """
    STATUS_CHOICES = (
        ('passed', 'Passed'),
        ('failed', 'Failed'),
        ('warning', 'Warning'),
        ('error', 'Error'),
    )
    
    result_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    validator = models.ForeignKey(TransactionValidator, on_delete=models.CASCADE, related_name='results')
    
    # Validation details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    details = JSONField(null=True, blank=True)  # Detailed validation results
    
    # Error details
    error_message = models.TextField(null=True, blank=True)
    error_code = models.CharField(max_length=50, null=True, blank=True)
    
    # Performance
    validation_time_ms = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'validation_results'
        indexes = [
            models.Index(fields=['result_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]


class ValidationSchema(models.Model):
    """
    JSON schemas for transaction validation
    """
    schema_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Schema details
    transaction_type = models.CharField(max_length=50)
    schema = JSONField()
    
    # Schema management
    is_active = models.BooleanField(default=True)
    version = models.CharField(max_length=20)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'validation_schemas'
        indexes = [
            models.Index(fields=['schema_id']),
            models.Index(fields=['transaction_type']),
            models.Index(fields=['is_active']),
        ]
        unique_together = ('transaction_type', 'version')
        
    def __str__(self):
        return f"{self.name} v{self.version}"
