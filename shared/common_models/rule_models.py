from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class Rule(models.Model):
    """
    Rule definition for fraud detection
    """
    RULE_TYPES = (
        ('velocity', 'Velocity Rules'),
        ('amount', 'Amount Rules'),
        ('geographical', 'Geographical Rules'),
        ('card_testing', 'Card Testing Rules'),
        ('device', 'Device Intelligence Rules'),
        ('mcc', 'MCC Rules'),
        ('behavioral', 'Behavioral Pattern Rules'),
        ('combination', 'Combination Rules'),
        ('merchant', 'Custom Merchant Rules'),
    )
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('testing', 'Testing'),
        ('archived', 'Archived'),
    )
    
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    rule_type = models.CharField(max_length=20, choices=RULE_TYPES)
    conditions = JSONField()  # JSON structure defining rule conditions
    actions = JSONField()  # JSON structure defining actions to take when rule matches
    priority = models.IntegerField(default=100)  # Lower number = higher priority
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='inactive')
    
    # Version control
    version = models.IntegerField(default=1)
    is_latest = models.BooleanField(default=True)
    parent_rule = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='versions')
    
    # Performance metrics
    match_count = models.IntegerField(default=0)
    false_positive_count = models.IntegerField(default=0)
    true_positive_count = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.CharField(max_length=100, null=True, blank=True)
    updated_by = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        db_table = 'rules'
        indexes = [
            models.Index(fields=['rule_type']),
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
        ]
        
    def __str__(self):
        return f"{self.name} v{self.version}"


class RuleExecution(models.Model):
    """
    Record of rule executions against transactions
    """
    RESULT_CHOICES = (
        ('match', 'Match'),
        ('no_match', 'No Match'),
        ('error', 'Error'),
    )
    
    rule = models.ForeignKey(Rule, on_delete=models.CASCADE, related_name='executions')
    transaction_id = models.CharField(max_length=100)
    execution_time = models.DateTimeField(default=timezone.now)
    result = models.CharField(max_length=10, choices=RESULT_CHOICES)
    execution_time_ms = models.FloatField(null=True, blank=True)  # Execution time in milliseconds
    matched_conditions = JSONField(null=True, blank=True)  # Which conditions matched
    actions_taken = JSONField(null=True, blank=True)  # Actions that were executed
    
    class Meta:
        db_table = 'rule_executions'
        indexes = [
            models.Index(fields=['rule']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['execution_time']),
            models.Index(fields=['result']),
        ]


class RuleSet(models.Model):
    """
    Collection of rules that can be applied together
    """
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('testing', 'Testing'),
        ('archived', 'Archived'),
    )
    
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    rules = models.ManyToManyField(Rule, related_name='rule_sets')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='inactive')
    
    # A/B testing
    is_control = models.BooleanField(default=False)
    test_percentage = models.IntegerField(default=100)  # Percentage of traffic to route to this ruleset
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.CharField(max_length=100, null=True, blank=True)
    updated_by = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        db_table = 'rule_sets'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['is_control']),
        ]
        
    def __str__(self):
        return self.name


class RuleFunction(models.Model):
    """
    Custom functions that can be used in rule conditions
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    function_code = models.TextField()  # Python code for the function
    parameters = JSONField()  # Parameter definitions
    return_type = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        db_table = 'rule_functions'
        
    def __str__(self):
        return self.name


class RuleApproval(models.Model):
    """
    Approval workflow for rule changes
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    rule = models.ForeignKey(Rule, on_delete=models.CASCADE, related_name='approvals')
    requested_by = models.CharField(max_length=100)
    requested_at = models.DateTimeField(default=timezone.now)
    approved_by = models.CharField(max_length=100, null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    comments = models.TextField(null=True, blank=True)
    
    class Meta:
        db_table = 'rule_approvals'
        indexes = [
            models.Index(fields=['rule']),
            models.Index(fields=['status']),
            models.Index(fields=['requested_at']),
        ]


class RulePerformanceMetric(models.Model):
    """
    Performance metrics for rules over time
    """
    rule = models.ForeignKey(Rule, on_delete=models.CASCADE, related_name='performance_metrics')
    date = models.DateField()
    execution_count = models.IntegerField(default=0)
    match_count = models.IntegerField(default=0)
    false_positive_count = models.IntegerField(default=0)
    true_positive_count = models.IntegerField(default=0)
    average_execution_time_ms = models.FloatField(null=True, blank=True)
    
    class Meta:
        db_table = 'rule_performance_metrics'
        indexes = [
            models.Index(fields=['rule']),
            models.Index(fields=['date']),
        ]
        unique_together = ('rule', 'date')
