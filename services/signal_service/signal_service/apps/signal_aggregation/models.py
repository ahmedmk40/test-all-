from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField
from signal_service.models import Signal, TransactionState


class SignalAggregator(models.Model):
    """
    Configuration for signal aggregation
    """
    aggregator_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Configuration
    is_active = models.BooleanField(default=True)
    signal_types = JSONField()  # List of signal types to aggregate
    
    # Aggregation rules
    weighting_rules = JSONField()  # Rules for weighting different signals
    threshold_rules = JSONField()  # Thresholds for different decisions
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'signal_aggregators'
        indexes = [
            models.Index(fields=['aggregator_id']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return self.name


class AggregationRule(models.Model):
    """
    Rules for aggregating signals
    """
    RULE_TYPES = (
        ('weighting', 'Signal Weighting'),
        ('threshold', 'Decision Threshold'),
        ('combination', 'Signal Combination'),
    )
    
    rule_id = models.CharField(max_length=100, unique=True)
    aggregator = models.ForeignKey(SignalAggregator, on_delete=models.CASCADE, related_name='rules')
    rule_type = models.CharField(max_length=20, choices=RULE_TYPES)
    name = models.CharField(max_length=255)
    
    # Rule configuration
    conditions = JSONField()  # Conditions for applying this rule
    actions = JSONField()  # Actions to take when rule matches
    
    # Rule management
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=100)  # Lower number = higher priority
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'aggregation_rules'
        indexes = [
            models.Index(fields=['rule_id']),
            models.Index(fields=['rule_type']),
            models.Index(fields=['is_active']),
            models.Index(fields=['priority']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.rule_type})"


class AggregationResult(models.Model):
    """
    Results of signal aggregation for a transaction
    """
    transaction_id = models.CharField(max_length=100, unique=True)
    aggregator = models.ForeignKey(SignalAggregator, on_delete=models.CASCADE, related_name='results')
    
    # Aggregated scores
    block_score = models.FloatField(null=True, blank=True)
    rule_score = models.FloatField(null=True, blank=True)
    velocity_score = models.FloatField(null=True, blank=True)
    ml_score = models.FloatField(null=True, blank=True)
    aml_score = models.FloatField(null=True, blank=True)
    
    # Overall scores
    weighted_score = models.FloatField(null=True, blank=True)
    confidence = models.FloatField(null=True, blank=True)
    
    # Decision
    recommended_decision = models.CharField(max_length=50, null=True, blank=True)
    decision_factors = JSONField(null=True, blank=True)  # Factors that influenced the decision
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'aggregation_results'
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['recommended_decision']),
            models.Index(fields=['created_at']),
        ]


class SignalHistory(models.Model):
    """
    Historical record of signals for analysis
    """
    transaction_id = models.CharField(max_length=100)
    signal = models.ForeignKey(Signal, on_delete=models.CASCADE, related_name='history')
    
    # Signal details
    signal_type = models.CharField(max_length=20)
    source = models.CharField(max_length=20)
    timestamp = models.DateTimeField()
    
    # Signal content
    payload = JSONField()
    
    # Aggregation details
    was_aggregated = models.BooleanField(default=False)
    weight_applied = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'signal_history'
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['signal_type']),
            models.Index(fields=['source']),
            models.Index(fields=['timestamp']),
        ]
