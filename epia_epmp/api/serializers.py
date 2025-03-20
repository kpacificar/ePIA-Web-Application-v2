from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Company, UserCompany
from django.contrib.auth.password_validation import validate_password


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["id", "name", "created_at"]


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    company_name = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "password", "password2", "first_name", "last_name", "company_name"]
        extra_kwargs = {
            "password": {"write_only": True},
            "password2": {"write_only": True}
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password2": "Password fields didn't match."})
        
        # Check if email already exists
        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError({"email": "User with this email already exists."})
        
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")  # Remove password2 before user creation
        email = validated_data.pop("email")
        company_name = validated_data.pop("company_name")
        
        # Set username to email since User model requires username
        user = User.objects.create_user(username=email, email=email, **validated_data)
        
        # Create or get company
        company, created = Company.objects.get_or_create(name=company_name)
        
        # Create user profile
        UserCompany.objects.create(user=user, company=company)
        
        return user


class UserCompanySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    company = CompanySerializer(read_only=True)
    
    class Meta:
        model = UserCompany
        fields = ["id", "user", "company"]
        

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}} # We can read the author, But we cant write/edit it
        