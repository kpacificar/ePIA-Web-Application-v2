from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, EmailTokenObtainPairView, dev_reset_rate_limits
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
import uuid
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name="register"),
    path("api/token/", EmailTokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
]

# Development only URLs
if settings.DEBUG:
    # Generate a random URL path for the dev reset endpoint each time the server starts
    DEV_RESET_URL = f"_internal/dev/{uuid.uuid4().hex[:16]}/reset/"
    
    # Store the URL in settings for reference
    settings.DEV_RESET_URL = DEV_RESET_URL
    
    if os.environ.get('RUN_MAIN') != 'true':  # Only print once when Django restarts
        print(f"\nDeveloper reset URL: {DEV_RESET_URL}\n")
    
    urlpatterns += [
        path(DEV_RESET_URL, dev_reset_rate_limits, name="dev_reset_rate_limits"),
    ]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
