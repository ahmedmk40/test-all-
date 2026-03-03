from django.db import models
from django.utils import timezone


class Route(models.Model):
    """
    API routing configuration
    """
    METHODS = (
        ('GET', 'GET'),
        ('POST', 'POST'),
        ('PUT', 'PUT'),
        ('PATCH', 'PATCH'),
        ('DELETE', 'DELETE'),
        ('OPTIONS', 'OPTIONS'),
        ('HEAD', 'HEAD'),
    )
    
    route_id = models.CharField(max_length=100, unique=True)
    path = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Target service
    target_service = models.CharField(max_length=100)
    target_path = models.CharField(max_length=255)
    
    # Route configuration
    methods = models.JSONField()  # List of allowed HTTP methods
    requires_auth = models.BooleanField(default=True)
    is_public = models.BooleanField(default=False)
    
    # Rate limiting
    rate_limit_enabled = models.BooleanField(default=True)
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
            models.Index(fields=['route_id']),
            models.Index(fields=['path']),
            models.Index(fields=['target_service']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.path} -> {self.target_service})"


class RoutePermission(models.Model):
    """
    Permissions for routes
    """
    permission_id = models.CharField(max_length=100, unique=True)
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='permissions')
    
    # Permission details
    role = models.CharField(max_length=100)
    can_access = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'route_permissions'
        indexes = [
            models.Index(fields=['permission_id']),
            models.Index(fields=['role']),
        ]
        unique_together = ('route', 'role')
        
    def __str__(self):
        return f"{self.role} - {self.route.name}"


class RequestLog(models.Model):
    """
    Log of API requests
    """
    STATUS_RANGES = (
        ('1xx', 'Informational'),
        ('2xx', 'Success'),
        ('3xx', 'Redirection'),
        ('4xx', 'Client Error'),
        ('5xx', 'Server Error'),
    )
    
    request_id = models.CharField(max_length=100, unique=True)
    route = models.ForeignKey(Route, null=True, blank=True, on_delete=models.SET_NULL, related_name='requests')
    
    # Request details
    method = models.CharField(max_length=10)
    path = models.CharField(max_length=255)
    query_params = models.JSONField(null=True, blank=True)
    headers = models.JSONField(null=True, blank=True)
    
    # Client details
    client_ip = models.GenericIPAddressField()
    user_agent = models.TextField(null=True, blank=True)
    user_id = models.CharField(max_length=100, null=True, blank=True)
    
    # Response details
    status_code = models.IntegerField()
    status_range = models.CharField(max_length=3, choices=STATUS_RANGES)
    response_size_bytes = models.IntegerField(null=True, blank=True)
    response_time_ms = models.FloatField()
    
    # Error details
    error_message = models.TextField(null=True, blank=True)
    
    # Timestamps
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'request_logs'
        indexes = [
            models.Index(fields=['request_id']),
            models.Index(fields=['path']),
            models.Index(fields=['method']),
            models.Index(fields=['status_code']),
            models.Index(fields=['status_range']),
            models.Index(fields=['timestamp']),
        ]


class ProxyConfig(models.Model):
    """
    Configuration for proxy behavior
    """
    config_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    
    # Proxy configuration
    timeout_ms = models.IntegerField(default=30000)
    retry_count = models.IntegerField(default=0)
    retry_delay_ms = models.IntegerField(default=1000)
    
    # Header manipulation
    add_headers = models.JSONField(null=True, blank=True)
    remove_headers = models.JSONField(null=True, blank=True)
    
    # Request transformation
    transform_request = models.BooleanField(default=False)
    request_transform_script = models.TextField(null=True, blank=True)
    
    # Response transformation
    transform_response = models.BooleanField(default=False)
    response_transform_script = models.TextField(null=True, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'proxy_configs'
        indexes = [
            models.Index(fields=['config_id']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return self.name
