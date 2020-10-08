from django.urls import path, include
from . import views, viewsets
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('user', viewsets.UserViewSet)
router.register('category', viewsets.CategoryViewSet)
router.register('section', viewsets.SectionViewSet)
router.register('task', viewsets.TaskViewSet)
router.register('sub_task', viewsets.SubTaskViewSet)
router.register('label', viewsets.LabelViewSet)
router.register('karma', viewsets.KarmaViewSet)
router.register('setting', viewsets.SettingViewSet)


app_name = 'api'
urlpatterns = [
    path('', include(router.urls)),
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('appinit/', views.AppInitView.as_view(), name='appinit'),
    path('default-categories/', views.DefaultCategoriesView.as_view(), name='default-categories'),
    path('search/', views.SearchView.as_view(), name='search'),
]
