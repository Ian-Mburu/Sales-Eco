from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView # type: ignore
from . import views as products_views

urlpatterns = [
    # Authentication Endpoints
    path('auth/login/', products_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/register/', products_views.RegisterView.as_view(), name='register'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile Endpoints
    path('profile/', products_views.ProfileView.as_view(), name='profile-detail'),

    # Category Endpoints
    path('categories/', products_views.CategoryView.as_view(), name='category-list'),
    path('categories/<slug:category_slug>/', products_views.CategoryListView.as_view(), name='category-products'),

    # Product Endpoints
    path('products/', products_views.ProductsListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', products_views.ProductsDetailView.as_view(), name='product-detail'),
    path('products/like/', products_views.LikeProductAPIView.as_view(), name='like-product'),

    # Cart Endpoints
    path('cart/', products_views.CartListView.as_view(), name='cart-list'),
    path('cart/add/', products_views.AddToCartView.as_view(), name='add-to-cart'),
    path('cart/update/<int:cart_id>/', products_views.UpdateCartView.as_view(), name='update-cart'),
    path('cart/remove/<int:cart_id>/', products_views.RemoveFromCartView.as_view(), name='remove-from-cart'),

    # Order Endpoints
    path('orders/', products_views.OrderListView.as_view(), name='order-list'),
    path('orders/<int:pk>/', products_views.OrderDetailView.as_view(), name='order-detail'),

    # Order Item Endpoints
    path('order-items/', products_views.OrderItemListView.as_view(), name='orderitem-list'),
    path('order-items/<int:pk>/', products_views.OrderItemDetailView.as_view(), name='orderitem-detail'),

    # Payment Endpoints
    path('payments/', products_views.PaymentListView.as_view(), name='payment-list'),
    path('payments/<int:pk>/', products_views.PaymentDetailView.as_view(), name='payment-detail'),

    # Review Endpoints
    path('reviews/', products_views.ReviewListView.as_view(), name='review-list'),
    path('reviews/<int:pk>/', products_views.ReviewDetailView.as_view(), name='review-detail'),

    # Wishlist Endpoints
    path('wishlist/', products_views.WishlistListView.as_view(), name='wishlist-list'),
    path('wishlist/<int:pk>/', products_views.WishlistDetailView.as_view(), name='wishlist-detail'),

    # Contact Endpoints
    path('contact/', products_views.ContactListView.as_view(), name='contact-list'),
    path('contact/<int:pk>/', products_views.ContactDetailView.as_view(), name='contact-detail'),
]