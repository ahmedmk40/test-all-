from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class WatchList(models.Model):
    """
    Watch lists for AML screening
    """
    LIST_TYPES = (
        ('sanctions', 'Sanctions List'),
        ('pep', 'Politically Exposed Persons'),
        ('adverse_media', 'Adverse Media'),
        ('high_risk', 'High Risk Entities'),
        ('internal', 'Internal Watch List'),
    )
    
    list_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    list_type = models.CharField(max_length=20, choices=LIST_TYPES)
    description = models.TextField(null=True, blank=True)
    
    # List details
    source = models.CharField(max_length=255)
    last_updated = models.DateTimeField(null=True, blank=True)
    update_frequency = models.CharField(max_length=50, null=True, blank=True)
    
    # List management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'watch_lists'
        indexes = [
            models.Index(fields=['list_id']),
            models.Index(fields=['list_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.list_type})"


class WatchListEntry(models.Model):
    """
    Entries in watch lists
    """
    ENTITY_TYPES = (
        ('individual', 'Individual'),
        ('organization', 'Organization'),
        ('vessel', 'Vessel'),
        ('country', 'Country'),
    )
    
    entry_id = models.CharField(max_length=100, unique=True)
    list_id = models.CharField(max_length=100)
    
    # Entry details
    entity_type = models.CharField(max_length=20, choices=ENTITY_TYPES)
    name = models.CharField(max_length=255)
    aliases = JSONField(null=True, blank=True)  # Alternative names
    
    # Entity information
    date_of_birth = models.DateField(null=True, blank=True)
    place_of_birth = models.CharField(max_length=255, null=True, blank=True)
    nationality = models.CharField(max_length=100, null=True, blank=True)
    identification = JSONField(null=True, blank=True)  # ID documents
    
    # Risk information
    risk_score = models.FloatField(null=True, blank=True)
    risk_factors = JSONField(null=True, blank=True)
    
    # Additional information
    addresses = JSONField(null=True, blank=True)
    relationships = JSONField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    
    # Entry management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'watch_list_entries'
        indexes = [
            models.Index(fields=['entry_id']),
            models.Index(fields=['list_id']),
            models.Index(fields=['entity_type']),
            models.Index(fields=['name']),
            models.Index(fields=['is_active']),
        ]


class ScreeningResult(models.Model):
    """
    Results of AML screening
    """
    RESULT_TYPES = (
        ('match', 'Match'),
        ('possible_match', 'Possible Match'),
        ('no_match', 'No Match'),
        ('error', 'Error'),
    )
    
    result_id = models.CharField(max_length=100, unique=True)
    
    # Screening details
    entity_type = models.CharField(max_length=20)
    entity_id = models.CharField(max_length=100)
    lists_checked = JSONField()  # List IDs that were checked
    
    # Result details
    result_type = models.CharField(max_length=20, choices=RESULT_TYPES)
    matches = JSONField(null=True, blank=True)  # List of matched entries
    match_score = models.FloatField(null=True, blank=True)
    
    # Case management
    case_id = models.CharField(max_length=100, null=True, blank=True)
    
    # Error details
    error_message = models.TextField(null=True, blank=True)
    
    # Performance
    execution_time_ms = models.FloatField(null=True, blank=True)
    
    # Timestamps
    screening_time = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'screening_results'
        indexes = [
            models.Index(fields=['result_id']),
            models.Index(fields=['entity_type', 'entity_id']),
            models.Index(fields=['result_type']),
            models.Index(fields=['case_id']),
            models.Index(fields=['screening_time']),
        ]


class ScreeningConfiguration(models.Model):
    """
    Configuration for AML screening
    """
    config_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Configuration details
    entity_types = JSONField()  # Entity types to screen
    lists = JSONField()  # List IDs to check
    
    # Matching configuration
    match_threshold = models.FloatField(default=0.8)
    fuzzy_matching = models.BooleanField(default=True)
    match_algorithms = JSONField(null=True, blank=True)
    
    # Screening triggers
    trigger_on_create = models.BooleanField(default=True)
    trigger_on_update = models.BooleanField(default=True)
    trigger_periodic = models.BooleanField(default=False)
    periodic_schedule = models.CharField(max_length=50, null=True, blank=True)
    
    # Configuration management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'screening_configurations'
        indexes = [
            models.Index(fields=['config_id']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return self.name
