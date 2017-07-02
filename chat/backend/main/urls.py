from rest_framework import routers

from .views import MessageViewSet

router = routers.SimpleRouter()
router.register(r'messages', MessageViewSet)

urlpatterns = router.urls