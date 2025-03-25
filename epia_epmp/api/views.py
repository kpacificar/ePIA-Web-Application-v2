from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, NoteSerializer, UserCompanySerializer, CompanySerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note, UserCompany, Company
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle, ScopedRateThrottle
from django.core.cache import cache
from django.utils import timezone
import datetime
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]  # Fixed typo in permission_classes

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]  # Fixed typo in permission_classes

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User registered successfully",
                "user": UserSerializer(user, context=self.get_serializer_context()).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserCompanyView(generics.RetrieveUpdateAPIView):
    serializer_class = UserCompanySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return UserCompany.objects.get(user=self.request.user)


class LoginRateThrottle(ScopedRateThrottle):
    scope = 'login'

class EmailTokenObtainPairView(APIView):
    """
    Custom view for obtaining JWT tokens using email instead of username
    """
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {"detail": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get client IP address
        ip_address = self.get_client_ip(request)
        
        # Check if IP is blocked
        is_blocked, remaining_seconds = self.is_ip_blocked(ip_address)
        if is_blocked:
            return Response(
                {
                    "detail": "Your IP has been temporarily blocked due to too many failed login attempts.",
                    "remaining_seconds": remaining_seconds
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        # Analyze request for suspicious patterns
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        is_suspicious = self.check_suspicious_activity(email, ip_address, user_agent)
        
        if is_suspicious:
            # Log the suspicious activity
            self.log_suspicious_activity(email, ip_address, user_agent)
            # You might want to send notifications to admins here
            
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Record failed attempt
            self.record_failed_attempt(ip_address)
            return Response(
                {"detail": "No user found with this email address."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        if not user.check_password(password):
            # Record failed attempt
            self.record_failed_attempt(ip_address)
            return Response(
                {"detail": "Invalid password."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Reset failed attempts on successful login
        self.reset_failed_attempts(ip_address)
        
        # Store successful login IP and time
        self.record_successful_login(user, ip_address, user_agent)
            
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def record_failed_attempt(self, ip_address):
        """Record a failed login attempt from an IP address"""
        cache_key = f"failed_login_{ip_address}"
        failed_attempts = cache.get(cache_key, 0)
        failed_attempts += 1
        
        # Block for 60 seconds after 5 failed attempts (changed from 15 minutes)
        if failed_attempts >= 5:
            block_until = timezone.now() + datetime.timedelta(seconds=60)
            cache.set(f"ip_blocked_{ip_address}", block_until, timeout=60)
        
        # Store failed attempts for 1 hour
        cache.set(cache_key, failed_attempts, timeout=60)
    
    def reset_failed_attempts(self, ip_address):
        """Reset failed login attempts after successful login"""
        cache_key = f"failed_login_{ip_address}"
        cache.delete(cache_key)
    
    def is_ip_blocked(self, ip_address):
        """Check if an IP address is blocked and return remaining seconds"""
        cache_key = f"ip_blocked_{ip_address}"
        block_until = cache.get(cache_key)
        
        if block_until and timezone.now() < block_until:
            # Calculate remaining seconds
            remaining_seconds = int((block_until - timezone.now()).total_seconds())
            return True, remaining_seconds
        
        return False, 0

    def check_suspicious_activity(self, email, ip_address, user_agent):
        """Check for suspicious login activity"""
        is_suspicious = False
        
        # Check for login attempts from unusual locations
        try:
            user = User.objects.get(email=email)
            last_login_ip = cache.get(f"last_login_ip_{user.id}")
            
            if last_login_ip and last_login_ip != ip_address:
                # This is a login from a different IP than the last successful login
                # In a production environment, you'd use a geolocation service here
                is_suspicious = True
                
            # Check if this IP has been trying multiple different accounts
            ip_email_attempts = cache.get(f"ip_email_attempts_{ip_address}", [])
            if email not in ip_email_attempts:
                ip_email_attempts.append(email)
                if len(ip_email_attempts) >= 3:  # If same IP tries 3+ different emails
                    is_suspicious = True
                cache.set(f"ip_email_attempts_{ip_address}", ip_email_attempts, timeout=60*60*24)
                
        except User.DoesNotExist:
            pass
            
        return is_suspicious
    
    def log_suspicious_activity(self, email, ip_address, user_agent):
        """Log suspicious login activity for further investigation"""
        timestamp = timezone.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] Suspicious login attempt - Email: {email}, IP: {ip_address}, UA: {user_agent}"
        
        # In a production environment, you'd log this to a database or external service
        print(log_entry)  # For development
        
        # Optionally send alert email to administrators
        if hasattr(settings, 'ADMIN_EMAIL') and settings.ADMIN_EMAIL:
            try:
                send_mail(
                    'Suspicious Login Alert',
                    log_entry,
                    'security@yourdomain.com',
                    [settings.ADMIN_EMAIL],
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Failed to send alert email: {e}")
    
    def record_successful_login(self, user, ip_address, user_agent):
        """Record successful login details for future reference"""
        # Store the IP for comparison with future logins
        cache.set(f"last_login_ip_{user.id}", ip_address, timeout=60*60*24*30)  # 30 days
        
        # Store login time and user agent
        login_time = timezone.now()
        cache.set(f"last_login_time_{user.id}", login_time, timeout=60*60*24*30)
        cache.set(f"last_login_ua_{user.id}", user_agent, timeout=60*60*24*30)

def custom_exception_handler(exc, context):
    """
    Custom exception handler for better error messages on throttling
    """
    from rest_framework.views import exception_handler
    from rest_framework.exceptions import Throttled
    
    response = exception_handler(exc, context)
    
    if isinstance(exc, Throttled):
        wait_time = getattr(exc, 'wait', None)
        if wait_time:
            error_message = f'Too many attempts. Please try again in {wait_time} seconds.'
            # Include the remaining seconds in the response for frontend to use
            response.data = {
                'detail': error_message,
                'remaining_seconds': int(wait_time)
            }
        else:
            error_message = 'Too many attempts. Please try again later.'
            response.data = {
                'detail': error_message
            }
        
    return response

# Simple endpoint to reset rate limiting
@csrf_exempt
def reset_rate_limits(request):
    """Reset rate limiting for development purposes only"""
    # Only available in DEBUG mode for security
    if not settings.DEBUG:
        return JsonResponse({"error": "This endpoint is only available in debug mode"}, status=403)
        
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)
        
    # Get client IP address
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
        
    # Clear rate limiting for this IP
    cache.delete(f"failed_login_{ip}")
    cache.delete(f"ip_blocked_{ip}")
    cache.delete(f"ip_email_attempts_{ip}")
    
    # Clear throttling cache keys - note that in default Django memory cache,
    # we can't easily get all keys, so we'll clear common throttle patterns
    throttle_patterns = [
        f"throttle_anon_{ip}",
        f"throttle_user_{ip}",
        f"throttle_login_{ip}",
    ]
    
    for key in throttle_patterns:
        cache.delete(key)
        
    return JsonResponse({
        "success": True,
        "message": f"Rate limiting reset for IP: {ip}",
    })

# Simple status endpoint
@csrf_exempt
def check_status(request):
    """Check server status and rate limiting"""
    # Get client IP address
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
        
    # Check if IP is rate limited
    is_blocked = cache.get(f"ip_blocked_{ip}")
    failed_attempts = cache.get(f"failed_login_{ip}", 0)
    
    if is_blocked:
        remaining_seconds = int((is_blocked - timezone.now()).total_seconds())
        if remaining_seconds > 0:
            return JsonResponse({
                "status": "rate_limited",
                "message": f"Rate limited for {remaining_seconds} more seconds",
                "remaining_seconds": remaining_seconds
            })
    
    # Check if any throttling is active
    for throttle_type in ["anon", "user", "login"]:
        key = f"throttle_{throttle_type}_{ip}"
        if cache.get(key):
            return JsonResponse({
                "status": "throttled",
                "message": f"Throttled ({throttle_type})",
                "throttle_type": throttle_type
            })
    
    return JsonResponse({
        "status": "ok",
        "message": "Server is running normally",
        "failed_attempts": failed_attempts
    })
