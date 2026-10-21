const root = document.documentElement;
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;

// =====================================
// DARK / LIGHT MODE
// =====================================
const themeBtn = document.getElementById("themeBtn");
function setTheme(t) {
    root.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch (e) {}
}
themeBtn.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    if (document.startViewTransition) document.startViewTransition(() => setTheme(next));
    else setTheme(next);
});


// =====================================
// HERO TITLE: WORDS SWING IN IN 3D
// =====================================
function splitWords(node) {
    [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
            const parts = n.textContent.split(/\s+/).filter(Boolean);
            if (!parts.length) return;
            const f = document.createDocumentFragment();
            parts.forEach((word, i) => {
                const s = document.createElement("span");
                s.className = "w";
                s.textContent = word;
                s.style.setProperty("--i", splitWords.count++);
                f.append(s, " ");
            });
            n.replaceWith(f);
        } else if (n.nodeType === 1 && n.tagName !== "BR") splitWords(n);
    });
}
splitWords.count = 0;
splitWords(document.querySelector(".hero h1"));
window.addEventListener("load", () => {
    setTimeout(() => document.querySelector(".hero-content").classList.add("show"), 150);
});


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
    video.style.setProperty("--d", `${index * 0.05}s`);

    observer.observe(video);

});


// =====================================
// NAVBAR ON SCROLL + PROGRESS BAR
// =====================================

const navbar = document.querySelector(".navbar");
const bar = document.querySelector(".progress");

window.addEventListener("scroll", () => {

    navbar.classList.toggle("scrolled", window.scrollY > 50);

    bar.style.width =
        (root.scrollTop / (root.scrollHeight - root.clientHeight)) * 100 + "%";

}, { passive: true });


// =====================================
// 3D DEPTH ON VIDEO CARDS WHILE SCROLLING
// (works even over the Instagram iframes)
// =====================================

let ticking = false;
function depth() {
    ticking = false;
    videos.forEach(card => {
        const r = card.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        const dy = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        const dx = (r.left + r.width / 2 - innerWidth / 2) / innerWidth;
        const rx = Math.max(-9, Math.min(9, dy * -12));
        const ry = Math.max(-14, Math.min(14, dx * -22));
        card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
}
function queueDepth() {
    if (!ticking) { ticking = true; requestAnimationFrame(depth); }
}
addEventListener("scroll", queueDepth, { passive: true });
addEventListener("resize", queueDepth);
addEventListener("load", () => { queueDepth(); setTimeout(queueDepth, 1500); setTimeout(queueDepth, 3500); });


// =====================================
// MOUSE 3D: FILM RING + ABOUT CARD
// =====================================

if (fine) {
    const hero = document.querySelector(".hero");
    const tilt = document.querySelector(".film-tilt");
    hero.addEventListener("mousemove", e => {
        const r = hero.getBoundingClientRect();
        tilt.style.setProperty("--tx", ((e.clientY - r.top) / r.height - 0.5) * -16 + "deg");
        tilt.style.setProperty("--ty", ((e.clientX - r.left) / r.width - 0.5) * 30 + "deg");
    });
    hero.addEventListener("mouseleave", () => {
        tilt.style.setProperty("--tx", "0deg");
        tilt.style.setProperty("--ty", "0deg");
    });

    const about = document.querySelector(".about-content");
    about.addEventListener("mousemove", e => {
        const r = about.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        about.style.transform = `perspective(1000px) rotateY(${(px - 0.5) * 8}deg) rotateX(${(0.5 - py) * 8}deg)`;
    });
    about.addEventListener("mouseleave", () => about.style.transform = "");
}


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
