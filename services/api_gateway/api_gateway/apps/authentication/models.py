from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class AuthenticationConfig(models.Model):
    """
    Configuration for authentication methods
    """
    AUTH_TYPES = (
        ('api_key', 'API Key'),
        ('jwt', 'JWT Token'),
        ('oauth2', 'OAuth 2.0'),
        ('basic', 'Basic Auth'),
    )
    
    config_id = models.CharField(max_length=100, unique=True)
    auth_type = models.CharField(max_length=20, choices=AUTH_TYPES)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Configuration
    is_active = models.BooleanField(default=True)
    settings = models.JSONField()  # Auth-specific settings
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'authentication_configs'
        indexes = [
            models.Index(fields=['config_id']),
            models.Index(fields=['auth_type']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.auth_type})"


class AuthenticationLog(models.Model):
    """
    Log of authentication attempts
    """
    STATUS_CHOICES = (
        ('success', 'Success'),
        ('failure', 'Failure'),
        ('expired', 'Expired'),
        ('revoked', 'Revoked'),
    )
    
    log_id = models.CharField(max_length=100, unique=True)
    auth_config = models.ForeignKey(AuthenticationConfig, on_delete=models.CASCADE, related_name='logs')
    
    # Authentication details
    auth_type = models.CharField(max_length=20)
    identifier = models.CharField(max_length=255)  # Username, API key ID, etc.
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    
    # Request details
    client_ip = models.GenericIPAddressField()
    user_agent = models.TextField(null=True, blank=True)
    request_path = models.CharField(max_length=255, null=True, blank=True)
    
    # Error details
    error_message = models.TextField(null=True, blank=True)
    
    # Timestamps
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'authentication_logs'
        indexes = [
            models.Index(fields=['log_id']),
            models.Index(fields=['auth_type']),
            models.Index(fields=['identifier']),
            models.Index(fields=['status']),
            models.Index(fields=['timestamp']),
        ]


class TokenBlacklist(models.Model):
    """
    Blacklist for revoked tokens
    """
    token_id = models.CharField(max_length=255, unique=True)
    token_type = models.CharField(max_length=20)
    
    # Revocation details
    revoked_by = models.CharField(max_length=255, null=True, blank=True)
    reason = models.TextField(null=True, blank=True)
    
    # Token metadata
    user_identifier = models.CharField(max_length=255, null=True, blank=True)
    original_iat = models.DateTimeField(null=True, blank=True)  # Original issued at time
    
    # Timestamps
    revoked_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'token_blacklist'
        indexes = [
            models.Index(fields=['token_id']),
            models.Index(fields=['token_type']),
            models.Index(fields=['user_identifier']),
            models.Index(fields=['revoked_at']),
            models.Index(fields=['expires_at']),
        ]
