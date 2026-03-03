from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class ServiceCoordinator(models.Model):
    """
    Configuration for service coordination
    """
    coordinator_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Configuration
    is_active = models.BooleanField(default=True)
    coordination_mode = models.CharField(max_length=50)  # e.g., 'synchronous', 'asynchronous'
    
    # Service orchestration
    service_sequence = JSONField(null=True, blank=True)  # Ordered sequence of services
    parallel_services = JSONField(null=True, blank=True)  # Services that can run in parallel
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'service_coordinators'
        indexes = [
            models.Index(fields=['coordinator_id']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return self.name


class ServiceDependency(models.Model):
    """
    Dependencies between services
    """
    dependency_id = models.CharField(max_length=100, unique=True)
    coordinator = models.ForeignKey(ServiceCoordinator, on_delete=models.CASCADE, related_name='dependencies')
    
    # Dependency definition
    service = models.CharField(max_length=100)  # Service that has dependencies
    depends_on = models.CharField(max_length=100)  # Service it depends on
    
    # Dependency type
    is_required = models.BooleanField(default=True)  # Is this dependency required?
    dependency_type = models.CharField(max_length=50)  # e.g., 'data', 'signal', 'control'
    
    # Dependency management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'service_dependencies'
        indexes = [
            models.Index(fields=['dependency_id']),
            models.Index(fields=['service']),
            models.Index(fields=['depends_on']),
            models.Index(fields=['is_active']),
        ]
        unique_together = ('coordinator', 'service', 'depends_on')
        
    def __str__(self):
        return f"{self.service} -> {self.depends_on}"


class ServiceRequest(models.Model):
    """
    Requests sent to services
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('received', 'Received'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('timeout', 'Timeout'),
    )
    
    request_id = models.CharField(max_length=100, unique=True)
    coordinator = models.ForeignKey(ServiceCoordinator, on_delete=models.CASCADE, related_name='requests')
    
    # Request details
    transaction_id = models.CharField(max_length=100)
    service = models.CharField(max_length=100)
    request_type = models.CharField(max_length=50)
    
    # Request content
    payload = JSONField()
    
    # Request status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    response_data = JSONField(null=True, blank=True)
    
    # Error handling
    error_message = models.TextField(null=True, blank=True)
    retry_count = models.IntegerField(default=0)
    
    # Performance
    request_time = models.DateTimeField(null=True, blank=True)
    response_time = models.DateTimeField(null=True, blank=True)
    execution_time_ms = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'service_requests'
        indexes = [
            models.Index(fields=['request_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['service']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]


class CircuitBreakerConfig(models.Model):
    """
    Configuration for circuit breakers
    """
    config_id = models.CharField(max_length=100, unique=True)
    coordinator = models.ForeignKey(ServiceCoordinator, on_delete=models.CASCADE, related_name='circuit_breaker_configs')
    
    # Service configuration
    service = models.CharField(max_length=100, unique=True)
    
    # Circuit breaker parameters
    failure_threshold = models.IntegerField(default=5)
    reset_timeout_seconds = models.IntegerField(default=60)
    half_open_requests = models.IntegerField(default=1)
    
    # Failure criteria
    failure_http_codes = JSONField(null=True, blank=True)  # HTTP codes to count as failures
    timeout_ms = models.IntegerField(default=5000)  # Request timeout in milliseconds
    
    # Circuit breaker management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'circuit_breaker_configs'
        indexes = [
            models.Index(fields=['config_id']),
            models.Index(fields=['service']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.service} - {self.failure_threshold} failures"


class ServiceDiscovery(models.Model):
    """
    Service discovery registry
    """
    service_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    service_type = models.CharField(max_length=50)
    
    # Service location
    host = models.CharField(max_length=255)
    port = models.IntegerField()
    endpoint = models.CharField(max_length=255, null=True, blank=True)
    
    # Service status
    is_active = models.BooleanField(default=True)
    status = models.CharField(max_length=20, default='active')
    last_heartbeat = models.DateTimeField(default=timezone.now)
    
    # Service metadata
    version = models.CharField(max_length=20, null=True, blank=True)
    capabilities = JSONField(null=True, blank=True)
    metadata = JSONField(null=True, blank=True)
    
    # Timestamps
    registered_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'service_discovery'
        indexes = [
            models.Index(fields=['service_id']),
            models.Index(fields=['service_type']),
            models.Index(fields=['is_active']),
            models.Index(fields=['last_heartbeat']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.service_type})"
