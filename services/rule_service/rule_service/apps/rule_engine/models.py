from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class Rule(models.Model):
    """
    Rule definition for fraud detection
    """
    RULE_TYPES = (
        ('simple', 'Simple Rule'),
        ('complex', 'Complex Rule'),
        ('composite', 'Composite Rule'),
        ('ml_augmented', 'ML Augmented Rule'),
    )
    
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending_approval', 'Pending Approval'),
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('deprecated', 'Deprecated'),
        ('archived', 'Archived'),
    )
    
    rule_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    rule_type = models.CharField(max_length=20, choices=RULE_TYPES)
    
    # Rule content
    conditions = JSONField()  # Conditions for rule to match
    actions = JSONField()  # Actions to take when rule matches
    
    # Rule management
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    version = models.CharField(max_length=20)
    priority = models.IntegerField(default=100)  # Lower number = higher priority
    
    # Rule metadata
    tags = JSONField(null=True, blank=True)  # Tags for categorization
    transaction_types = JSONField()  # List of transaction types this rule applies to
    channels = JSONField(null=True, blank=True)  # List of channels this rule applies to
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.CharField(max_length=100, null=True, blank=True)
    updated_by = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        db_table = 'rules'
        indexes = [
            models.Index(fields=['rule_id']),
            models.Index(fields=['rule_type']),
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
        ]
        unique_together = ('name', 'version')
        
    def __str__(self):
        return f"{self.name} v{self.version}"


class RuleSet(models.Model):
    """
    Collection of rules
    """
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('archived', 'Archived'),
    )
    
    ruleset_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Ruleset content
    rules = JSONField()  # List of rule IDs in this ruleset
    
    # Ruleset management
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    version = models.CharField(max_length=20)
    
    # Ruleset metadata
    tags = JSONField(null=True, blank=True)  # Tags for categorization
    transaction_types = JSONField()  # List of transaction types this ruleset applies to
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.CharField(max_length=100, null=True, blank=True)
    updated_by = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        db_table = 'rule_sets'
        indexes = [
            models.Index(fields=['ruleset_id']),
            models.Index(fields=['status']),
        ]
        unique_together = ('name', 'version')
        
    def __str__(self):
        return f"{self.name} v{self.version}"


class RuleFunction(models.Model):
    """
    Custom functions for use in rules
    """
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('deprecated', 'Deprecated'),
    )
    
    function_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Function content
    function_code = models.TextField()
    function_type = models.CharField(max_length=50)  # e.g., 'python', 'javascript'
    
    # Function management
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    version = models.CharField(max_length=20)
    
    # Function metadata
    parameters = JSONField()  # Parameter definitions
    return_type = models.CharField(max_length=50)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.CharField(max_length=100, null=True, blank=True)
    updated_by = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        db_table = 'rule_functions'
        indexes = [
            models.Index(fields=['function_id']),
            models.Index(fields=['status']),
        ]
        unique_together = ('name', 'version')
        
    def __str__(self):
        return f"{self.name} v{self.version}"
