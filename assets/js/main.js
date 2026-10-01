document.addEventListener("DOMContentLoaded", () => {
    const animatedTitles = document.querySelectorAll(".animated-title");

    const eventImages = [...document.querySelectorAll(".events-image")];
    const eventButtons = [...document.querySelectorAll(".btn-event")];
    const eventPanels = [...document.querySelectorAll(".event-panel")];

    const eventElementGroups = [eventImages, eventButtons, eventPanels];

    const form = document.querySelector("form");

    const customSelect = document.querySelector('.custom-select');

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

    // Check booking date and time validity
    if (form) {
        const monthInput = document.querySelector("#month");
        const dayInput = document.querySelector("#day");
        const yearInput = document.querySelector("#year");
        const hoursInput = document.querySelector("#hours");
        const minutesInput = document.querySelector("#minutes");
        const periodInput = document.querySelector("#period");
        const bookingDateError = document.querySelector(".booking-date > .error-message");

        const bookingFields = [monthInput, dayInput, yearInput, hoursInput, minutesInput, periodInput];
        const requiredFields = form.querySelectorAll("[required]");
        const defaultBookingDateError = bookingDateError ? bookingDateError.textContent : "";

        const getBookingDate = () => {
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

            return new Date(year, month - 1, day, hours24, minutes);
        };

        const isRealBookingDate = (date) => {
            return date.getFullYear() === Number(yearInput.value)
                && date.getMonth() === Number(monthInput.value) - 1
                && date.getDate() === Number(dayInput.value);
        };

        const setFieldError = (field, hasError) => {
            const formField = field.closest(".form-field");

            if (formField) {
                formField.classList.toggle("error", hasError);
            }
        };

        const clearBookingError = () => {
            yearInput.setCustomValidity("");

            if (bookingDateError) {
                bookingDateError.textContent = defaultBookingDateError;
            }
        };

        bookingFields.forEach((field) => {
            field.addEventListener("input", clearBookingError);
            field.addEventListener("change", clearBookingError);
        });

        requiredFields.forEach((field) => {
            field.addEventListener("input", () => {
                field.setCustomValidity("");
                setFieldError(field, false);
            });
        });

        form.addEventListener("submit", (event) => {
            let isValid = true;

            requiredFields.forEach((field) => {
                field.setCustomValidity("");
            });

            if (bookingDateError) {
                bookingDateError.textContent = defaultBookingDateError;
            }

            if (bookingFields.every((field) => field.value.trim() && field.checkValidity())) {
                const selectedDate = getBookingDate();

                if (!isRealBookingDate(selectedDate)) {
                    yearInput.setCustomValidity("Please choose an existing date.");

                    if (bookingDateError) {
                        bookingDateError.textContent = "This date is invalid";
                    }
                } else if (selectedDate <= new Date()) {
                    yearInput.setCustomValidity("Please choose a date and time in the future.");

                    if (bookingDateError) {
                        bookingDateError.textContent = "Choose a future date and time";
                    }
                }
            }

            requiredFields.forEach((field) => {
                const hasError = !field.checkValidity();

                setFieldError(field, hasError);
                isValid = isValid && !hasError;
            });

            if (!isValid) {
                event.preventDefault();
            }
        });
    }

    // Select AM/PM
    if (customSelect) {
        const trigger = customSelect.querySelector('.custom-select-trigger');
        const value = customSelect.querySelector('.custom-select-value');
        const options = customSelect.querySelector('.custom-select-options');
        const optionButtons = customSelect.querySelectorAll('.custom-select-option');
        const input = customSelect.querySelector('input[type="hidden"]');

        trigger.addEventListener('click', () => {
            const isOpen = trigger.getAttribute('data-expanded') === 'true';

            trigger.setAttribute('data-expanded', String(!isOpen));
            options.hidden = isOpen;
        });

        optionButtons.forEach(option => {
            option.addEventListener('click', () => {
                const selectedValue = option.dataset.value;

                value.textContent = selectedValue;
                input.value = selectedValue;
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.dispatchEvent(new Event("change", { bubbles: true }));

                optionButtons.forEach(option => {
                    option.classList.remove('is-selected');
                });

                option.classList.add('is-selected');

                trigger.setAttribute('data-expanded', 'false');
                options.hidden = true;

                trigger.focus();
            });
        });

        document.addEventListener('click', event => {
            if (!customSelect.contains(event.target)) {
                trigger.setAttribute('data-expanded', 'false');
                options.hidden = true;
            }
        });
    }

    // Increase/decrease amount of guests
    const amountInput = document.querySelector("#amount");
    const decreaseAmountButton = document.querySelector(".amount.decrease");
    const increaseAmountButton = document.querySelector(".amount.increase");

    if (amountInput && decreaseAmountButton && increaseAmountButton) {
        const minAmount = Number(amountInput.min) || 1;

        decreaseAmountButton.addEventListener("click", () => {
            const currentAmount = Number(amountInput.value) || minAmount;

            amountInput.value = Math.max(minAmount, currentAmount - 1);
        });

        increaseAmountButton.addEventListener("click", () => {
            const currentAmount = Number(amountInput.value) || minAmount;

            amountInput.value = currentAmount + 1;
        });
    }
});
