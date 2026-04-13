"""HARVESTIA - Marketplace Serializers"""
from rest_framework import serializers
from .models import Product, ProductCategory, Order, OrderItem


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = ProductCategory
        fields = ['id', 'name', 'slug', 'icon']


class ProductSerializer(serializers.ModelSerializer):
    category_name    = serializers.SerializerMethodField()
    discount_percent = serializers.ReadOnlyField()

    class Meta:
        model  = Product
        fields = [
            'id', 'category', 'category_name', 'brand', 'name',
            'description', 'price', 'sale_price', 'discount_percent',
            'rating', 'review_count', 'badge', 'emoji',
            'specs', 'hp', 'max_speed', 'capacity_kg',
            'is_active', 'stock', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_category_name(self, obj):
        return obj.category.name


class OrderItemSerializer(serializers.ModelSerializer):
    product_name  = serializers.SerializerMethodField()
    product_brand = serializers.SerializerMethodField()
    product_emoji = serializers.SerializerMethodField()

    class Meta:
        model  = OrderItem
        fields = ['id', 'product', 'product_name', 'product_brand', 'product_emoji',
                  'quantity', 'unit_price', 'total_price']

    def get_product_name(self, obj):  return obj.product.name
    def get_product_brand(self, obj): return obj.product.brand
    def get_product_emoji(self, obj): return obj.product.emoji


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model  = Order
        fields = [
            'id', 'status', 'total_amount',
            'delivery_name', 'delivery_phone', 'delivery_address',
            'delivery_district', 'delivery_state', 'delivery_pincode',
            'payment_method', 'notes', 'items',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CreateOrderSerializer(serializers.Serializer):
    """For creating a new order with items"""
    items = serializers.ListField(child=serializers.DictField())
    delivery_name    = serializers.CharField()
    delivery_phone   = serializers.CharField()
    delivery_address = serializers.CharField()
    delivery_district= serializers.CharField()
    delivery_state   = serializers.CharField()
    delivery_pincode = serializers.CharField()
    payment_method   = serializers.CharField(default='cod')
    notes            = serializers.CharField(required=False, allow_blank=True)
