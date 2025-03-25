from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Company, UserCompany, Note

# Customize the User admin interface
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'groups')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)
    
    # Customize the fieldsets for better organization
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

# Company Admin
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)
    ordering = ('name',)

# UserCompany Admin
@admin.register(UserCompany)
class UserCompanyAdmin(admin.ModelAdmin):
    list_display = ('user', 'company', 'get_user_email')
    list_filter = ('company',)
    search_fields = ('user__username', 'user__email', 'company__name')
    ordering = ('user__username',)
    
    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'User Email'

# Note Admin
@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at')
    list_filter = ('created_at', 'author')
    search_fields = ('title', 'content', 'author__username')
    ordering = ('-created_at',)

# Unregister the default User admin and register our custom one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
