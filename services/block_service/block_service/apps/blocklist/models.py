from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class BlockList(models.Model):
    """
    Blocklist for quick rejection of high-risk entities
    """
    ENTITY_TYPES = (
        ('user', 'User'),
        ('card', 'Payment Card'),
        ('ip', 'IP Address'),
        ('device', 'Device'),
        ('merchant', 'Merchant'),
        ('email', 'Email'),
    )
    
    entity_type = models.CharField(max_length=20, choices=ENTITY_TYPES)
    entity_id = models.CharField(max_length=255)  # Hashed value for sensitive data
    reason = models.TextField(null=True, blank=True)
    source = models.CharField(max_length=100)  # Who added this entry
    
    # Status
    is_active = models.BooleanField(default=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'block_lists'
        indexes = [
            models.Index(fields=['entity_type', 'entity_id']),
            models.Index(fields=['is_active']),
        ]
        unique_together = ('entity_type', 'entity_id')
        
    def __str__(self):
        return f"{self.entity_type}: {self.entity_id}"


class BlockListImport(models.Model):
    """
    Import jobs for blocklists
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
    source_type = models.CharField(max_length=50)  # e.g., 'csv', 'api', 'manual'
    
    # Import configuration
    entity_type = models.CharField(max_length=20)
    mapping = JSONField(null=True, blank=True)  # Mapping between source fields and blocklist fields
    
    # Results
    total_records = models.IntegerField(default=0)
    imported_records = models.IntegerField(default=0)
    failed_records = models.IntegerField(default=0)
    error_log = models.TextField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'block_list_imports'
        indexes = [
            models.Index(fields=['import_id']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.status})"


class BlockListExport(models.Model):
    """
    Export jobs for blocklists
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    export_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    
    # Export details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    destination_file = models.CharField(max_length=255, null=True, blank=True)
    format = models.CharField(max_length=50)  # e.g., 'csv', 'json', 'xml'
    
    # Export configuration
    entity_types = JSONField()  # List of entity types to export
    filters = JSONField(null=True, blank=True)  # Filters to apply
    
    # Results
    total_records = models.IntegerField(default=0)
    exported_records = models.IntegerField(default=0)
    error_log = models.TextField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'block_list_exports'
        indexes = [
            models.Index(fields=['export_id']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.status})"
