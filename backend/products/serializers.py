from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # type: ignore
from rest_framework import serializers # type: ignore
from django.contrib.auth.password_validation import validate_password
from . import models as products_models


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
    class Meta:
        model = products_models.Profile
        fields = ('__all__')

class CategorySerializer(serializers.ModelSerializer):
    def get_post_count(self, category):
        return category.products.count()

    class Meta:
        model = products_models.Category
        fields = ('id', 'name', 'slug', 'post_count')

class ProductSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    has_liked = serializers.SerializerMethodField()

    class Meta:
        model = products_models.Products
        fields = ('id', 'user', 'profile', 'category',
                    'title', 'image', 'description', 
                    'price', 'likes', 'quantity', 
                    'slug', 'date', 'likes_count', 
                    'has_liked')
        
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False
    
    class Meta:
        model = products_models.Products
        fields = ('__all__')

    def __init__(self, *args, **kwargs):
        super(ProductSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 1

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = products_models.Cart
        fields = ('__all__')
    
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
    class Meta:
        model = products_models.Review
        fields = ('__all__')

class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = products_models.Wishlist
        fields = ('__all__')

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = products_models.Contact
        fields = ('__all__')