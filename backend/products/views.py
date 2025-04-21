from django.shortcuts import get_object_or_404, render
from products.models import Message, Notification, Profile, User
from django.db.models import Q

# custom imports
from products import serializers as products_serializer
from . import models as products_models

from drf_yasg import openapi # type: ignore
from drf_yasg.utils import swagger_auto_schema # type: ignore


# rest framework imports
from rest_framework import status, serializers # type: ignore
from rest_framework.decorators import APIView# type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework_simplejwt.views import TokenObtainPairView # type: ignore
from rest_framework import generics # type: ignore
from rest_framework.permissions import AllowAny, IsAuthenticated # type: ignore
from rest_framework.pagination import PageNumberPagination # type: ignore
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from django.http import Http404
from rest_framework.exceptions import NotFound, ValidationError # type: ignore

# Create your views here.


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = products_serializer.MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = products_models.User.objects.all()
    serializer_class = products_serializer.RegisterSerializer
    permission_classes = [IsAuthenticated,]

    def create(self, request, *args, **kwargs):
        from rest_framework.decorators import APIView# type: ignore

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = products_serializer.ProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user.profile
    
    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response['Cache-Control'] = 'no-store, max-age=0'
        return response

class PublicProfileView(generics.RetrieveAPIView):
    serializer_class = products_serializer.PublicProfileSerializer
    permission_classes = [AllowAny]
    lookup_field = 'user__username'
    lookup_url_kwarg = 'username'

    def get_queryset(self):
        return Profile.objects.select_related('user').all()

    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            raise NotFound(detail=f"User with username '{self.kwargs['username']}' not found")
    
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


class ProductPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
class ProductsListView(generics.ListAPIView):
    serializer_class = products_serializer.ProductSerializer
    permission_classes = [AllowAny]
    
    # Remove this line to disable pagination
    # pagination_class = ProductPagination
    
    def get_queryset(self):
        return products_models.Product.objects.select_related(
            'profile__user'
        ).prefetch_related(
            'likes'
        ).all()
    
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
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):  # Get product ID from URL
        try:
            product = products_models.Product.objects.get(id=pk)
            user = request.user
            
            if product.likes.filter(id=user.id).exists():
                product.likes.remove(user)
                action = 'disliked'
            else:
                product.likes.add(user)
                action = 'liked'

            return Response({
                "message": f"Product {action} successfully",
                "action": action,
                "likes_count": product.likes.count()
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
    
    def get_serializer_context(self):
        return{'request': self.request}
    
class AddToCartView(APIView):
    permission_classes = [IsAuthenticated,]

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

        return Response(
            products_serializer.CartSerializer(
                cart_item,
                context={'request': request}  # Add this line
            ).data, 
            status=status.HTTP_201_CREATED
        )

    
class UpdateCartView(APIView):
    permission_classes = [IsAuthenticated,]

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
    permission_classes = [IsAuthenticated,]

    def delete(self, request, cart_id):
        cart_item = get_object_or_404(products_models.Cart, id=cart_id, user=request.user)
        cart_item.delete()
        return Response({"message": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT)
    
class OrderListView(generics.ListCreateAPIView):
    serializer_class = products_serializer.OrderSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return products_models.Order.objects.filter(user=self.request.user)

class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = products_serializer.OrderSerializer
    permission_classes = [IsAuthenticated,]

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

    def get_queryset(self):
        return products_models.Wishlist.objects.filter(user=self.request.user)
    

class WishlistCreateView(generics.CreateAPIView):
    serializer_class = products_serializer.WishlistSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        product = get_object_or_404(products_models.Product, id=self.kwargs['pk'])
        # Check for existing wishlist item
        if products_models.Wishlist.objects.filter(user=self.request.user, product=product).exists():
            raise ValidationError({"detail": "Product is already in your wishlist."})
        serializer.save(user=self.request.user, product=product)

    def handle_exception(self, exc):
        if isinstance(exc, ValidationError):
            return Response(exc.detail, status=status.HTTP_400_BAD_REQUEST)
        return super().handle_exception(exc)


class WishlistDetailView(generics.DestroyAPIView):
    serializer_class = products_serializer.WishlistSerializer
    permission_classes = [IsAuthenticated,]

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
        

class MessageViewSet(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = products_serializer.MessageSerializer

    def perform_create(self, serializer):
        recipient_username = self.request.data.get('recipient')
        try:
            recipient = User.objects.get(username=recipient_username)
            message = serializer.save(sender=self.request.user, recipient=recipient)
            
            # Create notification for recipient
            Notification.objects.create(
                user=recipient,
                message=message,
                viewed=False
            )
        except User.DoesNotExist:
            raise products_serializer.serializers.ValidationError({
                "recipient": f"User with username {recipient_username} does not exist"
            })


class CreateMessageView(generics.CreateAPIView):
    serializer_class = products_serializer.MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class NotificationViewSet(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = products_serializer.NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)