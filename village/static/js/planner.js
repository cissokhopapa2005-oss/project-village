const plannerForm = document.querySelector(".planner-form");

if (plannerForm) {
    const plannerLayout = plannerForm.closest(".planner-layout");
    const results = document.querySelector(".planner-results");
    const daysContainer = document.querySelector(".planner-days");
    const status = document.querySelector(".planner-status");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const experiences = {
        nature: [
            {
                title: "Découvrir la cascade de Dindéfelo",
                description: "Préparez cette excursion avec un guide local et vérifiez les conditions d’accès.",
                link: plannerForm.dataset.placesUrl,
                linkText: "Voir les lieux à visiter",
            },
            {
                title: "Observer les paysages",
                description: "Choisissez un point de vue accessible avec un accompagnateur local.",
                link: plannerForm.dataset.activitiesUrl,
                linkText: "Voir les activités",
            },
        ],
        culture: [
            {
                title: "Découvrir le Pays bassari",
                description: "Explorez ce paysage culturel et renseignez-vous localement sur les modalités de visite.",
                link: plannerForm.dataset.placesUrl,
                linkText: "Voir les lieux à visiter",
            },
            {
                title: "Rencontrer les cultures locales",
                description: "Préparez les rencontres avec les communautés et demandez toujours leur accord.",
                link: plannerForm.dataset.activitiesUrl,
                linkText: "Voir les activités",
            },
            {
                title: "En apprendre plus sur les récits et traditions",
                description: "Découvrez les repères historiques et les cultures de la région.",
                link: plannerForm.dataset.historyUrl,
                linkText: "Lire la page Histoire",
            },
        ],
        hiking: [
            {
                title: "Marcher en pleine nature",
                description: "Demandez conseil sur la difficulté, la météo et l’état des chemins.",
                link: plannerForm.dataset.activitiesUrl,
                linkText: "Voir les activités",
            },
            {
                title: "Prendre le temps d’observer les panoramas",
                description: "Les accès et les paysages varient selon la saison ; faites-vous accompagner.",
                link: plannerForm.dataset.activitiesUrl,
                linkText: "Voir les activités",
            },
        ],
        food: [
            {
                title: "Goûter aux saveurs de la région",
                description: "Découvrez les produits et les plats locaux auprès des restaurateurs et des familles qui accueillent les visiteurs.",
                link: plannerForm.dataset.activitiesUrl,
                linkText: "Voir les activités",
            },
        ],
    };

    const createExperience = (experience) => {
        const item = document.createElement("li");
        const title = document.createElement("h4");
        const description = document.createElement("p");
        const link = document.createElement("a");

        title.textContent = experience.title;
        description.textContent = experience.description;
        link.href = experience.link;
        link.textContent = experience.linkText;
        item.append(title, description, link);
        return item;
    };

    const createDay = (dayNumber, dayExperiences) => {
        const day = document.createElement("article");
        const heading = document.createElement("h3");
        const list = document.createElement("ul");

        day.className = "planner-day";
        heading.textContent = `Jour ${dayNumber}`;
        dayExperiences.forEach((experience) => list.append(createExperience(experience)));
        day.append(heading, list);
        return day;
    };

    plannerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(plannerForm);
        const duration = Number(formData.get("duration"));
        const selectedInterests = formData.getAll("interest");

        if (selectedInterests.length === 0) {
            results.hidden = true;
            plannerLayout.classList.remove("has-results");
            status.textContent = "Choisissez au moins un thème pour composer votre séjour.";
            return;
        }

        const nextDays = [];
        const experienceIndexes = Object.fromEntries(selectedInterests.map((interest) => [interest, 0]));

        for (let dayIndex = 0; dayIndex < duration; dayIndex += 1) {
            const dayExperiences = [];
            const orderedInterests = selectedInterests.map(
                (_, index) => selectedInterests[(index + dayIndex) % selectedInterests.length],
            );

            for (const interest of orderedInterests) {
                if (dayExperiences.length === 2) {
                    break;
                }

                const options = experiences[interest];
                const optionIndex = experienceIndexes[interest] % options.length;
                dayExperiences.push(options[optionIndex]);
                experienceIndexes[interest] += 1;
            }

            nextDays.push(createDay(dayIndex + 1, dayExperiences));
        }

        daysContainer.replaceChildren(...nextDays);
        results.hidden = false;
        plannerLayout.classList.add("has-results");
        status.textContent = `Votre idée de programme sur ${duration} jour${duration > 1 ? "s" : ""} est prête.`;
        if (window.gsap && !reducedMotion.matches) {
            window.gsap.fromTo(nextDays, { autoAlpha: 0, y: 16 }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.45,
                stagger: 0.08,
                ease: "power2.out",
                clearProps: "transform,opacity,visibility",
            });
        }
        results.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
    });

    document.querySelector(".planner-print").addEventListener("click", () => window.print());
}
