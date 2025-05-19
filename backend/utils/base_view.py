class BaseAPIView(GenericAPIView):
    queryset = None
    serializer_class = None
    lookup_field = 'slug'  # ou 'pk' ou outro campo
    model = None
    not_found_message = "Objeto não encontrado!"

    def get_queryset(self):
        if self.queryset is not None:
            return self.queryset
        if self.model is not None:
            return self.model.objects.all()
        raise NotImplementedError("Você deve definir queryset ou model.")

    def get_object(self):
        lookup_value = self.kwargs.get(self.lookup_field)
        try:
            return self.get_queryset().get(**{self.lookup_field: lookup_value})
        except self.model.DoesNotExist:
            raise NotFound(self.not_found_message)