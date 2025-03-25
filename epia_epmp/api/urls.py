from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("register/", views.CreateUserView.as_view(), name="api-register"),
    path("profile/", views.UserCompanyView.as_view(), name="user-company"),
    path("reset-rate-limits/", views.reset_rate_limits, name="reset-rate-limits"),
    path("status/", views.check_status, name="check-status"),
]