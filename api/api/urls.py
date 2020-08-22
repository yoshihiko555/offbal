from django.urls import path, include
from . import views, viewsets
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('user', viewsets.UserViewSet)
router.register('project', viewsets.ProjectViewSet)
router.register('section', viewsets.SectionViewSet)
router.register('task', viewsets.TaskViewSet)
router.register('label', viewsets.LabelViewSet)
router.register('karma', viewsets.KarmaViewSet)


app_name = 'api'
urlpatterns = [
    path('', include(router.urls)),
    path('public/', views.public),
    path('private/', views.private),
]
