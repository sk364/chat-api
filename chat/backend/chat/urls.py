from django.conf.urls import url, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from rest_framework_swagger.views import get_swagger_view


schema_view = get_swagger_view(title='Chat API')

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include('main.urls')),
    url(r'^api/', include('authn.urls')),
    url(r'^social/', include('social.apps.django_app.urls', namespace='social')),
    url(r'^auth/', include('rest_framework_social_oauth2.urls', namespace='drfso2')),
    url(r'^$', schema_view),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns