from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token
from .views import google_login, change_password, change_username

    
urlpatterns = [
    url(r'^glogin/$', google_login),
    url(r'^login/$', obtain_jwt_token),
    url(r'^change_password/$', change_password),
    url(r'^change_username/$', change_username),
]