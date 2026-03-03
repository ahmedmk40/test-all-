from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class TransactionStateManager(models.Model):
    """
    Configuration for transaction state management
    """
    manager_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    
    # Configuration
    is_active = models.BooleanField(default=True)
    timeout_seconds = models.IntegerField(default=30)  # Default timeout for transactions
    max_retries = models.IntegerField(default=3)  # Maximum retry attempts
    
    # Service configuration
    required_services = JSONField()  # List of services required for completion
    optional_services = JSONField(null=True, blank=True)  # List of optional services
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'transaction_state_managers'
        indexes = [
            models.Index(fields=['manager_id']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return self.name


class StateTransition(models.Model):
    """
    Transitions between transaction states
    """
    transition_id = models.CharField(max_length=100, unique=True)
    manager = models.ForeignKey(TransactionStateManager, on_delete=models.CASCADE, related_name='transitions')
    
    # Transition definition
    from_state = models.CharField(max_length=50)
    to_state = models.CharField(max_length=50)
    trigger = models.CharField(max_length=100)  # Event that triggers this transition
    
    # Transition conditions and actions
    conditions = JSONField(null=True, blank=True)  # Conditions for this transition
    actions = JSONField(null=True, blank=True)  # Actions to take during transition
    
    # Transition management
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=100)  # Lower number = higher priority
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'state_transitions'
        indexes = [
            models.Index(fields=['transition_id']),
            models.Index(fields=['from_state']),
            models.Index(fields=['to_state']),
            models.Index(fields=['trigger']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.from_state} -> {self.to_state} ({self.trigger})"


class TransactionStateLog(models.Model):
    """
    Log of transaction state changes
    """
    transaction_id = models.CharField(max_length=100)
    
    # State change details
    from_state = models.CharField(max_length=50)
    to_state = models.CharField(max_length=50)
    trigger = models.CharField(max_length=100, null=True, blank=True)
    
    # Service status
    service_statuses = JSONField(null=True, blank=True)  # Status of each service at this point
    
    # Transition details
    transition = models.ForeignKey(StateTransition, null=True, blank=True, on_delete=models.SET_NULL)
    
    # Timestamps
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'transaction_state_logs'
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['from_state']),
            models.Index(fields=['to_state']),
            models.Index(fields=['timestamp']),
        ]


class TimeoutConfig(models.Model):
    """
    Configuration for transaction timeouts
    """
    config_id = models.CharField(max_length=100, unique=True)
    manager = models.ForeignKey(TransactionStateManager, on_delete=models.CASCADE, related_name='timeout_configs')
    
    # Timeout configuration
    state = models.CharField(max_length=50)  # State to apply timeout to
    timeout_seconds = models.IntegerField()  # Timeout in seconds
    
    # Timeout actions
    actions = JSONField()  # Actions to take on timeout
    
    # Timeout management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'timeout_configs'
        indexes = [
            models.Index(fields=['config_id']),
            models.Index(fields=['state']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.state} - {self.timeout_seconds}s"


class RetryPolicy(models.Model):
    """
    Retry policies for failed transactions
    """
    policy_id = models.CharField(max_length=100, unique=True)
    manager = models.ForeignKey(TransactionStateManager, on_delete=models.CASCADE, related_name='retry_policies')
    
    # Retry configuration
    state = models.CharField(max_length=50)  # State to apply retry to
    max_retries = models.IntegerField()  # Maximum retry attempts
    backoff_strategy = models.CharField(max_length=50)  # e.g., 'fixed', 'exponential'
    initial_delay_seconds = models.IntegerField()  # Initial delay before retry
    
    # Retry management
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'retry_policies'
        indexes = [
            models.Index(fields=['policy_id']),
            models.Index(fields=['state']),
            models.Index(fields=['is_active']),
        ]
        
    def __str__(self):
        return f"{self.state} - {self.max_retries} retries"
