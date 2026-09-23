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

    const form = document.querySelector("form");

    // Check booking date and time validity
    if (form) {
        const monthInput = document.querySelector("#month");
        const dayInput = document.querySelector("#day");
        const yearInput = document.querySelector("#year");
        const hoursInput = document.querySelector("#hours");
        const minutesInput = document.querySelector("#minutes");
        const periodInput = document.querySelector("#period");

        const bookingFields = [monthInput, dayInput, yearInput, hoursInput, minutesInput, periodInput];

        bookingFields.forEach((field) => {
            const clearBookingError = () => {
                yearInput.setCustomValidity("");
            };

            field.addEventListener("input", clearBookingError);
            field.addEventListener("change", clearBookingError);
        });

        form.addEventListener("submit", (event) => {
            yearInput.setCustomValidity("");

            const month = Number(monthInput.value);
            const day = Number(dayInput.value);
            const year = Number(yearInput.value);
            const hours = Number(hoursInput.value);
            const minutes = Number(minutesInput.value);
            const period = periodInput.value;

            let hours24 = hours;

            if (period === "PM" && hours !== 12) {
                hours24 += 12;
            }

            if (period === "AM" && hours === 12) {
                hours24 = 0;
            }

            const selectedDate = new Date(year, month - 1, day, hours24, minutes);
            const now = new Date();

            if (selectedDate <= now) {
                event.preventDefault();

                yearInput.setCustomValidity("Please choose a date and time in the future.");

                yearInput.reportValidity();
            }
        });
    }
});
