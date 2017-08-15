from django.conf.urls import url

from .views import MessageAPIView, UserAPIView, ConversationsAPIView, UpdateReadStatusAPIView

messages = MessageAPIView.as_view()
users = UserAPIView.as_view()
conversations = ConversationsAPIView.as_view()
update_read_status = UpdateReadStatusAPIView.as_view()

urlpatterns = [
    url(r'^users/$', users),
    url(r'^conversations/$', conversations),
    url(r'^update_read_status/$', update_read_status),
    url(r'^messages/$', messages),
    url(r'^messages/(?P<username>.*)/$', messages),
]
