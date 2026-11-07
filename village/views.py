from django.shortcuts import render


VILLAGE_NAME = "Kédougou"


def home(request):
    return render(request, "village/home.html", {"village_name": VILLAGE_NAME})


def history(request):
    return render(request, "village/history.html", {"village_name": VILLAGE_NAME})


def places(request):
    return render(request, "village/places.html", {"village_name": VILLAGE_NAME})


def activities(request):
    return render(request, "village/activities.html", {"village_name": VILLAGE_NAME})


def gallery(request):
    return render(request, "village/gallery.html", {"village_name": VILLAGE_NAME})


def planner(request):
    return render(request, "village/planner.html", {"village_name": VILLAGE_NAME})


def faq(request):
    return render(request, "village/faq.html", {"village_name": VILLAGE_NAME})


def contact(request):
    return render(request, "village/contact.html", {"village_name": VILLAGE_NAME})
