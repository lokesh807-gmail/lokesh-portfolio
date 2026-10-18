const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#nav-links");
const backToTop = document.querySelector(".back-to-top");
const scrollProgress = document.querySelector("#scroll-progress");
const navLinks = navigation ? [...navigation.querySelectorAll('a[href^="#"]')] : [];

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
}

function setActiveNavigation(sectionId) {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${sectionId}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navigation.classList.toggle("is-open", !isOpen);
    if (!isOpen) navigation.querySelector("a")?.focus({ preventScroll: true });
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      const menuWasOpen = menuButton.getAttribute("aria-expanded") === "true";
      closeMenu();
      if (menuWasOpen && window.innerWidth <= 767) menuButton.focus({ preventScroll: true });
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus({ preventScroll: true });
    }
  });

  document.addEventListener("click", (event) => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 767) closeMenu();
  });
}

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());

const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

let revealObserver;
let intersectionObserverAvailable = typeof window.IntersectionObserver === "function";
const showAllRevealItems = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  revealObserver?.disconnect();
};

if (intersectionObserverAvailable && !reducedMotionPreference.matches) {
  try {
    revealObserver = new IntersectionObserver((entries, observer) => {
      try {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      } catch (error) {
        console.error("Reveal observer failed; keeping all content visible.", error);
        showAllRevealItems();
      }
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
    document.querySelectorAll(".hero .reveal").forEach((item) => {
      item.classList.add("is-visible");
      revealObserver.unobserve(item);
    });
    document.documentElement.classList.add("js-enabled");
  } catch (error) {
    intersectionObserverAvailable = false;
    showAllRevealItems();
    console.error("Reveal animation setup failed; keeping all content visible.", error);
  }
} else {
  showAllRevealItems();
}

let activeSectionObserver;
if (intersectionObserverAvailable && navLinks.length) {
  try {
    activeSectionObserver = new IntersectionObserver((entries) => {
      const visibleSections = entries.filter((entry) => entry.isIntersecting);
      if (visibleSections.length) {
        visibleSections.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        setActiveNavigation(visibleSections[0].target.id);
      }
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.15, 0.4] });

    sections.forEach((section) => activeSectionObserver.observe(section));
  } catch (error) {
    activeSectionObserver?.disconnect();
    setActiveNavigation("home");
    console.error("Section navigation observer setup failed; using the home link.", error);
  }
} else {
  setActiveNavigation("home");
}

if (backToTop || scrollProgress) {
  let scrollUpdatePending = false;
  const updateScrollIndicators = () => {
    if (scrollUpdatePending) return;
    scrollUpdatePending = true;
    window.requestAnimationFrame(() => {
      const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableDistance > 0 ? window.scrollY / scrollableDistance : 0;
      if (scrollProgress) scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
      if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 480);
      scrollUpdatePending = false;
    });
  };

  updateScrollIndicators();
  window.addEventListener("scroll", updateScrollIndicators, { passive: true });
  window.addEventListener("resize", updateScrollIndicators, { passive: true });
}

if (revealObserver) {
  window.setTimeout(() => {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((item) => {
      item.classList.add("is-visible");
    });
    revealObserver.disconnect();
  }, 4000);
}

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const ambientCanvas = document.querySelector("#ambient-canvas");
const portraitVisual = document.querySelector(".hero-visual");
const magneticButton = document.querySelector(".hero-actions .button-primary");

if (finePointer && !reducedMotionPreference.matches) {
  document.documentElement.classList.add("motion-pointer");

  if (ambientCanvas instanceof HTMLCanvasElement) {
    const context = ambientCanvas.getContext("2d");

    if (context) {
      let particles = [];
      let canvasWidth = 0;
      let canvasHeight = 0;
      let pixelRatio = 1;
      let animationFrame = 0;
      let lastFrameTime = 0;
      let pointerX = -1000;
      let pointerY = -1000;
      const frameInterval = 1000 / 30;

      const resizeAmbientCanvas = () => {
        if (window.innerWidth < 768) {
          ambientCanvas.hidden = true;
          if (animationFrame) window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
          context.clearRect(0, 0, canvasWidth, canvasHeight);
          return;
        }

        ambientCanvas.hidden = false;
        pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        ambientCanvas.width = Math.round(canvasWidth * pixelRatio);
        ambientCanvas.height = Math.round(canvasHeight * pixelRatio);
        ambientCanvas.style.width = `${canvasWidth}px`;
        ambientCanvas.style.height = `${canvasHeight}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const particleCount = Math.min(58, Math.max(22, Math.round(canvasWidth / 24)));
        particles = Array.from({ length: particleCount }, () => ({
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          vx: (Math.random() - 0.5) * 0.24,
          vy: (Math.random() - 0.5) * 0.24,
          radius: 0.7 + Math.random() * 1.2,
          phase: Math.random() * Math.PI * 2,
          teal: Math.random() > 0.55
        }));
      };

      const drawAmbientCanvas = (time) => {
        animationFrame = 0;
        if (document.hidden) return;
        if (time - lastFrameTime < frameInterval) {
          animationFrame = window.requestAnimationFrame(drawAmbientCanvas);
          return;
        }
        lastFrameTime = time;
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        const traceWidth = Math.min(220, canvasWidth * 0.22);
        const traceHeight = 72;
        const traceOriginX = canvasWidth * 0.71;
        const traceOriginY = canvasHeight * 0.7;
        const traceShape = [[0, .64], [.22, .44], [.48, .56], [.73, .27], [1, .39]];
        const traceCoordinates = traceShape.map(([x, y]) => [
          traceOriginX + traceWidth * x,
          traceOriginY + traceHeight * y + Math.sin(time * .00035 + x * 3) * 2
        ]);
        context.beginPath();
        traceCoordinates.forEach(([x, y], index) => {
          if (index === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });
        context.strokeStyle = "rgba(53, 242, 161, .13)";
        context.lineWidth = 1;
        context.stroke();
        traceCoordinates.forEach(([x, y]) => {
          context.beginPath();
          context.arc(x, y, 1.5, 0, Math.PI * 2);
          context.fillStyle = "rgba(94, 235, 196, .34)";
          context.fill();
        });
        const traceProgress = (time % 5200) / 5200;
        const traceSegment = Math.min(traceCoordinates.length - 2, Math.floor(traceProgress * (traceCoordinates.length - 1)));
        const traceSegmentProgress = traceProgress * (traceCoordinates.length - 1) - traceSegment;
        const traceStart = traceCoordinates[traceSegment];
        const traceEnd = traceCoordinates[traceSegment + 1];
        context.beginPath();
        context.arc(
          traceStart[0] + (traceEnd[0] - traceStart[0]) * traceSegmentProgress,
          traceStart[1] + (traceEnd[1] - traceStart[1]) * traceSegmentProgress,
          2,
          0,
          Math.PI * 2
        );
        context.fillStyle = "rgba(99, 255, 204, .65)";
        context.fill();

        particles.forEach((particle, index) => {
          const dx = pointerX - particle.x;
          const dy = pointerY - particle.y;
          const distanceToPointer = Math.hypot(dx, dy);
          if (distanceToPointer < 150 && distanceToPointer > 0) {
            const attraction = (1 - distanceToPointer / 150) * 0.003;
            particle.vx += dx / distanceToPointer * attraction;
            particle.vy += dy / distanceToPointer * attraction;
          }

          particle.vx = Math.max(-0.3, Math.min(0.3, particle.vx * 0.995));
          particle.vy = Math.max(-0.3, Math.min(0.3, particle.vy * 0.995));
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < -5) particle.x = canvasWidth + 5;
          if (particle.x > canvasWidth + 5) particle.x = -5;
          if (particle.y < -5) particle.y = canvasHeight + 5;
          if (particle.y > canvasHeight + 5) particle.y = -5;

          const pulse = 0.7 + Math.sin(time * 0.0006 + particle.phase) * 0.16;
          context.beginPath();
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          context.fillStyle = particle.teal
            ? `rgba(79, 218, 199, ${0.42 * pulse})`
            : `rgba(53, 242, 161, ${0.43 * pulse})`;
          context.fill();

          for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
            const other = particles[nextIndex];
            const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
            if (distance < 112) {
              context.beginPath();
              context.moveTo(particle.x, particle.y);
              context.lineTo(other.x, other.y);
              context.strokeStyle = `rgba(69, 205, 178, ${(1 - distance / 112) * 0.12})`;
              context.lineWidth = 0.7;
              context.stroke();
            }
          }
        });

        animationFrame = window.requestAnimationFrame(drawAmbientCanvas);
      };

      const startAmbientCanvas = () => {
        if (document.hidden || ambientCanvas.hidden || animationFrame) return;
        animationFrame = window.requestAnimationFrame(drawAmbientCanvas);
      };

      resizeAmbientCanvas();
      startAmbientCanvas();
      window.addEventListener("resize", () => {
        resizeAmbientCanvas();
        startAmbientCanvas();
      }, { passive: true });
      document.addEventListener("visibilitychange", startAmbientCanvas);
      window.addEventListener("pointermove", (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
      }, { passive: true });
      window.addEventListener("pointerout", (event) => {
        if (!event.relatedTarget) {
          pointerX = -1000;
          pointerY = -1000;
        }
      }, { passive: true });
    }
  }

  const cursorGlow = document.querySelector("#cursor-glow");
  if (cursorGlow) {
    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.transform = `translate3d(${event.clientX - 150}px, ${event.clientY - 150}px, 0)`;
    }, { passive: true });
  }

  if (portraitVisual) {
    portraitVisual.classList.add("is-tilt-ready");
    portraitVisual.addEventListener("pointermove", (event) => {
      const bounds = portraitVisual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      portraitVisual.style.setProperty("--portrait-tilt-x", `${(0.5 - y) * 4}deg`);
      portraitVisual.style.setProperty("--portrait-tilt-y", `${(x - 0.5) * 5}deg`);
    }, { passive: true });
    portraitVisual.addEventListener("pointerleave", () => {
      portraitVisual.style.setProperty("--portrait-tilt-x", "0deg");
      portraitVisual.style.setProperty("--portrait-tilt-y", "0deg");
    });
  }

  document.querySelectorAll(".project-card").forEach((card) => {
    card.classList.add("is-tilt-ready");
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty("--card-tilt-x", `${(0.5 - y) * 3}deg`);
      card.style.setProperty("--card-tilt-y", `${(x - 0.5) * 3}deg`);
      card.style.setProperty("--reflection-x", `${x * 100}%`);
      card.style.setProperty("--reflection-y", `${y * 100}%`);
    }, { passive: true });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--card-tilt-x", "0deg");
      card.style.setProperty("--card-tilt-y", "0deg");
    });
  });

  document.querySelectorAll(".skill-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--reflection-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
      card.style.setProperty("--reflection-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
    }, { passive: true });
  });

  if (magneticButton) {
    magneticButton.classList.add("is-magnetic");
    magneticButton.addEventListener("pointermove", (event) => {
      const bounds = magneticButton.getBoundingClientRect();
      const offsetX = (event.clientX - bounds.left - bounds.width / 2) / bounds.width;
      const offsetY = (event.clientY - bounds.top - bounds.height / 2) / bounds.height;
      magneticButton.style.setProperty("--magnetic-x", `${offsetX * 5}px`);
      magneticButton.style.setProperty("--magnetic-y", `${offsetY * 4}px`);
    }, { passive: true });
    magneticButton.addEventListener("pointerleave", () => {
      magneticButton.style.setProperty("--magnetic-x", "0px");
      magneticButton.style.setProperty("--magnetic-y", "0px");
    });
  }
}

const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");
const linkedinSuccess = document.querySelector("#linkedin-success");

if (contactForm && contactStatus) {
  const submitButton = contactForm.querySelector(".contact-submit");
  const submitLabel = contactForm.querySelector(".submit-label");
  const requiredTextFields = ["name", "company"].map((name) => contactForm.elements.namedItem(name));
  let isSubmitting = false;

  function showContactStatus(message, status) {
    contactStatus.textContent = message;
    contactStatus.classList.toggle("is-success", status === "success");
    contactStatus.classList.toggle("is-error", status === "error");
  }

  contactForm.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      event.target.setCustomValidity("");
    }
    if (contactStatus.classList.contains("is-error")) showContactStatus("", "");
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting || !submitButton || !submitLabel) return;

    requiredTextFields.forEach((field) => {
      if (field instanceof HTMLInputElement) {
        field.setCustomValidity(field.value.trim() ? "" : "Please enter this required field.");
      }
    });

    if (!contactForm.reportValidity()) return;

    const endpoint = new URL(contactForm.action);
    if (endpoint.protocol !== "https:" || endpoint.hostname !== "formspree.io" || !/^\/f\/[A-Za-z0-9]+$/.test(endpoint.pathname)) {
      showContactStatus("The inquiry form isn't connected yet. Please email lokeshkumartalluri1212@gmail.com while it's being configured.", "error");
      contactStatus.focus();
      return;
    }

    const formData = new FormData(contactForm);
    const honeypotValue = String(formData.get("_gotcha") || "").trim();
    if (honeypotValue) {
      showContactStatus("Your inquiry could not be sent. Please try again or contact me by email.", "error");
      contactStatus.focus();
      return;
    }

    for (const fieldName of ["name", "company", "email", "phone", "message"]) {
      const fieldValue = formData.get(fieldName);
      if (typeof fieldValue === "string") formData.set(fieldName, fieldValue.trim());
    }

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.classList.add("is-loading");
    contactForm.setAttribute("aria-busy", "true");
    submitLabel.textContent = "Sending...";
    showContactStatus("", "");
    if (linkedinSuccess) linkedinSuccess.hidden = true;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(endpoint.href, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
        signal: controller.signal
      });

      if (!response.ok) {
        showContactStatus("Your inquiry could not be sent. Please try again, or email me directly at lokeshkumartalluri1212@gmail.com.", "error");
        contactStatus.focus();
        return;
      }

      contactForm.reset();
      showContactStatus("Thank you for reaching out! Your inquiry has been submitted successfully. I'll get back to you soon.", "success");
      if (linkedinSuccess) linkedinSuccess.hidden = false;
      contactStatus.focus();
    } catch {
      showContactStatus("We couldn't reach the submission service. Please check your connection and try again, or email me directly at lokeshkumartalluri1212@gmail.com.", "error");
      contactStatus.focus();
    } finally {
      window.clearTimeout(timeoutId);
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.classList.remove("is-loading");
      contactForm.removeAttribute("aria-busy");
      submitLabel.textContent = "Send Inquiry";
    }
  });
}
