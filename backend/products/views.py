from django.shortcuts import get_object_or_404, render

# custom imports
from products import serializers as products_serializer
from . import models as products_models

from drf_yasg import openapi # type: ignore
from drf_yasg.utils import swagger_auto_schema # type: ignore


# rest framework imports
from rest_framework import status # type: ignore
from rest_framework.decorators import APIView# type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework_simplejwt.views import TokenObtainPairView # type: ignore
from rest_framework import generics # type: ignore
from rest_framework.permissions import AllowAny, IsAuthenticated # type: ignore
from rest_framework.pagination import PageNumberPagination # type: ignore
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from django.http import Http404

# Create your views here.


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = products_serializer.MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = products_models.User.objects.all()
    serializer_class = products_serializer.RegisterSerializer
    permission_classes = [AllowAny,]

    def create(self, request, *args, **kwargs):
        print("Received Data:", request.data)  # Debugging
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        print("Errors:", serializer.errors)  # Debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = products_serializer.ProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user.profile

    
class CategoryView(generics.ListAPIView):
    serializer_class = products_serializer.CategorySerializer
    permission_classes = [AllowAny,]

    def get_queryset(self):
        return products_models.Category.objects.all()
    
class CategoryListView(generics.ListAPIView):
    serializer_class = products_serializer.ProductSerializer
    permission_classes = [AllowAny,]

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        category = products_models.Category.objects.get(slug=category_slug)
        return products_models.Product.objects.filter(category=category)

class ProductsListView(generics.ListAPIView):
    # pagination_class = PageNumberPagination
    # page_size = 20
    serializer_class = products_serializer.ProductSerializer
    permission_classes = [AllowAny,]
    queryset = products_models.Product.objects.all()


    
    def get_serializer_context(self):
        return {'request': self.request}
    
class ProductsDetailView(generics.RetrieveAPIView):
    serializer_class = products_serializer.ProductSerializer
    permission_classes = [AllowAny,]

    def get_object(self):
        slug = self.kwargs['slug']
        try:
            products = products_models.Product.objects.get(slug=slug)
            products.views += 1
            products.save()
            return products
        except products_models.Product.DoesNotExist:
            raise Http404('product not found')

class LikeProductAPIView(APIView):
    permission_classes = [AllowAny,]
    
    def post(self, request):
        try:
            products = products_models.Product.objects.get(id=request.data.get('product_id'))
            user = request.user
            if products.likes.filter(id=user.id).exists():
                products.likes.remove(user)
                action = 'disliked'
            else:
                products.likes.add(user)
                action= 'liked'

            return Response({
                    "message": f"Products {action} successfully",
                    "action": action,
                    "likes_count": products.likes.count()
                }, status=status.HTTP_200_OK)
    
        except products_models.Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        
class CartListView(generics.ListAPIView):
    serializer_class = products_serializer.CartSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        user = self.request.user
        print(f"Current user: {user}")  # Debugging: Check if the user is recognized
        return products_models.Cart.objects.filter(user=user)
    
class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        print(f"Adding to cart for user: {user}")  # Debugging

        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        product = get_object_or_404(products_models.Product, id=product_id)

        cart_item, created = products_models.Cart.objects.get_or_create(
            user=user, product=product,
            defaults={'quantity': quantity, 'total_price': product.price * int(quantity)}
        )

        if not created:
            cart_item.quantity += int(quantity)
            cart_item.total_price = cart_item.quantity * product.price
            cart_item.save()

        return Response(products_serializer.CartSerializer(cart_item).data, status=status.HTTP_201_CREATED)

    
class UpdateCartView(APIView):
    permission_classes = [AllowAny,]

    def put(self, request, cart_id):
        cart_item = get_object_or_404(products_models.Cart, id=cart_id, user=request.user)
        quantity = request.data.get('quantity')
        
        if quantity and int(quantity) > 0:
            cart_item.quantity = int(quantity)
            cart_item.save()
            return Response(products_serializer.CartSerializer(cart_item).data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid quantity"}, status=status.HTTP_400_BAD_REQUEST)

class RemoveFromCartView(APIView):
    permission_classes = [AllowAny,]

    def delete(self, request, cart_id):
        cart_item = get_object_or_404(products_models.Cart, id=cart_id, user=request.user)
        cart_item.delete()
        return Response({"message": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT)
    
class OrderListView(generics.ListCreateAPIView):
    serializer_class = products_serializer.OrderSerializer
    permission_classes = [AllowAny,]

    def get_queryset(self):
        return products_models.Order.objects.filter(user=self.request.user)

class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = products_serializer.OrderSerializer
    permission_classes = [AllowAny,]

    def get_object(self):
        try:
            return products_models.Order.objects.get(id=self.kwargs['pk'], user=self.request.user)
        except products_models.Order.DoesNotExist:
            raise Http404('Order not found')


class OrderItemListView(generics.ListCreateAPIView):
    serializer_class = products_serializer.OrderItemSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return products_models.OrderItem.objects.filter(order__user=self.request.user)

class OrderItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = products_serializer.OrderItemSerializer
    permission_classes = [IsAuthenticated,]

    def get_object(self):
        try:
            return products_models.OrderItem.objects.get(id=self.kwargs['pk'], order__user=self.request.user)
        except products_models.OrderItem.DoesNotExist:
            raise Http404('Order item not found')


class PaymentListView(generics.ListCreateAPIView):
    serializer_class = products_serializer.PaymentSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return products_models.Payment.objects.filter(user=self.request.user)

class PaymentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = products_serializer.PaymentSerializer
    permission_classes = [IsAuthenticated,]

    def get_object(self):
        try:
            return products_models.Payment.objects.get(id=self.kwargs['pk'], user=self.request.user)
        except products_models.Payment.DoesNotExist:
            raise Http404('Payment not found')


class ReviewListView(generics.ListCreateAPIView):
    serializer_class = products_serializer.ReviewSerializer
    permission_classes = [IsAuthenticated]  # Changed from AllowAny
    queryset = products_models.Review.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = products_serializer.ReviewSerializer
    permission_classes = [AllowAny,]

    def get_object(self):
        try:
            return products_models.Review.objects.get(id=self.kwargs['pk'])
        except products_models.Review.DoesNotExist:
            raise Http404('Review not found')

# Wishlist Views
class WishlistListView(generics.ListCreateAPIView):
    serializer_class = products_serializer.WishlistSerializer
    permission_classes = [IsAuthenticated] 
    pagination_class = PageNumberPagination

    def get_queryset(self):
        return products_models.Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WishlistDetailView(generics.DestroyAPIView):
    serializer_class = products_serializer.WishlistSerializer
    permission_classes = [AllowAny,]

    def get_object(self):
        try:
            return products_models.Wishlist.objects.get(id=self.kwargs['pk'], user=self.request.user)
        except products_models.Wishlist.DoesNotExist:
            raise Http404('Wishlist item not found')

# Contact Views
class ContactListView(generics.ListCreateAPIView):
    serializer_class = products_serializer.ContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return products_models.Contact.objects.all()

class ContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = products_serializer.ContactSerializer
    permission_classes = [IsAuthenticated,]

    def get_object(self):
        try:
            return products_models.Contact.objects.get(id=self.kwargs['pk'])
        except products_models.Contact.DoesNotExist:
            raise Http404('Contact message not found')