from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from django.conf.urls.static import static

from apps.users.auth.views import LoginView,LogoutView,RefreshView, VerifyView
from apps.users.email.views import EmailConfirmAPIView, ResendConfirmationEmailView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/forum/', include("apps.forum.urls")),
    path('api/users/', include("apps.users.urls")),
    path('api/study/', include("apps.study.urls")),
    path('api/login/', LoginView.as_view(), name="login"),
    path('api/logout/', LogoutView.as_view(), name="logout"),
    path('api/refresh/', RefreshView.as_view(), name="refresh"),
    path('api/verify/', VerifyView.as_view(), name="verify"),
    path('api/confirm-email/<uidb64>/<token>/', EmailConfirmAPIView.as_view(), name='confirm_email'),
    path('api/resend-email/', ResendConfirmationEmailView.as_view(), name='resend_email'),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
