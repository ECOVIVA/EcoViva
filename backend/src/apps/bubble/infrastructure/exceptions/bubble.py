from rest_framework.exceptions import NotFound


class BubbleNotFoundError(Exception):
    error_msg = "Bubble not found for the given user."
    raise NotFound(error_msg)
