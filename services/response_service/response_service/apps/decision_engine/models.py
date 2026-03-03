from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class DecisionRule(models.Model):
    """
    Rules for transaction decisions
    """
    DECISION_TYPES = (
        ('approve', 'Approve'),
        ('decline', 'Decline'),
        ('review', 'Manual Review'),
        ('challenge', 'Challenge'),
        ('monitor', 'Monitor'),
    )
    
    rule_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Rule details
    decision_type = models.CharField(max_length=20, choices=DECISION_TYPES)
    conditions = JSONField()  # Conditions for rule to match
    priority = models.IntegerField(default=100)  # Lower number = higher priority
    
    # Rule management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'decision_rules'
        indexes = [
            models.Index(fields=['rule_id']),
            models.Index(fields=['decision_type']),
            models.Index(fields=['priority']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.decision_type})"


class TransactionDecision(models.Model):
    """
    Decisions for transactions
    """
    DECISION_TYPES = (
        ('approve', 'Approve'),
        ('decline', 'Decline'),
        ('review', 'Manual Review'),
        ('challenge', 'Challenge'),
        ('monitor', 'Monitor'),
    )
    
    decision_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    
    # Decision details
    decision_type = models.CharField(max_length=20, choices=DECISION_TYPES)
    reason = models.CharField(max_length=255, null=True, blank=True)
    rule_id = models.CharField(max_length=100, null=True, blank=True)
    
    # Signal information
    signals = JSONField(null=True, blank=True)  # Signals that influenced the decision
    
    # Performance
    decision_time_ms = models.FloatField(null=True, blank=True)
    
    # Timestamps
    decision_time = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'transaction_decisions'
        indexes = [
            models.Index(fields=['decision_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['decision_type']),
            models.Index(fields=['decision_time']),
        ]


class ManualReview(models.Model):
    """
    Manual review of transactions
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('expired', 'Expired'),
    )
    
    DECISION_TYPES = (
        ('approve', 'Approve'),
        ('decline', 'Decline'),
        ('challenge', 'Challenge'),
        ('monitor', 'Monitor'),
    )
    
    review_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    decision_id = models.CharField(max_length=100)
    
    # Review details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.CharField(max_length=100, null=True, blank=True)
    
    # Review results
    reviewer_decision = models.CharField(max_length=20, choices=DECISION_TYPES, null=True, blank=True)
    reviewer_notes = models.TextField(null=True, blank=True)
    
    # Timestamps
    assigned_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'manual_reviews'
        indexes = [
            models.Index(fields=['review_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['decision_id']),
            models.Index(fields=['status']),
            models.Index(fields=['assigned_to']),
            models.Index(fields=['created_at']),
        ]


class DecisionMetrics(models.Model):
    """
    Metrics for transaction decisions
    """
    date = models.DateField(unique=True)
    
    # Volume metrics
    total_decisions = models.IntegerField(default=0)
    approve_count = models.IntegerField(default=0)
    decline_count = models.IntegerField(default=0)
    review_count = models.IntegerField(default=0)
    challenge_count = models.IntegerField(default=0)
    monitor_count = models.IntegerField(default=0)
    
    # Performance metrics
    average_decision_time_ms = models.FloatField(null=True, blank=True)
    p95_decision_time_ms = models.FloatField(null=True, blank=True)
    p99_decision_time_ms = models.FloatField(null=True, blank=True)
    
    # Manual review metrics
    manual_review_completion_rate = models.FloatField(null=True, blank=True)
    average_review_time_minutes = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'decision_metrics'
        indexes = [
            models.Index(fields=['date']),
        ]
