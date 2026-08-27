(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll Reveal
  const revealItems = document.querySelectorAll(".reveal, [data-reveal], section, .card");

  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px"
    });

    revealItems.forEach(el => {
      el.classList.add("js-reveal");
      revealObserver.observe(el);
    });
  } else {
    revealItems.forEach(el => el.classList.add("is-visible"));
  }

  // Scroll Progress
  const progressBar = document.querySelector("[data-scroll-progress]");

  function updateScrollProgress() {
    if (!progressBar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.width = progress + "%";
  }

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Active Navigation
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const sections = [...navLinks]
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navLinks.forEach(link => link.classList.remove("active"));

        const active = document.querySelector(`a[href="#${entry.target.id}"]`);
        if (active) active.classList.add("active");
      });
    }, {
      rootMargin: "-35% 0px -55% 0px"
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Smooth Scroll
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });

      history.replaceState(null, "", link.getAttribute("href"));
    });
  });

  // Button Interaction
  if (!reduceMotion) {
    document.querySelectorAll("button, .btn, .button, [data-magnetic]").forEach(btn => {
      btn.addEventListener("pointermove", e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
      });

      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  // Cursor Light
  if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener("pointermove", e => {
      mx = e.clientX;
      my = e.clientY;
    });

    function animate() {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;

      document.documentElement.style.setProperty("--cursor-x", cx + "px");
      document.documentElement.style.setProperty("--cursor-y", cy + "px");

      requestAnimationFrame(animate);
    }

    animate();
  }

  // Escape Blur
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") document.activeElement?.blur();
  });

  document.documentElement.classList.add("js-ready");
})();
