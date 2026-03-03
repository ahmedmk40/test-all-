from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class BlockEvaluation(models.Model):
    """
    Record of blocklist evaluations
    """
    RESULT_CHOICES = (
        ('blocked', 'Blocked'),
        ('allowed', 'Allowed'),
        ('error', 'Error'),
    )
    
    evaluation_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    evaluation_time = models.DateTimeField(default=timezone.now)
    result = models.CharField(max_length=10, choices=RESULT_CHOICES)
    
    # Evaluation details
    entities_checked = JSONField()  # List of entities checked
    matched_entity_type = models.CharField(max_length=20, null=True, blank=True)
    matched_entity_id = models.CharField(max_length=255, null=True, blank=True)
    
    # Block list reference
    block_list_entry_id = models.CharField(max_length=100, null=True, blank=True)
    
    # Performance
    execution_time_ms = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'block_evaluations'
        indexes = [
            models.Index(fields=['evaluation_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['result']),
            models.Index(fields=['evaluation_time']),
        ]


class EvaluationRule(models.Model):
    """
    Rules for block evaluation
    """
    rule_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Rule configuration
    is_active = models.BooleanField(default=True)
    entity_types = JSONField()  # List of entity types to check
    conditions = JSONField(null=True, blank=True)  # Additional conditions
    
    # Rule management
    priority = models.IntegerField(default=100)  # Lower number = higher priority
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'evaluation_rules'
        indexes = [
            models.Index(fields=['rule_id']),
            models.Index(fields=['is_active']),
            models.Index(fields=['priority']),
        ]
        
    def __str__(self):
        return self.name


class EvaluationMetrics(models.Model):
    """
    Metrics for block evaluations
    """
    date = models.DateField(unique=True)
    
    # Volume metrics
    total_evaluations = models.IntegerField(default=0)
    blocked_count = models.IntegerField(default=0)
    allowed_count = models.IntegerField(default=0)
    error_count = models.IntegerField(default=0)
    
    # Entity type metrics
    entity_type_counts = JSONField(null=True, blank=True)
    
    # Performance metrics
    average_execution_time_ms = models.FloatField(null=True, blank=True)
    p95_execution_time_ms = models.FloatField(null=True, blank=True)
    p99_execution_time_ms = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'evaluation_metrics'
        indexes = [
            models.Index(fields=['date']),
        ]
