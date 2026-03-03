from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class Action(models.Model):
    """
    Actions to take in response to transaction decisions
    """
    ACTION_TYPES = (
        ('block_card', 'Block Card'),
        ('limit_account', 'Limit Account'),
        ('request_verification', 'Request Verification'),
        ('escalate', 'Escalate to Analyst'),
        ('notify', 'Send Notification'),
        ('add_to_watchlist', 'Add to Watchlist'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    )
    
    action_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    decision_id = models.CharField(max_length=100, null=True, blank=True)
    
    # Action details
    action_type = models.CharField(max_length=30, choices=ACTION_TYPES)
    parameters = JSONField(null=True, blank=True)  # Parameters for the action
    
    # Action status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    result = JSONField(null=True, blank=True)  # Result of the action
    
    # Error details
    error_message = models.TextField(null=True, blank=True)
    retry_count = models.IntegerField(default=0)
    
    # Timestamps
    scheduled_at = models.DateTimeField(default=timezone.now)
    executed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'actions'
        indexes = [
            models.Index(fields=['action_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['decision_id']),
            models.Index(fields=['action_type']),
            models.Index(fields=['status']),
            models.Index(fields=['scheduled_at']),
        ]


class ActionTemplate(models.Model):
    """
    Templates for actions
    """
    template_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Template details
    action_type = models.CharField(max_length=30)
    default_parameters = JSONField(null=True, blank=True)
    
    # Template management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'action_templates'
        indexes = [
            models.Index(fields=['template_id']),
            models.Index(fields=['action_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.action_type})"


class ActionRule(models.Model):
    """
    Rules for automatic actions
    """
    rule_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Rule details
    decision_type = models.CharField(max_length=20)
    conditions = JSONField()  # Conditions for rule to match
    action_template_id = models.CharField(max_length=100)
    parameter_mapping = JSONField(null=True, blank=True)  # Mapping from decision to action parameters
    
    # Rule management
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=100)  # Lower number = higher priority
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'action_rules'
        indexes = [
            models.Index(fields=['rule_id']),
            models.Index(fields=['decision_type']),
            models.Index(fields=['is_active']),
            models.Index(fields=['priority']),
        ]
        
    def __str__(self):
        return self.name


class ActionMetrics(models.Model):
    """
    Metrics for actions
    """
    date = models.DateField(unique=True)
    
    # Volume metrics
    total_actions = models.IntegerField(default=0)
    block_card_count = models.IntegerField(default=0)
    limit_account_count = models.IntegerField(default=0)
    request_verification_count = models.IntegerField(default=0)
    escalate_count = models.IntegerField(default=0)
    notify_count = models.IntegerField(default=0)
    add_to_watchlist_count = models.IntegerField(default=0)
    
    # Status metrics
    completed_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
    
    # Performance metrics
    average_execution_time_ms = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'action_metrics'
        indexes = [
            models.Index(fields=['date']),
        ]
