const carousel = document.querySelector(".home-carousel");

if (carousel) {
    const slides = Array.from(carousel.querySelectorAll(".home-slide"));
    const dots = Array.from(carousel.querySelectorAll(".home-carousel-dot"));
    const caption = carousel.querySelector(".home-slide-caption");
    const heroIndex = document.querySelector(".hero-index");
    const pauseButton = carousel.querySelector(".home-carousel-pause");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeIndex = 0;
    let timerId = null;
    let pointerInside = false;
    let focusInside = false;
    let manuallyPaused = false;

    const showSlide = (index) => {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeIndex;
            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
            slide.setAttribute("aria-label", `${slideIndex + 1} sur ${slides.length}`);
        });

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeIndex;
            dot.classList.toggle("is-active", isActive);
            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });

        caption.textContent = slides[activeIndex].querySelector("img").alt;
        if (heroIndex) {
            heroIndex.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
        }
    };

    const updateTimer = () => {
        window.clearInterval(timerId);
        timerId = null;
        if (manuallyPaused || pointerInside || focusInside || document.hidden || reducedMotion.matches) {
            return;
        }
        timerId = window.setInterval(() => showSlide(activeIndex + 1), 5500);
    };

    carousel.querySelector(".home-carousel-previous").addEventListener("click", () => {
        showSlide(activeIndex - 1);
        updateTimer();
    });
    carousel.querySelector(".home-carousel-next").addEventListener("click", () => {
        showSlide(activeIndex + 1);
        updateTimer();
    });

    let pointerStartX = null;
    carousel.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "touch") pointerStartX = event.clientX;
    }, { passive: true });
    carousel.addEventListener("pointerup", (event) => {
        if (pointerStartX === null) return;
        const delta = event.clientX - pointerStartX;
        pointerStartX = null;
        if (Math.abs(delta) < 48) return;
        showSlide(activeIndex + (delta < 0 ? 1 : -1));
        updateTimer();
    }, { passive: true });

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            showSlide(Number(dot.dataset.slideTo));
            updateTimer();
        });
    });

    pauseButton.addEventListener("click", () => {
        manuallyPaused = !manuallyPaused;
        pauseButton.textContent = manuallyPaused ? "Lire" : "Pause";
        pauseButton.setAttribute("aria-label", manuallyPaused ? "Reprendre le carrousel" : "Mettre en pause le carrousel");
        pauseButton.setAttribute("aria-pressed", String(manuallyPaused));
        updateTimer();
    });

    carousel.addEventListener("pointerenter", () => {
        pointerInside = true;
        updateTimer();
    });
    carousel.addEventListener("pointerleave", () => {
        pointerInside = false;
        updateTimer();
    });
    carousel.addEventListener("focusin", (event) => {
        if (event.target !== pauseButton) {
            focusInside = true;
            updateTimer();
        }
    });
    carousel.addEventListener("focusout", (event) => {
        if (!carousel.contains(event.relatedTarget)) {
            focusInside = false;
            updateTimer();
        }
    });
    document.addEventListener("visibilitychange", updateTimer);
    reducedMotion.addEventListener("change", updateTimer);

    updateTimer();
}
