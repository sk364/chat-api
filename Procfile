release: cd chat/backend && python manage.py makemigrations main && python manage.py migrate
web: cd chat/backend && gunicorn chat.wsgi
