from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, NoteSerializer, UserCompanySerializer, CompanySerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note, UserCompany, Company
from rest_framework_simplejwt.tokens import RefreshToken


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


class EmailTokenObtainPairView(APIView):
    """
    Custom view for obtaining JWT tokens using email instead of username
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {"detail": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "No user found with this email address."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        if not user.check_password(password):
            return Response(
                {"detail": "Invalid password."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
