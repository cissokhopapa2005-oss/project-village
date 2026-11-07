const gallery = document.querySelector(".gallery-grid");
const lightbox = document.querySelector(".gallery-lightbox");
const filterPanel = document.querySelector(".gallery-filter-panel");

if (gallery && filterPanel && lightbox instanceof HTMLDialogElement) {
    const items = Array.from(gallery.querySelectorAll(".gallery-tile"));
    const filterButtons = Array.from(filterPanel.querySelectorAll(".gallery-filter"));
    const filterStatus = filterPanel.querySelector(".gallery-filter-status");
    const image = lightbox.querySelector(".lightbox-image");
    const caption = lightbox.querySelector(".lightbox-caption");
    const counter = lightbox.querySelector(".lightbox-counter");
    const closeButton = lightbox.querySelector(".lightbox-close");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeIndex = 0;
    let lastFocusedItem = null;
    let isClosing = false;

    const visibleItems = () => items.filter((item) => !item.hidden);
    const canAnimate = () => Boolean(window.gsap && !reducedMotion.matches);

    const animateImage = () => {
        if (!canAnimate()) return;
        window.gsap.killTweensOf(image);
        window.gsap.fromTo(image, { autoAlpha: 0, scale: .985 }, {
            autoAlpha: 1,
            scale: 1,
            duration: .34,
            ease: "power2.out",
            clearProps: "transform,opacity,visibility",
        });
    };

    const showImage = (index) => {
        const availableItems = visibleItems();
        if (!availableItems.length) return;

        activeIndex = (index + availableItems.length) % availableItems.length;
        const item = availableItems[activeIndex];
        const thumbnail = item.querySelector("img");
        const title = item.querySelector("figcaption").textContent.trim();

        image.src = thumbnail.currentSrc || thumbnail.src;
        image.alt = thumbnail.alt;
        caption.textContent = title;
        counter.textContent = `Photo ${activeIndex + 1} sur ${availableItems.length}`;
    };

    const closeLightbox = () => {
        if (!lightbox.open || isClosing) return;
        if (!canAnimate()) {
            lightbox.close();
            return;
        }

        isClosing = true;
        window.gsap.killTweensOf(lightbox);
        window.gsap.to(lightbox, {
            autoAlpha: 0,
            scale: .985,
            duration: .18,
            ease: "power2.in",
            onComplete: () => lightbox.close(),
        });
    };

    items.forEach((item) => {
        item.classList.add("js-gallery-item");
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");
        item.setAttribute("aria-label", `Agrandir : ${item.querySelector("figcaption").textContent.trim()}`);
        item.addEventListener("click", () => {
            lastFocusedItem = item;
            showImage(visibleItems().indexOf(item));
            lightbox.showModal();
            closeButton.focus();

            if (canAnimate()) {
                isClosing = false;
                window.gsap.fromTo(lightbox, { autoAlpha: 0, scale: .975, y: 12 }, {
                    autoAlpha: 1,
                    scale: 1,
                    y: 0,
                    duration: .32,
                    ease: "power2.out",
                    clearProps: "transform,opacity,visibility",
                });
                animateImage();
            }
        });
        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                item.click();
            }
        });
    });

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (canAnimate()) {
                window.gsap.killTweensOf(items);
                window.gsap.set(items, { clearProps: "transform,opacity,visibility" });
            }
            const previousPositions = new Map(
                visibleItems().map((item) => [item, item.getBoundingClientRect()]),
            );
            const filter = button.dataset.filter;

            items.forEach((item) => {
                item.hidden = filter !== "all" && item.dataset.category !== filter;
            });
            filterButtons.forEach((filterButton) => {
                const isActive = filterButton === button;
                filterButton.classList.toggle("is-active", isActive);
                filterButton.setAttribute("aria-pressed", String(isActive));
            });

            const visible = visibleItems();
            gallery.classList.toggle("is-filtered", filter !== "all");
            gallery.dataset.visibleCount = String(visible.length);
            filterStatus.textContent = `${visible.length} photo${visible.length === 1 ? "" : "s"} affichée${visible.length === 1 ? "" : "s"}.`;

            if (canAnimate()) {
                visible.forEach((item, index) => {
                    const previous = previousPositions.get(item);
                    if (previous) {
                        const next = item.getBoundingClientRect();
                        const x = previous.left - next.left;
                        const y = previous.top - next.top;
                        if (Math.abs(x) > 1 || Math.abs(y) > 1) {
                            window.gsap.fromTo(item, { x, y }, {
                                x: 0,
                                y: 0,
                                duration: .48,
                                ease: "power2.out",
                                clearProps: "transform",
                            });
                        }
                    } else {
                        window.gsap.fromTo(item, { autoAlpha: 0, y: 12 }, {
                            autoAlpha: 1,
                            y: 0,
                            duration: .34,
                            delay: index * .035,
                            ease: "power2.out",
                            clearProps: "transform,opacity,visibility",
                        });
                    }
                });
            }
        });
    });

    lightbox.querySelector(".lightbox-previous").addEventListener("click", () => {
        showImage(activeIndex - 1);
        animateImage();
    });
    lightbox.querySelector(".lightbox-next").addEventListener("click", () => {
        showImage(activeIndex + 1);
        animateImage();
    });
    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeLightbox();
    });
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
    });
    lightbox.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            showImage(activeIndex - 1);
            animateImage();
        } else if (event.key === "ArrowRight") {
            showImage(activeIndex + 1);
            animateImage();
        }
    });
    lightbox.addEventListener("close", () => {
        isClosing = false;
        if (window.gsap) window.gsap.set(lightbox, { clearProps: "transform,opacity,visibility" });
        lastFocusedItem?.focus();
    });
    reducedMotion.addEventListener("change", (event) => {
        if (!event.matches || !window.gsap) return;
        const wasClosing = isClosing;
        window.gsap.killTweensOf(items);
        window.gsap.killTweensOf(image);
        window.gsap.killTweensOf(lightbox);
        window.gsap.set([...items, image, lightbox], { clearProps: "transform,opacity,visibility" });
        if (wasClosing && lightbox.open) lightbox.close();
    });

    gallery.dataset.visibleCount = String(items.length);
    filterPanel.hidden = false;
}
