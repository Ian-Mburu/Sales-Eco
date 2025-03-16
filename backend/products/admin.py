from django.contrib import admin

# Register your models here.
from django.contrib import admin
from products import models as products_models

admin.site.register(products_models.User)
admin.site.register(products_models.Profile)
admin.site.register(products_models.Product)
admin.site.register(products_models.Category)
admin.site.register(products_models.Cart)
admin.site.register(products_models.Order)
admin.site.register(products_models.OrderItem)
admin.site.register(products_models.Payment)
admin.site.register(products_models.Review)
admin.site.register(products_models.Wishlist)
admin.site.register(products_models.Contact)
admin.site.register(products_models.Message)
admin.site.register(products_models.Notification)