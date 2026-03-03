from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class AMLCase(models.Model):
    """
    Anti-Money Laundering case
    """
    CASE_TYPES = (
        ('suspicious_activity', 'Suspicious Activity'),
        ('transaction_monitoring', 'Transaction Monitoring'),
        ('customer_due_diligence', 'Customer Due Diligence'),
        ('watchlist_hit', 'Watchlist Hit'),
        ('investigation', 'Investigation'),
    )
    
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('under_review', 'Under Review'),
        ('escalated', 'Escalated'),
        ('closed_false_positive', 'Closed - False Positive'),
        ('closed_sar_filed', 'Closed - SAR Filed'),
        ('closed_no_action', 'Closed - No Action'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    )
    
    case_id = models.CharField(max_length=100, unique=True)
    case_type = models.CharField(max_length=30, choices=CASE_TYPES)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    # Case details
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    risk_score = models.FloatField(null=True, blank=True)
    
    # Customer information
    customer_id = models.CharField(max_length=100, null=True, blank=True)
    customer_name = models.CharField(max_length=255, null=True, blank=True)
    customer_risk_level = models.CharField(max_length=10, null=True, blank=True)
    
    # Case management
    assigned_to = models.CharField(max_length=100, null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    
    # Related entities
    related_transactions = JSONField(null=True, blank=True)  # List of transaction IDs
    related_cases = JSONField(null=True, blank=True)  # List of related case IDs
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'aml_cases'
        indexes = [
            models.Index(fields=['case_id']),
            models.Index(fields=['case_type']),
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
            models.Index(fields=['customer_id']),
            models.Index(fields=['assigned_to']),
            models.Index(fields=['created_at']),
        ]
        
    def __str__(self):
        return f"{self.case_id}: {self.title}"


class CaseNote(models.Model):
    """
    Notes for AML cases
    """
    note_id = models.CharField(max_length=100, unique=True)
    case_id = models.CharField(max_length=100)
    
    # Note details
    content = models.TextField()
    
    # Author information
    created_by = models.CharField(max_length=100)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'case_notes'
        indexes = [
            models.Index(fields=['note_id']),
            models.Index(fields=['case_id']),
            models.Index(fields=['created_by']),
            models.Index(fields=['created_at']),
        ]


class CaseDocument(models.Model):
    """
    Documents attached to AML cases
    """
    DOCUMENT_TYPES = (
        ('transaction_record', 'Transaction Record'),
        ('customer_information', 'Customer Information'),
        ('correspondence', 'Correspondence'),
        ('evidence', 'Evidence'),
        ('report', 'Report'),
        ('other', 'Other'),
    )
    
    document_id = models.CharField(max_length=100, unique=True)
    case_id = models.CharField(max_length=100)
    
    # Document details
    document_type = models.CharField(max_length=30, choices=DOCUMENT_TYPES)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    file_path = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    file_size_bytes = models.IntegerField(null=True, blank=True)
    
    # Upload information
    uploaded_by = models.CharField(max_length=100)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'case_documents'
        indexes = [
            models.Index(fields=['document_id']),
            models.Index(fields=['case_id']),
            models.Index(fields=['document_type']),
            models.Index(fields=['uploaded_by']),
            models.Index(fields=['created_at']),
        ]


class CaseActivity(models.Model):
    """
    Activity log for AML cases
    """
    ACTIVITY_TYPES = (
        ('case_created', 'Case Created'),
        ('status_changed', 'Status Changed'),
        ('priority_changed', 'Priority Changed'),
        ('assignment_changed', 'Assignment Changed'),
        ('note_added', 'Note Added'),
        ('document_added', 'Document Added'),
        ('case_closed', 'Case Closed'),
    )
    
    activity_id = models.CharField(max_length=100, unique=True)
    case_id = models.CharField(max_length=100)
    
    # Activity details
    activity_type = models.CharField(max_length=30, choices=ACTIVITY_TYPES)
    description = models.TextField()
    
    # Changes
    old_value = models.TextField(null=True, blank=True)
    new_value = models.TextField(null=True, blank=True)
    
    # User information
    performed_by = models.CharField(max_length=100)
    
    # Timestamps
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'case_activities'
        indexes = [
            models.Index(fields=['activity_id']),
            models.Index(fields=['case_id']),
            models.Index(fields=['activity_type']),
            models.Index(fields=['performed_by']),
            models.Index(fields=['timestamp']),
        ]
