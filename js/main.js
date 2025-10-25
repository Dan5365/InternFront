document.addEventListener("DOMContentLoaded", () => {
  /* ==============================
     ELEMENTS
  ============================== */
  const video = document.getElementById("bg-video");
  const burger = document.getElementById("burger");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const progress = document.getElementById("progress");
  const sections = document.querySelectorAll("section[id]");
  const numbers = document.querySelectorAll(".number");
  const scrollBtn = document.getElementById("scrollTopBtn");

  /* ==============================
     BURGER MENU
  ============================== */
  if (burger && navMenu) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      navMenu.classList.toggle("open");
    });

    navLinks.forEach((link) =>
      link.addEventListener("click", () => {
        burger.classList.remove("active");
        navMenu.classList.remove("open");
      })
    );
  }

  /* ==============================
     STATS COUNTER
  ============================== */
  const animateNumber = (el) => {
    const target = +el.dataset.target || 0;
    let count = 0;
    const duration = 1500;
    const stepTime = 15;
    const step = target / (duration / stepTime);

    const interval = setInterval(() => {
      count += step;
      if (count >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(interval);
      } else {
        el.textContent = Math.ceil(count).toLocaleString();
      }
    }, stepTime);
  };

  if (numbers.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNumber(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    numbers.forEach((number) => observer.observe(number));
  }

  /* ==============================
     SCROLL EVENTS (THROTTLED)
  ============================== */
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  function handleScroll() {
    const scrollY = window.scrollY;

    // --- Parallax video ---
    if (video && scrollY < window.innerHeight) {
      const offset = scrollY * 0.15;
      video.style.transform = `translateY(${offset}px) scale(1.1)`;
      video.style.opacity = `${Math.max(0.35 - offset / 1000, 0.1)}`;
    }

    // --- Scroll progress ---
    if (progress) {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      progress.style.width = `${scrollPercent}%`;
    }

    // --- Active section highlight ---
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - sectionHeight / 4) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });

    // --- Scroll to top button ---
    if (scrollBtn) {
      scrollBtn.classList.toggle("show", scrollY > 400);
    }

    // --- Parallax backgrounds ---
    document.querySelectorAll(".parallax").forEach((el) => {
      const speed = 0.4;
      const offset = scrollY * speed;
      el.style.backgroundPositionY = `${offset}px`;
    });
  }

  /* ==============================
     SCROLL TO TOP BUTTON
  ============================== */
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (progress) progress.style.width = "0%";
    });
  }
});
