from django.db.models import Q

from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from .models import Message
from .serializers import MessageSerializer


class MessageViewSet(ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated, )
    authentication_classes = (JSONWebTokenAuthentication, )
    queryset = Message.objects.all()

    def get_queryset(self):
        """
        This method should return a queryset of all the messages of the authenticated user, or with another user
        """

        auth_user = self.request.user
        username = self.kwargs.get('username', None)

        if username:
            user = User.objects.filter(username=username).first()
            
            return Message.objects.filter(
                (Q(send_by=auth_user) | Q(send_to=auth_user)) &
                (Q(send_by=user) | Q(send_to=user))
            ).order_by('created_at')

        else:
            return Message.objects.filter(Q(send_by=auth_user) | Q(send_to=auth_user)).order_by('created_at')


    def get_serializer_context(self):
        return {'request': self.request}