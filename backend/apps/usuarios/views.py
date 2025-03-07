from rest_framework.views import APIView

"""
    Arquivo responsável pela lógica por trás de cada requisição HTTP, retornando a resposta adequada.

    Este arquivo contém as views de 'Users', que processam as requisições feitas aos endpoints
    específicos da API. As views gerenciam a interação entre a aplicação e o usuário, manipulando dados e retornando 
    as respostas no formato apropriado, como JSON, para as requisições da API.
"""

class UserView(APIView):
    def get(self, request):
        ...

    def post(self, request):
        ...

class UserDetailView(APIView):
    def get(self, request, username):
        ...

    def patch(self, request, username):
        ...

    def delete(self, request, username):
        ...