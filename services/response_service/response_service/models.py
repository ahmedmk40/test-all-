from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class ResponseTemplate(models.Model):
    """
    Templates for transaction responses
    """
    RESPONSE_TYPES = (
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('review', 'Manual Review'),
        ('error', 'Error'),
    )
    
    template_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    response_type = models.CharField(max_length=20, choices=RESPONSE_TYPES)
    
    # Template content
    template_content = JSONField()  # Template with placeholders
    
    # Usage configuration
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=100)  # Lower number = higher priority
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'response_templates'
        indexes = [
            models.Index(fields=['template_id']),
            models.Index(fields=['response_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.response_type})"


class DecisionRule(models.Model):
    """
    Rules for making final decisions based on aggregated signals
    """
    rule_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Rule configuration
    conditions = JSONField()  # Conditions for applying this rule
    decision = models.CharField(max_length=50)  # Final decision if rule matches
    template = models.ForeignKey(ResponseTemplate, null=True, blank=True, on_delete=models.SET_NULL)
    
    # Rule management
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=100)  # Lower number = higher priority
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'decision_rules'
        indexes = [
            models.Index(fields=['rule_id']),
            models.Index(fields=['is_active']),
            models.Index(fields=['priority']),
        ]
        
    def __str__(self):
        return self.name


class TransactionDecision(models.Model):
    """
    Final decisions for transactions
    """
    DECISION_TYPES = (
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('review', 'Manual Review'),
        ('error', 'Error'),
    )
    
    transaction_id = models.CharField(max_length=100, unique=True)
    decision = models.CharField(max_length=20, choices=DECISION_TYPES)
    
    # Decision details
    confidence = models.FloatField(default=1.0)
    decision_rule = models.ForeignKey(DecisionRule, null=True, blank=True, on_delete=models.SET_NULL)
    decision_factors = JSONField(null=True, blank=True)  # Factors that influenced the decision
    
    # Response details
    response_template = models.ForeignKey(ResponseTemplate, null=True, blank=True, on_delete=models.SET_NULL)
    response_data = JSONField(null=True, blank=True)  # Final response sent to client
    
    # Signal data
    aggregated_signals = JSONField(null=True, blank=True)  # Aggregated signals from Signal Service
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'transaction_decisions'
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['decision']),
            models.Index(fields=['created_at']),
        ]


class DecisionMetrics(models.Model):
    """
    Metrics for decision performance
    """
    date = models.DateField(unique=True)
    
    # Volume metrics
    total_decisions = models.IntegerField(default=0)
    approved_count = models.IntegerField(default=0)
    rejected_count = models.IntegerField(default=0)
    review_count = models.IntegerField(default=0)
    error_count = models.IntegerField(default=0)
    
    # Performance metrics
    average_decision_time_ms = models.FloatField(null=True, blank=True)
    p95_decision_time_ms = models.FloatField(null=True, blank=True)
    p99_decision_time_ms = models.FloatField(null=True, blank=True)
    
    # Business metrics
    approval_rate = models.FloatField(null=True, blank=True)  # Percentage of approved transactions
    rejection_rate = models.FloatField(null=True, blank=True)  # Percentage of rejected transactions
    review_rate = models.FloatField(null=True, blank=True)  # Percentage of transactions sent for review
    
    class Meta:
        db_table = 'decision_metrics'
        indexes = [
            models.Index(fields=['date']),
        ]


class ManualReview(models.Model):
    """
    Transactions flagged for manual review
    """
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('in_progress', 'In Progress'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Review details
    assigned_to = models.CharField(max_length=100, null=True, blank=True)
    assigned_at = models.DateTimeField(null=True, blank=True)
    priority = models.IntegerField(default=3)  # 1 = highest, 5 = lowest
    
    # Decision details
    decision = models.CharField(max_length=20, null=True, blank=True)
    decision_reason = models.TextField(null=True, blank=True)
    reviewer_notes = models.TextField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'manual_reviews'
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['status']),
            models.Index(fields=['assigned_to']),
            models.Index(fields=['created_at']),
        ]
