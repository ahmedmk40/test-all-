from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class APIKey(models.Model):
    """
    API keys for service authentication
    """
    key_id = models.CharField(max_length=100, unique=True)
    key_secret = models.CharField(max_length=255)  # Hashed secret
    service_name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    
    # Permissions
    allowed_endpoints = JSONField(null=True, blank=True)  # List of allowed endpoints
    rate_limit = models.IntegerField(default=1000)  # Requests per minute
    
    # Usage tracking
    last_used = models.DateTimeField(null=True, blank=True)
    request_count = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'api_keys'
        indexes = [
            models.Index(fields=['key_id']),
            models.Index(fields=['service_name']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.service_name} - {self.key_id}"


class Route(models.Model):
    """
    API Gateway routing configuration
    """
    path = models.CharField(max_length=255, unique=True)
    target_service = models.CharField(max_length=100)
    target_path = models.CharField(max_length=255)
    
    # Route configuration
    methods = JSONField()  # Allowed HTTP methods
    requires_auth = models.BooleanField(default=True)
    rate_limit = models.IntegerField(default=100)  # Requests per minute
    
    # Caching
    cache_enabled = models.BooleanField(default=False)
    cache_ttl_seconds = models.IntegerField(default=60)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'routes'
        indexes = [
            models.Index(fields=['path']),
            models.Index(fields=['target_service']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.path} -> {self.target_service}"


class RequestLog(models.Model):
    """
    Log of API requests for monitoring and debugging
    """
    request_id = models.CharField(max_length=100, unique=True)
    path = models.CharField(max_length=255)
    method = models.CharField(max_length=10)
    
    # Request details
    client_ip = models.GenericIPAddressField()
    user_agent = models.TextField(null=True, blank=True)
    api_key_id = models.CharField(max_length=100, null=True, blank=True)
    
    # Response details
    status_code = models.IntegerField()
    response_time_ms = models.FloatField()
    response_size_bytes = models.IntegerField(null=True, blank=True)
    
    # Error tracking
    error_message = models.TextField(null=True, blank=True)
    stack_trace = models.TextField(null=True, blank=True)
    
    # Request/response bodies (for debugging, no sensitive data)
    request_headers = JSONField(null=True, blank=True)
    request_params = JSONField(null=True, blank=True)
    response_headers = JSONField(null=True, blank=True)
    
    # Timestamps
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'request_logs'
        indexes = [
            models.Index(fields=['request_id']),
            models.Index(fields=['path']),
            models.Index(fields=['status_code']),
            models.Index(fields=['timestamp']),
        ]


class RateLimit(models.Model):
    """
    Rate limiting configuration and tracking
    """
    key = models.CharField(max_length=255, unique=True)  # IP, API key, or user ID
    key_type = models.CharField(max_length=20)  # 'ip', 'api_key', 'user_id'
    
    # Limits
    requests_per_minute = models.IntegerField(default=60)
    requests_per_hour = models.IntegerField(default=1000)
    requests_per_day = models.IntegerField(default=10000)
    
    # Current counts
    minute_count = models.IntegerField(default=0)
    hour_count = models.IntegerField(default=0)
    day_count = models.IntegerField(default=0)
    
    # Reset timestamps
    minute_reset = models.DateTimeField()
    hour_reset = models.DateTimeField()
    day_reset = models.DateTimeField()
    
    # Block status
    is_blocked = models.BooleanField(default=False)
    blocked_until = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rate_limits'
        indexes = [
            models.Index(fields=['key']),
            models.Index(fields=['key_type']),
            models.Index(fields=['is_blocked']),
        ]
