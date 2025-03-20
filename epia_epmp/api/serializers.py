from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["id", "email", "password", "password2"]
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
        
        # Set username to email since User model requires username
        user = User.objects.create_user(username=email, email=email, **validated_data)
        return user
    
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}} # We can read the author, But we cant write/edit it
        