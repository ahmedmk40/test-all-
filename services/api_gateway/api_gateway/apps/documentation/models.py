from django.db import models
from django.utils import timezone


class APIDocumentation(models.Model):
    """
    API documentation configuration
    """
    doc_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    version = models.CharField(max_length=20)
    
    # Documentation configuration
    is_public = models.BooleanField(default=True)
    format = models.CharField(max_length=20, default='openapi')  # openapi, swagger, etc.
    
    # Content
    spec_file_path = models.CharField(max_length=255, null=True, blank=True)
    spec_content = models.JSONField(null=True, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'api_documentation'
        indexes = [
            models.Index(fields=['doc_id']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.title} v{self.version}"


class EndpointDocumentation(models.Model):
    """
    Documentation for individual API endpoints
    """
    endpoint_id = models.CharField(max_length=100, unique=True)
    api_doc = models.ForeignKey(APIDocumentation, on_delete=models.CASCADE, related_name='endpoints')
    
    # Endpoint details
    path = models.CharField(max_length=255)
    method = models.CharField(max_length=10)
    summary = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Request details
    request_params = models.JSONField(null=True, blank=True)
    request_body = models.JSONField(null=True, blank=True)
    
    # Response details
    responses = models.JSONField()
    
    # Examples
    request_examples = models.JSONField(null=True, blank=True)
    response_examples = models.JSONField(null=True, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_deprecated = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'endpoint_documentation'
        indexes = [
            models.Index(fields=['endpoint_id']),
            models.Index(fields=['path', 'method']),
            models.Index(fields=['is_active']),
            models.Index(fields=['is_deprecated']),
        ]
        unique_together = ('api_doc', 'path', 'method')
        
    def __str__(self):
        return f"{self.method} {self.path}"


class SchemaDefinition(models.Model):
    """
    Schema definitions for API documentation
    """
    schema_id = models.CharField(max_length=100, unique=True)
    api_doc = models.ForeignKey(APIDocumentation, on_delete=models.CASCADE, related_name='schemas')
    
    # Schema details
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Schema content
    schema = models.JSONField()
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'schema_definitions'
        indexes = [
            models.Index(fields=['schema_id']),
            models.Index(fields=['name']),
            models.Index(fields=['is_active']),
        ]
        unique_together = ('api_doc', 'name')
        
    def __str__(self):
        return self.name


class DocumentationAccess(models.Model):
    """
    Access logs for API documentation
    """
    access_id = models.CharField(max_length=100, unique=True)
    api_doc = models.ForeignKey(APIDocumentation, on_delete=models.CASCADE, related_name='access_logs')
    
    # Access details
    client_ip = models.GenericIPAddressField()
    user_agent = models.TextField(null=True, blank=True)
    user_id = models.CharField(max_length=100, null=True, blank=True)
    
    # Page details
    page = models.CharField(max_length=255, null=True, blank=True)
    
    # Timestamps
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'documentation_access'
        indexes = [
            models.Index(fields=['access_id']),
            models.Index(fields=['timestamp']),
        ]
