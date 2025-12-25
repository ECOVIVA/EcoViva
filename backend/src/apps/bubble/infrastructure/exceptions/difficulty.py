from rest_framework.exceptions import NotFound


class DifficultyNotFoundError(Exception):
    error_msg = "Difficulty not found for the given pk."
    raise NotFound(error_msg)
