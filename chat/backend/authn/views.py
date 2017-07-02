# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.contrib.auth.models import User
from django.http import Http404
from django.shortcuts import get_object_or_404
from oauth2client import client, crypt

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_jwt.settings import api_settings


jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

CLIENT_IDS = settings.CLIENT_IDS
ISSUERS = settings.ISSUERS
G_SUITE_DOMAINS = settings.G_SUITE_DOMAINS
MIN_PASSWORD_LENGTH = settings.MIN_PASSWORD_LENGTH


class LoginView(APIView):
    permission_classes = (AllowAny, )
    authentication_classes = ()

    def create_user(self, email, name):
        """
        Creates a new User
        params:
            - email : email of the user
            - name : name is a string containing first
                     and last name separated by a space
        """

        # check if it is the first time for the user
        try:
            _user = get_object_or_404(User, email=email)

            return (_user, False)
        except Http404:
            pass

        first_name, last_name = '', ''
        name_list = name.split(' ')

        if len(name) == 2:
            first_name, last_name = name

        user = User.objects.create(
            username=email, email=email, first_name=first_name,
            last_name=last_name
        )

        return (user, True)

    def post(self, request, format=None):
        """
        Verifies and creates user using the info generated using `id_token`
        Accepts id_token as a single parameter in POST request.
        """

        id_token = request.data.get('id_token', None)

        if id_token:
            try:
                idinfo = client.verify_id_token(id_token, None)

                if idinfo['aud'] not in CLIENT_IDS:
                    raise crypt.AppIdentityError("Unrecognized client.")

                if idinfo['iss'] not in ISSUERS:
                    raise crypt.AppIdentityError("Wrong issuer.")

                if idinfo['hd'] not in G_SUITE_DOMAINS:
                    raise crypt.AppIdentityError("Unlisted domain.")

                if idinfo['email_verified']:
                    email = idinfo['email']
                    name = idinfo['name']

                    user, first_time = self.create_user(email, name)

                    # create jwt
                    payload = jwt_payload_handler(user)
                    token = jwt_encode_handler(payload)

                    return Response({
                        'token' : token,
                        'username' : user.username,
                        'first_time' : first_time
                    })

                else:
                    raise crypt.AppIdentityError("Unverified Email.")
            except crypt.AppIdentityError, e:
                return Response({
                    "errors" : str(e)
                })
        else:
            return Response({
                'errors' : 'id_token missing'
            })

class ChangePasswordView(APIView):
    """
    View to change the password of the authenticated user
    Accepts POST data containing password and confirm password fields
    """

    permission_classes = (IsAuthenticated, )
    authentication_classes = (JSONWebTokenAuthentication, )

    def put(self, request, format=None):
        password = request.data.get('password', None)
        confirm_password = request.data.get('cpassword', None)

        if not password or not confirm_password:
            return Response({
                'errors' : 'Password Field cannot be blank.'
            });

        if password != confirm_password:
            return Response({
                'errors' : 'Passwords do not match.'
            })

        if len(password) < MIN_PASSWORD_LENGTH:
            return Response({
                'errors' : 'Password length should be greater than 8 characters.'
            })

        user = request.user

        user.set_password(password)
        user.save()

        return Response({
            'username' : user.username
        })

class ChangeUsernameView(APIView):
    """
    View to update the authenticated user's username
    Accepts POST request containing username as a string
    """

    permission_classes = (IsAuthenticated, )
    authentication_classes = (JSONWebTokenAuthentication, )

    def is_unique(self, username):
        """
        Returns true if username is unique, else false.
        """

        try:
            user = get_object_or_404(User, username=username)
            return False

        except Http404:
            return True

    def put(self, request, format=None):
        username = request.data.get('username', None)

        if not username:
            return Response({
                'errors' : 'Username Field cannot be blank.'
            })

        if not self.is_unique(username):
            return Response({
                'errors' : 'Username already exists.'
            })

        user = request.user

        user.username = username
        user.save()

        return Response({
            'username' : user.username
        })

google_login = LoginView.as_view()
change_password = ChangePasswordView.as_view()
change_username = ChangeUsernameView.as_view()