from rest_framework.views import APIView

"""
    Arquivo responsável pela lógica por trás de cada requisição HTTP, retornando a resposta adequada.

    Este arquivo contém as views de 'Posts', que processam as requisições feitas aos endpoints
    específicos da API. As views gerenciam a interação entre a aplicação e o usuário, manipulando dados e retornando 
    as respostas no formato apropriado, como JSON, para as requisições da API.
"""

class PostView(APIView):
    def get(self, request):
        ...

    def post(self, request):
        ...

class PostDetailView(APIView):
    def get(self, request):
        ...

    def patch(self, request):
        ...

    def delete(self, request):
        ...