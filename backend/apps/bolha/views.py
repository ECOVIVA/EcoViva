from rest_framework.views import APIView

"""
    Arquivo responsável pela lógica por trás de cada requisição HTTP, retornando a resposta adequada.

    Este arquivo contém as views da aplicação 'Bubble', que processam as requisições feitas aos endpoints
    específicos da API. As views gerenciam a interação entre a aplicação e o usuário, manipulando dados e retornando 
    as respostas no formato apropriado, como JSON, para as requisições da API.
"""

class BubbleView(APIView):
    def get(self, request):
        ...

class CheckInView(APIView):
    def get(self, request):
        ...

    def post(self, request):
        ...

class CheckInDetailView(APIView):
    def get(self,request):
        ...

    def patch(self, request):
        ...