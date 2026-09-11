document.addEventListener("DOMContentLoaded", (event) => {
    // Animate title
    const titles = document.querySelectorAll(".animated-title");

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

    titles.forEach((title) => {
        observer.observe(title);
    });
});



