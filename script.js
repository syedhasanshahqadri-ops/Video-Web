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

const gallery = document.querySelector(".video-gallery");
let ticking = false;
function depth() {
    ticking = false;
    const k = gallery.classList.contains("cinema") ? 1.7 : 1;
    videos.forEach(card => {
        if (card.classList.contains("is-hidden")) return;
        const r = card.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        const dy = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        const dx = (r.left + r.width / 2 - innerWidth / 2) / innerWidth;
        const rx = Math.max(-9, Math.min(9, dy * -12));
        const ry = Math.max(-14 * k, Math.min(14 * k, dx * -22 * k));
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


// =====================================
// ACCENT COLOUR PICKER
// =====================================
const accentWrap = document.querySelector(".accent-wrap");
const swatches = [...document.querySelectorAll(".accent-pop button")];
function setAccent(a) {
    root.dataset.accent = a;
    try { localStorage.setItem("accent", a); } catch (e) {}
    swatches.forEach(b => b.classList.toggle("on", b.dataset.accent === a));
}
swatches.forEach(b => b.addEventListener("click", () => setAccent(b.dataset.accent)));
document.getElementById("accentBtn").addEventListener("click", e => { e.stopPropagation(); accentWrap.classList.toggle("open"); });
document.addEventListener("click", e => { if (!accentWrap.contains(e.target)) accentWrap.classList.remove("open"); });
setAccent(root.dataset.accent || "ember");


// =====================================
// TOAST
// =====================================
const toast = document.getElementById("toast");
let toastTimer;
function say(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}
function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
    const ta = document.createElement("textarea");
    ta.value = t; ta.style.cssText = "position:fixed;opacity:0";
    document.body.append(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    ta.remove();
    return Promise.resolve();
}


// =====================================
// REEL ACTIONS: FAVORITE, COPY LINK, OPEN ON INSTAGRAM
// =====================================
const favBtn = document.getElementById("favFilter");
const emptyEl = document.getElementById("empty");
let favs = [], favOnly = false;
try { favs = JSON.parse(localStorage.getItem("reelFavs") || "[]"); } catch (e) {}

videos.forEach(card => {
    const link = card.dataset.link;
    const id = link.split("/").filter(Boolean).pop();
    card.dataset.id = id;
    const title = card.querySelector(".video-info p").textContent;
    const box = document.createElement("div");
    box.className = "actions";
    box.innerHTML =
        `<button class="fav" type="button" aria-label="Favorite ${title}" title="Favorite">♥</button>` +
        `<button class="copy" type="button" aria-label="Copy link to ${title}" title="Copy link">⧉</button>` +
        `<a href="${link}" target="_blank" rel="noopener" aria-label="Open ${title} on Instagram" title="Open on Instagram">↗</a>`;
    card.querySelector(".video-info").append(box);
    const fav = box.querySelector(".fav");
    fav.classList.toggle("on", favs.includes(id));
    fav.addEventListener("click", () => {
        const on = !fav.classList.contains("on");
        fav.classList.toggle("on", on);
        favs = on ? [...new Set([...favs, id])] : favs.filter(x => x !== id);
        try { localStorage.setItem("reelFavs", JSON.stringify(favs)); } catch (e) {}
        say(on ? "Saved to favorites ♥" : "Removed from favorites");
        applyFav();
    });
    box.querySelector(".copy").addEventListener("click", () => copyText(link).then(() => say("Reel link copied")));
});

function applyFav() {
    let shown = 0;
    videos.forEach(c => {
        const show = !favOnly || favs.includes(c.dataset.id);
        c.classList.toggle("is-hidden", !show);
        if (show) shown++;
    });
    favBtn.querySelector("b").textContent = videos.length ? favs.filter(f => [...videos].some(v => v.dataset.id === f)).length : 0;
    favBtn.classList.toggle("on", favOnly);
    favBtn.setAttribute("aria-pressed", favOnly);
    emptyEl.hidden = shown > 0;
    queueDepth();
}
favBtn.addEventListener("click", () => { favOnly = !favOnly; applyFav(); });
applyFav();


// =====================================
// GALLERY / CINEMA LAYOUT
// =====================================
const viewBtns = [...document.querySelectorAll(".seg button")];
const work = document.getElementById("work");
function setView(v) {
    gallery.classList.toggle("cinema", v === "cinema");
    work.classList.toggle("cinema-on", v === "cinema");
    viewBtns.forEach(b => b.classList.toggle("on", b.dataset.view === v));
    try { localStorage.setItem("reelView", v); } catch (e) {}
    gallery.scrollLeft = 0;
    queueDepth();
}
viewBtns.forEach(b => b.addEventListener("click", () => setView(b.dataset.view)));
function stepReel(dir) {
    const first = gallery.querySelector(".video-card:not(.is-hidden)");
    if (first) gallery.scrollBy({ left: dir * (first.offsetWidth + 22), behavior: "smooth" });
}
document.getElementById("prevReel").addEventListener("click", () => stepReel(-1));
document.getElementById("nextReel").addEventListener("click", () => stepReel(1));
gallery.addEventListener("scroll", queueDepth, { passive: true });
try { setView(localStorage.getItem("reelView") || "gallery"); } catch (e) {}


// =====================================
// BACK TO TOP + KEYBOARD SHORTCUTS
// =====================================
const toTop = document.getElementById("toTop");
addEventListener("scroll", () => toTop.classList.toggle("show", scrollY > 700), { passive: true });
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

addEventListener("keydown", e => {
    if (e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    const k = e.key.toLowerCase();
    if (k === "t") themeBtn.click();
    else if (k === "g") setView(gallery.classList.contains("cinema") ? "gallery" : "cinema");
    else if (k === "f") favBtn.click();
    else if (k === "arrowright" && gallery.classList.contains("cinema")) stepReel(1);
    else if (k === "arrowleft" && gallery.classList.contains("cinema")) stepReel(-1);
    else if (k === "escape") accentWrap.classList.remove("open");
});
