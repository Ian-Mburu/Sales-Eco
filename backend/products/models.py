from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.utils.text import slugify

# Create your models here.


class User(AbstractUser):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username
#whats happening here is that we are creating a custom user model that inherits from the AbstractUser model
#we are also setting the USERNAME_FIELD to email and the REQUIRED_FIELDS to username
#this is so that we can use the email as the username and the username as a required field
#we are also returning the username as the string representation of the user model
    def save(self, *args, **kwargs):
        email_username, mobile = self.email.split('@')
        if self.username == '' or self.username is None:
            self.username = email_username
        if self.full_name == '' or self.full_name is None:
            self.full_name = self.username

        super(User, self).save(*args, **kwargs)
# If full_name and username are missing, they default to the first part of the user’s email.
# This ensures that every user has a full_name and username derived from their email if not provided.
# The method then calls Django’s built-in save method to store the user in the database.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    image = models.ImageField(upload_to='image', default='default/default-user.jpg', null=True, blank=True)
    full_name = models.CharField(max_length=150, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    county = models.CharField(max_length=150, null=True, blank=True)
    facebook = models.URLField(null=True, blank=True)
    twitter = models.URLField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
    
    def save(self, *args, **kwargs):
        if self.full_name == '' or self.full_name is None:
            self.full_name = self.user.full_name

        super(Profile, self).save(*args, **kwargs)


def create_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)
            print('Profile created!')
    
def save_profile(sender, instance, **kwargs):
        instance.profile.save()
        print('Profile saved!')

post_save.connect(create_profile, sender=User)
post_save.connect(save_profile, sender=User)
# The Profile model has a one-to-one relationship with the User model.
# This means that each user has exactly one profile.

class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('name',) # categories are ordered alphabetically

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if self.slug == '' or self.slug is None:
            self.slug = slugify(self.name)

        super(Category, self).save(*args, **kwargs)
        

class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='image', null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    likes = models.ManyToManyField(User, related_name='post_likes', blank=True)
    views = models.PositiveIntegerField(default=0) 
    quantity = models.PositiveIntegerField(default=0)
    slug = models.SlugField(max_length=150, unique=True, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-date',) # products are ordered by creation date

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if self.slug == '' or self.slug is None:
            self.slug = slugify(self.title)

        super(Product, self).save(*args, **kwargs)

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.title} (Qty: {self.quantity}) - Total: {self.total_price}"

        

class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.product.title} x {self.quantity} - ${self.product.price * self.quantity:.2f}"

        

class OrderItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"OrderItem #{self.id} - {self.product.title} x {self.quantity} - ${self.product.price * self.quantity:.2f}"

        

class Payment(models.Model):
    PAYMENT_METHODS = [
        ("paypal", "PayPal"),
        ("credit_card", "Credit Card"),
        ("mpesa", "M-Pesa"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    transaction_id = models.CharField(max_length=255, unique=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment of ${self.amount:.2f} via {self.payment_method} (Transaction ID: {self.transaction_id})"

    class Meta:
        ordering = ('-timestamp',)


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    comment = models.TextField(blank=True, null=True)
    rating = models.PositiveIntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.rating}/5"
        

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.title}"


class Contact(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name