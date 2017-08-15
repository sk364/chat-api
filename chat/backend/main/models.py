from __future__ import unicode_literals

import uuid
import os

from django.db import models
from django.contrib.auth.models import User


def get_file_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    return os.path.join('', filename)


class Message(models.Model):
	send_by = models.ForeignKey(User, related_name='send_by', on_delete=models.CASCADE)
	send_to = models.ForeignKey(User, related_name='send_to', on_delete=models.CASCADE)
	text = models.CharField(max_length=1024, blank=True, null=True, default='')
	ufile = models.FileField(upload_to=get_file_path, blank=True, null=True, default='')
	read = models.CharField(max_length=10, null=True, blank=True, default='')
	created_at = models.DateTimeField(auto_now_add=True)
