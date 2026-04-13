"""HARVESTIA - Marketplace Views"""
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db import transaction

from .models import Product, ProductCategory, Order, OrderItem
from .serializers import (
    ProductSerializer, ProductCategorySerializer,
    OrderSerializer, CreateOrderSerializer,
)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/v1/marketplace/products/         - list all products
    GET /api/v1/marketplace/products/{id}/    - product detail
    GET /api/v1/marketplace/products/featured/ - badge products
    """
    serializer_class   = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends    = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields   = ['category__slug', 'badge', 'is_active']
    search_fields      = ['name', 'brand', 'description']
    ordering_fields    = ['price', 'rating', 'review_count', 'created_at']
    ordering           = ['-review_count']

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related('category')

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """GET /api/v1/marketplace/products/featured/ — on-sale or bestsellers"""
        qs = self.get_queryset().filter(badge__in=['BESTSELLER', 'SALE', 'TOP RATED'])
        return Response(ProductSerializer(qs[:12], many=True).data)

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """GET /api/v1/marketplace/products/categories/"""
        cats = ProductCategory.objects.all()
        return Response(ProductCategorySerializer(cats, many=True).data)


class OrderViewSet(viewsets.ModelViewSet):
    """
    GET  /api/v1/marketplace/orders/         - list user's orders
    POST /api/v1/marketplace/orders/         - place new order
    GET  /api/v1/marketplace/orders/{id}/    - order detail
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends    = [DjangoFilterBackend, OrderingFilter]
    filterset_fields   = ['status']
    ordering           = ['-created_at']

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Calculate totals and validate items
        total = 0
        order_items = []
        for item_data in data['items']:
            product_id = item_data.get('product_id')
            qty        = int(item_data.get('quantity', 1))
            try:
                product = Product.objects.get(id=product_id, is_active=True)
            except Product.DoesNotExist:
                return Response({'error': f'Product {product_id} not found.'}, status=400)
            unit_price  = float(product.sale_price or product.price)
            total_price = unit_price * qty
            total      += total_price
            order_items.append((product, qty, unit_price, total_price))

        # Create order
        order = Order.objects.create(
            user=request.user,
            total_amount=total,
            delivery_name=data['delivery_name'],
            delivery_phone=data['delivery_phone'],
            delivery_address=data['delivery_address'],
            delivery_district=data['delivery_district'],
            delivery_state=data['delivery_state'],
            delivery_pincode=data['delivery_pincode'],
            payment_method=data.get('payment_method', 'cod'),
            notes=data.get('notes', ''),
            status='confirmed',
        )

        # Create order items
        for product, qty, unit_price, total_price in order_items:
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=qty,
                unit_price=unit_price,
                total_price=total_price,
            )

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status in ['shipped', 'delivered']:
            return Response({'error': 'Cannot cancel shipped/delivered orders.'}, status=400)
        order.status = 'cancelled'
        order.save(update_fields=['status'])
        return Response({'status': 'cancelled'})
