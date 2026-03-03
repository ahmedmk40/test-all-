from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class RuleApproval(models.Model):
    """
    Approval workflow for rules
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    approval_id = models.CharField(max_length=100, unique=True)
    rule_id = models.CharField(max_length=100)
    rule_version = models.CharField(max_length=20)
    
    # Approval details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    requested_by = models.CharField(max_length=100)
    approved_by = models.CharField(max_length=100, null=True, blank=True)
    
    # Approval metadata
    comments = models.TextField(null=True, blank=True)
    changes = JSONField(null=True, blank=True)  # Changes made in this version
    
    # Timestamps
    requested_at = models.DateTimeField(default=timezone.now)
    approved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'rule_approvals'
        indexes = [
            models.Index(fields=['approval_id']),
            models.Index(fields=['rule_id']),
            models.Index(fields=['status']),
            models.Index(fields=['requested_at']),
        ]


class RuleVersion(models.Model):
    """
    Version history for rules
    """
    version_id = models.CharField(max_length=100, unique=True)
    rule_id = models.CharField(max_length=100)
    version = models.CharField(max_length=20)
    
    # Version content
    rule_content = JSONField()  # Snapshot of rule at this version
    
    # Version metadata
    changes = JSONField(null=True, blank=True)  # Changes made in this version
    change_reason = models.TextField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    created_by = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        db_table = 'rule_versions'
        indexes = [
            models.Index(fields=['version_id']),
            models.Index(fields=['rule_id', 'version']),
            models.Index(fields=['created_at']),
        ]
        unique_together = ('rule_id', 'version')


class RuleImport(models.Model):
    """
    Import jobs for rules
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    import_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    
    # Import details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    source_file = models.CharField(max_length=255, null=True, blank=True)
    source_type = models.CharField(max_length=50)  # e.g., 'csv', 'json', 'xml'
    
    # Import configuration
    mapping = JSONField(null=True, blank=True)  # Mapping between source fields and rule fields
    
    # Results
    total_rules = models.IntegerField(default=0)
    imported_rules = models.IntegerField(default=0)
    failed_rules = models.IntegerField(default=0)
    error_log = models.TextField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'rule_imports'
        indexes = [
            models.Index(fields=['import_id']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
