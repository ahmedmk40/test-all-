from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class EventStream(models.Model):
    """
    Event stream for transaction processing
    """
    STREAM_TYPES = (
        ('transaction', 'Transaction Stream'),
        ('signal', 'Signal Stream'),
        ('response', 'Response Stream'),
        ('system', 'System Stream'),
    )
    
    stream_id = models.CharField(max_length=100, unique=True)
    stream_type = models.CharField(max_length=20, choices=STREAM_TYPES)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Configuration
    is_active = models.BooleanField(default=True)
    max_length = models.IntegerField(default=10000)  # Maximum number of events to keep
    retention_days = models.IntegerField(default=7)  # Days to keep events
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'event_streams'
        indexes = [
            models.Index(fields=['stream_id']),
            models.Index(fields=['stream_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.stream_type})"


class ConsumerGroup(models.Model):
    """
    Consumer group for event stream processing
    """
    group_id = models.CharField(max_length=100, unique=True)
    stream = models.ForeignKey(EventStream, on_delete=models.CASCADE, related_name='consumer_groups')
    name = models.CharField(max_length=255)
    
    # Configuration
    is_active = models.BooleanField(default=True)
    max_consumers = models.IntegerField(default=10)
    
    # Status
    last_activity = models.DateTimeField(default=timezone.now)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'consumer_groups'
        indexes = [
            models.Index(fields=['group_id']),
            models.Index(fields=['is_active']),
            models.Index(fields=['last_activity']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.stream.name})"


class Consumer(models.Model):
    """
    Individual consumer in a consumer group
    """
    consumer_id = models.CharField(max_length=100, unique=True)
    group = models.ForeignKey(ConsumerGroup, on_delete=models.CASCADE, related_name='consumers')
    name = models.CharField(max_length=255)
    
    # Status
    is_active = models.BooleanField(default=True)
    last_heartbeat = models.DateTimeField(default=timezone.now)
    
    # Processing state
    last_processed_id = models.CharField(max_length=100, null=True, blank=True)
    pending_messages = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'consumers'
        indexes = [
            models.Index(fields=['consumer_id']),
            models.Index(fields=['is_active']),
            models.Index(fields=['last_heartbeat']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.group.name})"


class EventMessage(models.Model):
    """
    Message in an event stream
    """
    message_id = models.CharField(max_length=100, unique=True)
    stream = models.ForeignKey(EventStream, on_delete=models.CASCADE, related_name='messages')
    
    # Message content
    content = JSONField()
    
    # Processing state
    is_processed = models.BooleanField(default=False)
    processed_by = models.ForeignKey(Consumer, null=True, blank=True, on_delete=models.SET_NULL, related_name='processed_messages')
    processed_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'event_messages'
        indexes = [
            models.Index(fields=['message_id']),
            models.Index(fields=['is_processed']),
            models.Index(fields=['created_at']),
        ]
