from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('history/', views.history, name='history'),
    path('predict/', views.predict, name='predict'),
]