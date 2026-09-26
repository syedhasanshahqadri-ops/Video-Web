// =====================================
// REVEAL VIDEOS WHEN THEY ENTER SCREEN
// =====================================

const videos = document.querySelectorAll(".video-card");

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.08
    }
);


videos.forEach((video, index) => {

    // Slight staggered animation
    video.style.transitionDelay =
        `${index * 0.05}s`;

    observer.observe(video);

});


// =====================================
// NAVBAR ON SCROLL
// =====================================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.style.background =
            "rgba(245, 241, 232, 0.96)";

    } else {

        navbar.style.background =
            "rgba(245, 241, 232, 0.86)";

    }

});


// =====================================
// PAUSE OTHER VIDEOS WHEN ONE PLAYS
// =====================================

const videoPlayers =
    document.querySelectorAll("video");

videoPlayers.forEach((video) => {

    video.addEventListener("play", () => {

        videoPlayers.forEach((otherVideo) => {

            if (otherVideo !== video) {
                otherVideo.pause();
            }

        });

    });

});