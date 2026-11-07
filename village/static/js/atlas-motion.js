(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || !window.gsap) return;

    const gsap = window.gsap;
    const scrollTrigger = window.ScrollTrigger;
    if (scrollTrigger) gsap.registerPlugin(scrollTrigger);

    const introItems = document.querySelectorAll(".hero-kicker, .hero-copy h1, .hero-intro, .hero-button");
    if (introItems.length) {
        gsap.from(introItems, {
            y: 30,
            autoAlpha: 0,
            duration: 1.05,
            stagger: 0.12,
            ease: "power3.out",
            delay: 0.12,
        });
    }

    if (scrollTrigger) {
        gsap.utils.toArray("[data-reveal]").forEach((element) => {
            gsap.from(element, {
                y: 34,
                autoAlpha: 0,
                duration: 0.9,
                ease: "power2.out",
                scrollTrigger: { trigger: element, start: "top 86%", once: true },
            });
        });

        gsap.utils.toArray("[data-parallax] img").forEach((image) => {
            gsap.fromTo(image, { yPercent: -4, scale: 1.07 }, {
                yPercent: 4,
                scale: 1.07,
                ease: "none",
                scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 },
            });
        });

        gsap.utils.toArray(".place-card, .activity-item, .gallery-tile, .planner-day").forEach((item) => {
            gsap.from(item, {
                y: 24,
                autoAlpha: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: { trigger: item, start: "top 92%", once: true },
            });
        });
    }

    const heroImage = document.querySelector(".home-slide.is-active img");
    if (heroImage) gsap.fromTo(heroImage, { scale: 1.11 }, { scale: 1.04, duration: 8, ease: "power1.out" });

    reduceMotion.addEventListener("change", (event) => {
        if (event.matches) {
            gsap.globalTimeline.clear();
            scrollTrigger?.getAll().forEach((trigger) => trigger.kill());
            gsap.set("[data-reveal], .place-card, .activity-item, .gallery-tile, .planner-day", { clearProps: "all" });
            gsap.set("[data-parallax] img, .home-slide img", { clearProps: "transform" });
        }
    });
})();
