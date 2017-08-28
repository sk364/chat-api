release: cd chat/backend && python manage.py collectstatic --noinput && python manage.py migrate
web: cd chat/backend && gunicorn chat.wsgi
