document.addEventListener("DOMContentLoaded", () => {
    const animatedTitles = document.querySelectorAll(".animated-title");

    const eventImages = [...document.querySelectorAll(".events-image")];
    const eventButtons = [...document.querySelectorAll(".btn-event")];
    const eventPanels = [...document.querySelectorAll(".event-panel")];

    const eventElementGroups = [eventImages, eventButtons, eventPanels];

    // Animate titles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    },
        {
            rootMargin: '0px 0px -20% 0px'
        }
    );

    animatedTitles.forEach((title) => {
        observer.observe(title);
    });

    // Switch the active event image, button, and panel when an event button is clicked
    eventButtons.forEach(eventButton => {
        eventButton.addEventListener("click", function (e) {
            const clickedButton = e.target.dataset.event;

            eventElementGroups.forEach(eventElementGroup => {
                eventElementGroup.forEach(eventElement => {
                    eventElement.classList.remove("active");
                });

                const newActiveEventElement = eventElementGroup.find(eventElement => {
                    return eventElement.dataset.event === clickedButton;
                });
                newActiveEventElement.classList.add("active");
            });
        });
    });
});
