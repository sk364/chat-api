from django.contrib.auth.models import User
from django.http import Http404
from django.shortcuts import get_object_or_404

from rest_framework import serializers

from .models import Message


class MessageSerializer(serializers.ModelSerializer):
	send_by = serializers.CharField(required=True, source='send_by.username')
	send_to = serializers.CharField(required=True, source='send_to.username')
	ufile_name = serializers.CharField(required=False, source='ufile.name')

	def validate(self, data):
		try:
			send_by_username = data['send_by']['username']
			_send_by = get_object_or_404(User, username=send_by_username)

			send_to_username = data['send_to']['username']
			_send_to = get_object_or_404(User, username=send_to_username)

		except Http404:
			raise serializers.ValidationError("User doesnt exist!")

		return data

	def create(self, validated_data):
		_send_by = User.objects.get(username = validated_data['send_by']['username'])
		_send_to = User.objects.get(username = validated_data['send_to']['username'])

		_text = validated_data.get('text', '')
		_ufile = validated_data.get('ufile', None)

		message = Message.objects.create(
			send_by = _send_by,
			send_to = _send_to,
			text = _text,
			ufile = _ufile
		)

		message.save()
		return message

	class Meta:
		model = Message
		fields = ('send_by', 'send_to', 'text', 'ufile', 'created_at', 'ufile_name', )
		read_only_fields = ('created_at', 'ufile_name', )