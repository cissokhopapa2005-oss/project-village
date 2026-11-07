from django.test import SimpleTestCase
from django.urls import reverse


class TourismPagesTests(SimpleTestCase):
    def test_home_page(self):
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Kédougou")
        self.assertContains(response, "Explorer la région")
        self.assertContains(response, "js/home-carousel.js")
        self.assertContains(response, 'aria-label="Photo suivante"')
        self.assertContains(response, 'class="feature-card-image"')
        self.assertContains(response, "images/cultures-locales.jpg")
        self.assertContains(response, "images/cascade.jpg")
        self.assertContains(response, "images/randonnee-nature.jpg")
        self.assertContains(response, "https://www.youtube-nocookie.com/embed/7F00jZ-oonw")
        self.assertContains(response, 'title="Découvrir Kédougou en vidéo"')
        self.assertContains(response, 'href="https://www.youtube.com/watch?v=7F00jZ-oonw"')

    def test_home_carousel_contains_four_landscape_photos(self):
        response = self.client.get(reverse("home"))
        for photo in (
            "cascade.jpg",
            "observer-paysages.jpg",
            "pays-bassari.jpg",
            "sud-est-kedougou.jpg",
        ):
            with self.subTest(photo=photo):
                self.assertContains(response, f"images/{photo}")

    def test_tourism_pages_load(self):
        pages = (
            ("history", "Une région façonnée par ses cultures"),
            ("places", "La cascade de Dindéfelo"),
            ("activities", "Des expériences à vivre"),
            ("gallery", "Les paysages de Kédougou"),
            ("planner", "Imaginez votre séjour à Kédougou"),
            ("faq", "Questions fréquentes avant votre séjour"),
            ("contact", "Votre escapade à Kédougou commence ici"),
        )
        for route_name, heading in pages:
            with self.subTest(page=route_name):
                response = self.client.get(reverse(route_name))
                self.assertEqual(response.status_code, 200)
                self.assertContains(response, heading)

    def test_navigation_links_to_all_sections(self):
        response = self.client.get(reverse("home"))
        for route_name in ("history", "places", "activities", "gallery", "planner", "faq", "contact"):
            with self.subTest(page=route_name):
                self.assertContains(response, reverse(route_name))

    def test_uploaded_photos_are_restored_on_their_pages(self):
        expected_photos = {
            "home": (
                "cascade.jpg",
                "observer-paysages.jpg",
                "pays-bassari.jpg",
                "sud-est-kedougou.jpg",
            ),
            "history": ("orpaillage.jpg",),
            "places": (
                "cascade.jpg",
                "pays-bassari.jpg",
                "niokolo-koba.jpg",
                "orpaillage.jpg",
            ),
            "activities": (
                "cascade.jpg",
                "randonnee-nature.jpg",
                "cultures-locales.jpg",
                "observer-paysages.jpg",
                "saveurs-kedougou-1.jpg",
                "saveurs-kedougou-2.jpg",
            ),
            "gallery": (
                "cascade.jpg",
                "sud-est-kedougou.jpg",
                "orpaillage.jpg",
                "savane-heure-doree.jpg",
            ),
            "contact": ("cascade.jpg",),
        }
        for route_name, photos in expected_photos.items():
            with self.subTest(page=route_name):
                response = self.client.get(reverse(route_name))
                for photo in photos:
                    with self.subTest(photo=photo):
                        self.assertContains(response, f"images/{photo}")

    def test_history_page_tells_the_story_with_photos_and_verified_milestone(self):
        response = self.client.get(reverse("history"))
        self.assertContains(response, "https://www.youtube-nocookie.com/embed/QwuB8REbhrU")
        self.assertContains(response, 'title="Histoire et fondation de Kédougou"')
        self.assertContains(response, 'href="https://www.youtube.com/watch?v=QwuB8REbhrU"')
        self.assertContains(response, "images/cultures-locales.jpg")
        self.assertContains(response, "images/pays-bassari.jpg")
        self.assertContains(response, "images/orpaillage.jpg")
        self.assertContains(response, "2012")
        self.assertContains(response, "https://whc.unesco.org/fr/list/1407/")

    def test_contact_page_has_map_travel_advice_and_activity_link(self):
        response = self.client.get(reverse("contact"))
        self.assertContains(response, "images/cascade.jpg")
        self.assertContains(response, "google.com/maps/search/")
        self.assertContains(response, "Choisir la saison")
        self.assertContains(response, reverse("activities"))

    def test_gallery_has_accessible_lightbox_and_its_script(self):
        response = self.client.get(reverse("gallery"))
        self.assertContains(response, '<dialog class="gallery-lightbox"')
        self.assertContains(response, "js/gallery.js")
        self.assertContains(response, 'aria-label="Photo suivante"')
        self.assertContains(response, 'data-filter="culture"')
        self.assertContains(response, 'data-category="landscape"')
        self.assertContains(response, "images/pays-bassari.jpg")

    def test_planner_has_duration_interests_and_script(self):
        response = self.client.get(reverse("planner"))
        self.assertContains(response, "js/planner.js")
        self.assertContains(response, 'name="duration" value="3"')
        self.assertContains(response, 'name="interest" value="culture"')
        self.assertContains(response, reverse("places"))
        self.assertContains(response, "Imprimer / PDF")

    def test_faq_has_native_accessible_questions_and_contact_link(self):
        response = self.client.get(reverse("faq"))
        self.assertContains(response, "<details")
        self.assertContains(response, "<summary")
        self.assertContains(response, "conditions peuvent changer")
        self.assertContains(response, reverse("contact"))
