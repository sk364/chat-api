from django.conf.urls import url

from .views import MessageAPIView, UserAPIView, ConversationsAPIView

messages = MessageAPIView.as_view()
users = UserAPIView.as_view()
conversations = ConversationsAPIView.as_view()

urlpatterns = [
    url(r'^users/$', users),
    url(r'^conversations/$', conversations),
    url(r'^messages/$', messages),
    url(r'^messages/(?P<username>.*)/$', messages),
]
