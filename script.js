/* ============================================================
   Andrew Godwin — Portfolio interactivity
   Lightweight vanilla JS. No dependencies.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. Mobile navigation toggle ---------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  hamburger.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the mobile menu when a link is chosen
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // Close if viewport resized back to desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) closeMenu();
  });

  /* ---------- 2. Smooth scrolling (CSS handles it; JS fallback + offset) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return; // placeholder links do nothing
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector(".navbar").offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navH - 8;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ---------- 3. Active navigation highlighting ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navAnchors = Array.from(document.querySelectorAll(".nav-link"));
  const navbar = document.getElementById("navbar");
  const backToTop = document.getElementById("backToTop");

  function onScroll() {
    const scrollPos = window.pageYOffset;

    // Navbar shadow state
    navbar.classList.toggle("scrolled", scrollPos > 10);

    // Back-to-top visibility
    backToTop.classList.toggle("show", scrollPos > 480);

    // Highlight the section currently in view
    const offset = navbar.offsetHeight + 40;
    let currentId = sections[0] ? sections[0].id : null;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= offset) {
        currentId = section.id;
      }
    }
    navAnchors.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });
  }

  let ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ---------- 4. Scroll-triggered section animations ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 5. Dynamic copyright year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 6. Back-to-top button ---------- */
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
