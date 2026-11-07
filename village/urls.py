from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('histoire/', views.history, name='history'),
    path('a-visiter/', views.places, name='places'),
    path('activites/', views.activities, name='activities'),
    path('galerie/', views.gallery, name='gallery'),
    path('planifier/', views.planner, name='planner'),
    path('faq/', views.faq, name='faq'),
    path('contact/', views.contact, name='contact'),
]
