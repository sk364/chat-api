from django.db.models import Q
from django.contrib.auth.models import User

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from .models import Message
from .serializers import MessageSerializer, UserSerializer


class MessageAPIView(ListCreateAPIView):
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
            user = User.objects.get(username=username)
            
            return Message.objects.filter(
                (Q(send_by=auth_user) & Q(send_to=user)) |
                (Q(send_by=user) & Q(send_to=auth_user))
            ).order_by('created_at')

        else:
            return Message.objects.filter(Q(send_by=auth_user) | Q(send_to=auth_user)).order_by('created_at')


    def get_serializer_context(self):
        return {'request': self.request}


class UserAPIView(APIView):
    """An API View to get all signed up users"""

    def get(self, request):
        users = User.objects.all()
        user_serializer = UserSerializer(users, many=True)
        response_data = user_serializer.data

        return Response(response_data)


class ConversationsAPIView(APIView):
    """An API View to get all conversations"""

    permission_classes = (IsAuthenticated, )
    authentication_classes = (JSONWebTokenAuthentication, )

    def is_message_in_list(self, message_list, message):
        for msg in message_list:
            if msg.send_by == message.send_by and msg.send_to == message.send_to:
                return True

        return False

    def serialize_messages(self, messages, auth_user):
        serialized_messages = []
        for message in messages:
            message_dict = {
                'created_at': message.created_at,
                'text': message.text,
                'ufile_name': message.ufile.name if message.ufile else None,
            }
            if message.send_by == auth_user:
                message_dict['user'] = message.send_to.username
            else:
                message_dict['user'] = message.send_by.username

            serialized_messages.append(message_dict)

        return serialized_messages

    def get(self, request):
        user = request.user
        messages = Message.objects.filter(Q(send_by=user) | Q(send_to=user)).order_by('-created_at')

        first_messages = []
        for message in messages:
            if not self.is_message_in_list(first_messages, message):
                first_messages.append(message)

        serialized_messages = self.serialize_messages(first_messages, user)
        return Response(serialized_messages)
