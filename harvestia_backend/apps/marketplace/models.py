"""
HARVESTIA - Marketplace Models
Equipment Store: Tractors, Harvesters, Seeds, Tippers, Tools
"""
from django.db import models
import uuid


class ProductCategory(models.Model):
    name        = models.CharField(max_length=50)
    slug        = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon        = models.CharField(max_length=10, blank=True)

    class Meta:
        db_table  = 'product_categories'
        verbose_name_plural = 'Product Categories'

    def __str__(self):
        return self.name


class Product(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category    = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='products')
    brand       = models.CharField(max_length=100)
    name        = models.CharField(max_length=200)
    description = models.TextField()
    price       = models.DecimalField(max_digits=12, decimal_places=2)
    sale_price  = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    rating      = models.FloatField(default=4.0)
    review_count= models.IntegerField(default=0)
    badge       = models.CharField(max_length=30, blank=True)  # BESTSELLER, SALE, NEW, etc.
    emoji       = models.CharField(max_length=5, default='📦')

    # Specs stored as JSON
    specs       = models.JSONField(default=dict)

    # Technical specs
    hp          = models.IntegerField(null=True, blank=True)
    max_speed   = models.IntegerField(null=True, blank=True, help_text='km/h')
    capacity_kg = models.IntegerField(null=True, blank=True)

    is_active   = models.BooleanField(default=True)
    stock       = models.IntegerField(default=10)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'marketplace_products'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.brand} {self.name}"

    @property
    def discount_percent(self):
        if self.sale_price and self.price:
            return round((1 - float(self.sale_price) / float(self.price)) * 100)
        return 0


class Order(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user        = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='orders')

    STATUS_CHOICES = [
        ('pending',    'Pending Payment'),
        ('confirmed',  'Order Confirmed'),
        ('processing', 'Processing'),
        ('shipped',    'Shipped'),
        ('delivered',  'Delivered'),
        ('cancelled',  'Cancelled'),
        ('refunded',   'Refunded'),
    ]
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount= models.DecimalField(max_digits=14, decimal_places=2)

    # Delivery address
    delivery_name    = models.CharField(max_length=200)
    delivery_phone   = models.CharField(max_length=20)
    delivery_address = models.TextField()
    delivery_district= models.CharField(max_length=100)
    delivery_state   = models.CharField(max_length=100)
    delivery_pincode = models.CharField(max_length=10)

    payment_method   = models.CharField(max_length=50, blank=True)
    payment_id       = models.CharField(max_length=200, blank=True)
    notes            = models.TextField(blank=True)

    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'marketplace_orders'
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{str(self.id)[:8]} — {self.user.full_name}"


class OrderItem(models.Model):
    order       = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product     = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='order_items')
    quantity    = models.IntegerField(default=1)
    unit_price  = models.DecimalField(max_digits=12, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        db_table = 'marketplace_order_items'
