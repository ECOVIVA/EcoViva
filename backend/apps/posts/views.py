from rest_framework.views import APIView

"""
    Arquivo responsável pela lógica por trás de cada requisição HTTP, retornando a resposta adequada.

    Este arquivo contém as views de 'Posts', que processam as requisições feitas aos endpoints
    específicos da API. As views gerenciam a interação entre a aplicação e o usuário, manipulando dados e retornando 
    as respostas no formato apropriado, como JSON, para as requisições da API.
"""

class ThreadListView(APIView):
    def get(self, request):
        ...

class ThreadCreateView(APIView):
    def post(self, request):
        ...

class ThreadDetailView(APIView):
    def get(self, request, slug):
        ...

class PostListView(APIView):
    def get(self, request):
        ...

class PostCreateView(APIView):
    def post(self, request):
        ...

class PostUpdateView(APIView):
    def patch(self, request):
        ...

class PostDeleteView(APIView):
    def delete(self, request):
        ...