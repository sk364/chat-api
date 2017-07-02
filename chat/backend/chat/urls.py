from django.conf.urls import url, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin


urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include('main.urls')),
    url(r'^api/', include('authn.urls')),
    url(r'^social/', include('social.apps.django_app.urls', namespace='social')),
    url(r'^auth/', include('rest_framework_social_oauth2.urls', namespace='drfso2')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)