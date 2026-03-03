from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class AMLReport(models.Model):
    """
    Anti-Money Laundering reports
    """
    REPORT_TYPES = (
        ('sar', 'Suspicious Activity Report'),
        ('ctr', 'Currency Transaction Report'),
        ('internal', 'Internal Report'),
        ('regulatory', 'Regulatory Report'),
    )
    
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending_review', 'Pending Review'),
        ('approved', 'Approved'),
        ('submitted', 'Submitted'),
        ('rejected', 'Rejected'),
    )
    
    report_id = models.CharField(max_length=100, unique=True)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Report details
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Related entities
    case_id = models.CharField(max_length=100, null=True, blank=True)
    customer_id = models.CharField(max_length=100, null=True, blank=True)
    related_transactions = JSONField(null=True, blank=True)  # List of transaction IDs
    
    # Report content
    content = JSONField()
    attachments = JSONField(null=True, blank=True)  # List of attachment IDs
    
    # Workflow
    created_by = models.CharField(max_length=100)
    reviewed_by = models.CharField(max_length=100, null=True, blank=True)
    approved_by = models.CharField(max_length=100, null=True, blank=True)
    submitted_by = models.CharField(max_length=100, null=True, blank=True)
    
    # Submission details
    submission_reference = models.CharField(max_length=255, null=True, blank=True)
    submission_date = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'aml_reports'
        indexes = [
            models.Index(fields=['report_id']),
            models.Index(fields=['report_type']),
            models.Index(fields=['status']),
            models.Index(fields=['case_id']),
            models.Index(fields=['customer_id']),
            models.Index(fields=['created_at']),
        ]
        
    def __str__(self):
        return f"{self.report_id}: {self.title}"


class ReportTemplate(models.Model):
    """
    Templates for AML reports
    """
    template_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    report_type = models.CharField(max_length=20)
    
    # Template content
    content_structure = JSONField()  # Structure of the report
    default_values = JSONField(null=True, blank=True)  # Default values for fields
    
    # Template management
    is_active = models.BooleanField(default=True)
    version = models.CharField(max_length=20)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'report_templates'
        indexes = [
            models.Index(fields=['template_id']),
            models.Index(fields=['report_type']),
            models.Index(fields=['is_active']),
        ]
        unique_together = ('name', 'version')
        
    def __str__(self):
        return f"{self.name} v{self.version}"


class RegulatoryRequirement(models.Model):
    """
    Regulatory requirements for AML reporting
    """
    requirement_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Requirement details
    jurisdiction = models.CharField(max_length=100)
    regulation = models.CharField(max_length=255)
    report_type = models.CharField(max_length=20)
    
    # Requirement content
    required_fields = JSONField()  # Fields required by regulation
    thresholds = JSONField(null=True, blank=True)  # Reporting thresholds
    
    # Deadlines
    filing_deadline_days = models.IntegerField(null=True, blank=True)
    
    # Requirement management
    is_active = models.BooleanField(default=True)
    effective_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'regulatory_requirements'
        indexes = [
            models.Index(fields=['requirement_id']),
            models.Index(fields=['jurisdiction']),
            models.Index(fields=['report_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.jurisdiction})"


class ReportingMetrics(models.Model):
    """
    Metrics for AML reporting
    """
    date = models.DateField(unique=True)
    
    # Volume metrics
    total_reports = models.IntegerField(default=0)
    sar_count = models.IntegerField(default=0)
    ctr_count = models.IntegerField(default=0)
    internal_count = models.IntegerField(default=0)
    regulatory_count = models.IntegerField(default=0)
    
    # Status metrics
    draft_count = models.IntegerField(default=0)
    pending_review_count = models.IntegerField(default=0)
    approved_count = models.IntegerField(default=0)
    submitted_count = models.IntegerField(default=0)
    rejected_count = models.IntegerField(default=0)
    
    # Timeliness metrics
    average_time_to_submit_days = models.FloatField(null=True, blank=True)
    reports_submitted_late = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reporting_metrics'
        indexes = [
            models.Index(fields=['date']),
        ]
