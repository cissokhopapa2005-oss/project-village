(() => {
    const header = document.querySelector(".site-header");
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".primary-navigation");
    const progress = document.querySelector(".reading-progress span");

    if (menuButton && navigation) {
        const closeMenu = () => {
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Ouvrir le menu");
            navigation.classList.remove("is-open");
        };

        menuButton.addEventListener("click", () => {
            const isOpen = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", String(!isOpen));
            menuButton.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
            navigation.classList.toggle("is-open", !isOpen);
        });
        navigation.addEventListener("click", (event) => {
            if (event.target.closest("a")) closeMenu();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
                closeMenu();
                menuButton.focus();
            }
        });
        document.addEventListener("click", (event) => {
            if (!header?.contains(event.target)) closeMenu();
        });
        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) closeMenu();
        });
    }

    let ticking = false;
    const updateScrollChrome = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
        if (progress) progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
        header?.classList.toggle("is-scrolled", window.scrollY > 24);
        ticking = false;
    };

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollChrome);
            ticking = true;
        }
    }, { passive: true });
    updateScrollChrome();
})();
