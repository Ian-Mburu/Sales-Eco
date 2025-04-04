from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # type: ignore
from rest_framework import serializers # type: ignore
from django.contrib.auth.password_validation import validate_password
from . import models as products_models
from django.db.models import Avg, Count


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(cls, user):
        token = super().get_token(user)
        # custom claims
        token['full_name'] = user.full_name
        token['email'] = user.email
        token['username'] = user.username
        return token
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = products_models.User
        fields = ('email', 'full_name', 'password', 'password2')

    def validate(self, attr):
        if attr['password'] != attr['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        return attr
    
    def create(self, validated_data):
        user = products_models.User.objects.create(
            full_name=validated_data['full_name'],
            email=validated_data['email']
        )

        email_username, mobile = user.email.split('@')
        user.username = email_username

        user.set_password(validated_data['password'])
        user.save()

        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = products_models.User
        fields = ('__all__')

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    full_name = serializers.CharField(source='user.full_name')

    bio = serializers.CharField(required=False, allow_blank=True)
    county = serializers.CharField(required=False, allow_blank=True)
    facebook = serializers.URLField(required=False, allow_blank=True)
    twitter = serializers.URLField(required=False, allow_blank=True)

    class Meta:
        model = products_models.Profile
        fields = [
            'username', 'email', 'full_name', 'image', 
            'bio', 'county', 'facebook', 'twitter', 'date'
        ]

    def update(self, instance, validated_data):
        # Explicitly handle empty values
        for attr, value in validated_data.items():
            if value == '':  # Treat empty strings as null
                setattr(instance, attr, None)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance

class PublicProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    join_date = serializers.DateTimeField(source='user.date_joined')
    email = serializers.EmailField(source='user.email')
    full_name = serializers.CharField(source='user.full_name')
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()
    recent_products = serializers.SerializerMethodField()

    class Meta:
        model = products_models.Profile
        fields = [
            'username', 'email', 'full_name', 'image', 
            'bio', 'county', 'facebook', 'twitter', 
            'date', 'join_date', 'average_rating', 'total_reviews', 'recent_products'
        ]
        
    def get_average_rating(self, obj):
        return obj.user.products.aggregate(Avg('reviews__rating'))['reviews__rating__avg'] or 0

    def get_total_reviews(self, obj):
        return obj.user.products.aggregate(Count('reviews'))['reviews__count']

    def get_recent_products(self, obj):
        products = obj.user.products.order_by('-date')[:3]
        return ProductSerializer(products, many=True, context=self.context).data

class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()

    def get_post_count(self, category):
        return category.products.count()

    class Meta:
        model = products_models.Category
        fields = ('id', 'name', 'slug', 'post_count')

class ProductSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    has_liked = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    seller = ProfileSerializer(source='profile', read_only=True)  # Include seller profile
    date_posted = serializers.DateTimeField(format="%Y-%m-%d %H:%M", source='date')  # Format date

    class Meta:
        model = products_models.Product
        fields = ['id', 'title', 'image', 'description', 
                  'price', 'likes', 'quantity', 
                  'slug', 'date_posted', 'likes_count', 
                  'has_liked', 'views', 'seller']
        depth = 1

        
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False
    
    def get_image(self, product):
        request = self.context.get('request')
        if product.image:
            return request.build_absolute_uri(product.image.url)
        return None

    def get_seller(self, obj):
        return {
            'username': obj.profile.user.username,
            'image': self.context['request'].build_absolute_uri(obj.profile.image.url) if obj.profile.image else None
        }

class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  # Add nested product serializer
    product_image = serializers.SerializerMethodField()
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = products_models.Cart
        fields = ['id', 'product', 'product_image', 'quantity', 'total_price']

    def get_product_image(self, obj):
        request = self.context.get('request')
        if obj.product.image:
            return request.build_absolute_uri(obj.product.image.url)
        return None

    
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = products_models.Order
        fields = ('__all__')

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = products_models.OrderItem
        fields = ('__all__')

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = products_models.Payment
        fields = ('__all__')

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = products_models.Review
        fields = ['id', 'user', 'product', 'rating', 'comment', 'date']
        extra_kwargs = {
            'product': {'required': True},
            'rating': {'required': True}
        }

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value


class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = products_models.Wishlist
        fields = ['id', 'user', 'product', 'date']
        read_only_fields = ['user', 'date']
        depth = 1

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = products_models.Contact
        fields = ('__all__')

from .models import Message, User  # Add this import

# serializers.py
class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)
    recipient = serializers.SlugRelatedField(
        slug_field='username',
        queryset=User.objects.all()
    )

    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'timestamp', 'read', 
                 'sender_username', 'recipient_username']
        read_only_fields = ['sender', 'timestamp', 'read']

    def validate_recipient(self, value):
        if not User.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Recipient does not exist")
        return value

class NotificationSerializer(serializers.ModelSerializer):
    message_content = serializers.CharField(source='message.content')
    sender_username = serializers.CharField(source='message.sender.username')
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    message_id = serializers.IntegerField(source='message.id')

    class Meta:
        model = products_models.Notification
        fields = ['id', 'message_content', 'sender_username', 
                 'created_at', 'viewed', 'message_id']