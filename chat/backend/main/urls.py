from django.conf.urls import url
from rest_framework import routers

from .views import MessageViewSet, UserAPIView

router = routers.SimpleRouter()
router.register(r'^messages', MessageViewSet)
get_users = UserAPIView.as_view()

urlpatterns = [url(r'^users/$', get_users), ] + router.urls
