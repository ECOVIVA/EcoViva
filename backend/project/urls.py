from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from django.conf.urls.static import static


urlpatterns = [

    #URL da pagina de administrativa
    path('admin/', admin.site.urls),

    # URLs da API
    #
    # Estas são as rotas principais da API:
    # 
    # - api/posts/: Endpoints para gerenciar os posts.
    # - api/users/: Endpoints para gerenciar os usuários.
    # 
    # Cada aplicação tem suas próprias rotas, organizadas aqui.

    path('api/posts/', include("apps.posts.urls")),
    path('api/users/', include("apps.usuarios.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
