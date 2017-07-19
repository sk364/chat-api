from django.conf.urls import url

from .views import MessageAPIView, UserAPIView

messages = MessageAPIView.as_view()
users = UserAPIView.as_view()

urlpatterns = [
    url(r'^users/$', users),
    url(r'^messages/$', messages),
    url(r'^messages/(?P<username>.*)/$', messages)
]
