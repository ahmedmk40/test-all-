from django.db import models
from django.contrib.postgres.fields import JSONField
from django.utils import timezone

class Transaction(models.Model):
    """
    Base transaction model for all transaction types
    """
    TRANSACTION_TYPES = (
        ('acquiring', 'Acquiring'),
        ('wallet', 'Wallet'),
    )
    
    CHANNELS = (
        ('pos', 'Point of Sale'),
        ('ecommerce', 'E-Commerce'),
        ('wallet', 'Digital Wallet'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('flagged', 'Flagged for Review'),
    )
    
    transaction_id = models.CharField(max_length=100, unique=True)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    channel = models.CharField(max_length=20, choices=CHANNELS)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3)
    user_id = models.CharField(max_length=100)
    merchant_id = models.CharField(max_length=100, null=True, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)
    device_id = models.CharField(max_length=100, null=True, blank=True)
    
    # Location data
    country = models.CharField(max_length=2, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    zip_code = models.CharField(max_length=20, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    
    # Payment method
    payment_method_type = models.CharField(max_length=50, null=True, blank=True)
    
    # Status and risk
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    risk_score = models.FloatField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Raw data
    raw_data = JSONField(null=True, blank=True)
    
    class Meta:
        db_table = 'transactions'
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['user_id']),
            models.Index(fields=['merchant_id']),
            models.Index(fields=['timestamp']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.transaction_id} - {self.amount} {self.currency}"


class POSTransaction(models.Model):
    """
    POS Transaction specific details
    """
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='pos_details')
    terminal_id = models.CharField(max_length=100)
    entry_mode = models.CharField(max_length=50)  # chip, swipe, contactless
    terminal_type = models.CharField(max_length=50)
    attendance = models.CharField(max_length=50)  # attended, unattended
    condition = models.CharField(max_length=50)  # card_present, card_not_present
    mcc = models.CharField(max_length=10, null=True, blank=True)
    authorization_code = models.CharField(max_length=100, null=True, blank=True)
    recurring_payment = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'pos_transactions'
        indexes = [
            models.Index(fields=['terminal_id']),
            models.Index(fields=['mcc']),
        ]


class EcommerceTransaction(models.Model):
    """
    E-commerce Transaction specific details
    """
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='ecommerce_details')
    website_url = models.URLField(null=True, blank=True)
    is_3ds_verified = models.BooleanField(default=False)
    device_fingerprint = models.CharField(max_length=255, null=True, blank=True)
    
    # Shipping address
    shipping_street = models.CharField(max_length=255, null=True, blank=True)
    shipping_city = models.CharField(max_length=100, null=True, blank=True)
    shipping_state = models.CharField(max_length=100, null=True, blank=True)
    shipping_postal_code = models.CharField(max_length=20, null=True, blank=True)
    shipping_country = models.CharField(max_length=2, null=True, blank=True)
    
    # Billing address
    billing_street = models.CharField(max_length=255, null=True, blank=True)
    billing_city = models.CharField(max_length=100, null=True, blank=True)
    billing_state = models.CharField(max_length=100, null=True, blank=True)
    billing_postal_code = models.CharField(max_length=20, null=True, blank=True)
    billing_country = models.CharField(max_length=2, null=True, blank=True)
    
    is_billing_shipping_match = models.BooleanField(default=True)
    mcc = models.CharField(max_length=10, null=True, blank=True)
    authorization_code = models.CharField(max_length=100, null=True, blank=True)
    recurring_payment = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'ecommerce_transactions'
        indexes = [
            models.Index(fields=['device_fingerprint']),
            models.Index(fields=['mcc']),
        ]


class WalletTransaction(models.Model):
    """
    Wallet Transaction specific details
    """
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='wallet_details')
    wallet_id = models.CharField(max_length=100)
    wallet_type = models.CharField(max_length=50)
    wallet_provider = models.CharField(max_length=100)
    source_type = models.CharField(max_length=50)
    destination_type = models.CharField(max_length=50)
    source_id = models.CharField(max_length=100)
    destination_id = models.CharField(max_length=100)
    transaction_purpose = models.CharField(max_length=50)
    is_internal = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'wallet_transactions'
        indexes = [
            models.Index(fields=['wallet_id']),
            models.Index(fields=['source_id']),
            models.Index(fields=['destination_id']),
        ]


class PaymentCard(models.Model):
    """
    Payment card information (securely stored)
    """
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='card_details')
    card_hash = models.CharField(max_length=255)  # Securely hashed card number
    last_four = models.CharField(max_length=4)
    expiry_month = models.CharField(max_length=2)
    expiry_year = models.CharField(max_length=4)
    cardholder_name_hash = models.CharField(max_length=255, null=True, blank=True)
    is_new = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'payment_cards'
        indexes = [
            models.Index(fields=['card_hash']),
            models.Index(fields=['last_four']),
        ]


class TransactionResponse(models.Model):
    """
    Transaction response details
    """
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='response_details')
    response_code = models.CharField(max_length=50)
    processor_response_code = models.CharField(max_length=50, null=True, blank=True)
    avs_result = models.CharField(max_length=10, null=True, blank=True)
    cvv_result = models.CharField(max_length=10, null=True, blank=True)
    response_time = models.FloatField(null=True, blank=True)  # in milliseconds
    
    class Meta:
        db_table = 'transaction_responses'
        indexes = [
            models.Index(fields=['response_code']),
        ]


class TransactionMetadata(models.Model):
    """
    Additional transaction metadata
    """
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='metadata')
    customer_email = models.EmailField(null=True, blank=True)
    product_category = models.CharField(max_length=100, null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    additional_data = JSONField(null=True, blank=True)
    
    class Meta:
        db_table = 'transaction_metadata'
