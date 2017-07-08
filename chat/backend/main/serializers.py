from pytz import timezone

from django.contrib.auth.models import User
from django.http import Http404
from django.shortcuts import get_object_or_404

from rest_framework import serializers

from .models import Message
from .utils.constants import IMAGE_EXTENSIONS
from .utils.helpers import get_file_extension


class MessageSerializer(serializers.ModelSerializer):
	"""Serializer class for creating and listing messages"""

	@staticmethod
	def get_ufile_name(obj):
		return obj.ufile.name

	@staticmethod
	def get_is_img(obj):
		file_name = obj.ufile.name

		if file_name:
			file_ext = get_file_extension(file_name)

			is_img = False
			if file_ext in IMAGE_EXTENSIONS:
				is_img = True

			return is_img

	def get_is_received(self, obj):
		_send_by = obj.send_by
		auth_username = self.context['request'].user.username

		if _send_by == auth_username:
			return True

		return False

	@staticmethod
	def get_created_at(obj):
		_created_at = obj.created_at
		created_at_in_ist = _created_at.astimezone(timezone('Asia/Kolkata'))

		return created_at_in_ist.strftime('%B %d %H:%M:%S')


	ufile_name = serializers.SerializerMethodField(read_only=True)
	is_img = serializers.SerializerMethodField(read_only=True)
	is_received = serializers.SerializerMethodField(read_only=True)
	send_by = serializers.CharField(required=True, source='send_by.username')
	send_to = serializers.CharField(required=True, source='send_to.username')
	created_at = serializers.SerializerMethodField(read_only=True)


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
		fields = ('send_by', 'send_to', 'text', 'ufile', 'created_at', 'ufile_name', 'is_img', 'is_received', )
		read_only_fields = ('created_at', 'ufile_name', )