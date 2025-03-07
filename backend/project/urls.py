from django.contrib import admin
from django.urls import path, include

urlpatterns = [

    #URL da pagina de administrativa
    path('admin/', admin.site.urls),

    # URLs da API
    #
    # Estas são as rotas principais da API:
    # 
    # - api/bubble/: Endpoints da aplicação 'bubble'.
    # - api/posts/: Endpoints para gerenciar os posts.
    # - api/users/: Endpoints para gerenciar os usuários.
    # 
    # Cada aplicação tem suas próprias rotas, organizadas aqui.

    path('api/bubble/', include("apps.bolha.urls")),
    path('api/posts/', include("apps.posts.urls")),
    path('api/users/', include("apps.usuarios.urls")),
]
