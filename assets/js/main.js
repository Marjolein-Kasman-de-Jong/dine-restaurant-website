document.addEventListener("DOMContentLoaded", (event) => {
    // Detect prefers-reduced-motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Intersection observer
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

    // Animate titles
    const titles = document.querySelectorAll(".animated-title");

    if (!reduceMotion) {
        titles.forEach((title) => {
            observer.observe(title);
        });
    } else {
        titles.forEach((title) => {
            title.classList.add('prefers-reduced-motion');
        });
    }
});
