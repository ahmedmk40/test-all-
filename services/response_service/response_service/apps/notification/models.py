from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class Notification(models.Model):
    """
    Notifications for transaction decisions
    """
    NOTIFICATION_TYPES = (
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push Notification'),
        ('in_app', 'In-App Notification'),
        ('webhook', 'Webhook'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
    )
    
    notification_id = models.CharField(max_length=100, unique=True)
    transaction_id = models.CharField(max_length=100)
    decision_id = models.CharField(max_length=100, null=True, blank=True)
    
    # Notification details
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    recipient = models.CharField(max_length=255)
    subject = models.CharField(max_length=255, null=True, blank=True)
    content = models.TextField()
    
    # Notification status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    delivery_attempts = models.IntegerField(default=0)
    last_attempt = models.DateTimeField(null=True, blank=True)
    
    # Error details
    error_message = models.TextField(null=True, blank=True)
    
    # Timestamps
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notifications'
        indexes = [
            models.Index(fields=['notification_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['decision_id']),
            models.Index(fields=['notification_type']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]


class NotificationTemplate(models.Model):
    """
    Templates for notifications
    """
    template_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Template details
    notification_type = models.CharField(max_length=20)
    subject_template = models.CharField(max_length=255, null=True, blank=True)
    content_template = models.TextField()
    
    # Template management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notification_templates'
        indexes = [
            models.Index(fields=['template_id']),
            models.Index(fields=['notification_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.notification_type})"


class NotificationPreference(models.Model):
    """
    User preferences for notifications
    """
    preference_id = models.CharField(max_length=100, unique=True)
    user_id = models.CharField(max_length=100)
    
    # Preference details
    email_enabled = models.BooleanField(default=True)
    sms_enabled = models.BooleanField(default=True)
    push_enabled = models.BooleanField(default=True)
    in_app_enabled = models.BooleanField(default=True)
    
    # Contact information
    email = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    device_tokens = JSONField(null=True, blank=True)  # For push notifications
    
    # Notification types
    transaction_notifications = models.BooleanField(default=True)
    security_notifications = models.BooleanField(default=True)
    marketing_notifications = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notification_preferences'
        indexes = [
            models.Index(fields=['preference_id']),
            models.Index(fields=['user_id']),
        ]


class NotificationMetrics(models.Model):
    """
    Metrics for notifications
    """
    date = models.DateField(unique=True)
    
    # Volume metrics
    total_notifications = models.IntegerField(default=0)
    email_count = models.IntegerField(default=0)
    sms_count = models.IntegerField(default=0)
    push_count = models.IntegerField(default=0)
    in_app_count = models.IntegerField(default=0)
    webhook_count = models.IntegerField(default=0)
    
    # Status metrics
    sent_count = models.IntegerField(default=0)
    delivered_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
    
    # Performance metrics
    average_delivery_time_ms = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notification_metrics'
        indexes = [
            models.Index(fields=['date']),
        ]
