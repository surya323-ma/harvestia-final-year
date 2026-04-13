from django.contrib import admin
from .models import Product, ProductCategory, Order, OrderItem

@admin.register(ProductCategory)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'icon']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display  = ['name', 'brand', 'category', 'price', 'sale_price', 'badge', 'is_active', 'stock']
    list_filter   = ['category', 'badge', 'is_active']
    search_fields = ['name', 'brand']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_amount', 'payment_method', 'created_at']
    list_filter  = ['status', 'payment_method']
    inlines      = [OrderItemInline]
