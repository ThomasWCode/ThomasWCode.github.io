document.addEventListener("DOMContentLoaded", () => {
  initialiseAnalytics();
  initialiseSkipLink();
  initialiseLogoAnimation();
  initialiseNavigation();
  initialiseCurrentYear();
  initialiseContactForm();
  initialiseGallery();
  initialiseYouTubeFacades();
  initialiseTrackAudio();
  initialiseInfoToggles();
});

function initialiseAnalytics() {
  let loaded = false;

  function loadAnalytics() {
    if (loaded) {
      return;
    }

    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", "G-DZEP97F05S");

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-DZEP97F05S";
    script.dataset.cookieyes = "cookieyes-analytics";
    document.head.appendChild(script);
  }

  function consentAllowsAnalytics(detail) {
    return (
      detail?.categories?.analytics === true ||
      detail?.accepted?.includes("analytics")
    );
  }

  function checkStoredConsent() {
    if (typeof window.getCkyConsent !== "function") {
      return;
    }

    try {
      if (consentAllowsAnalytics(window.getCkyConsent())) {
        loadAnalytics();
      }
    } catch {}
  }

  document.addEventListener("cookieyes_banner_load", (event) => {
    if (consentAllowsAnalytics(event.detail)) {
      loadAnalytics();
    }
  });
  document.addEventListener("cookieyes_banner_loaded", checkStoredConsent);
  document.addEventListener("cookieyes_consent_update", (event) => {
    if (consentAllowsAnalytics(event.detail)) {
      loadAnalytics();
    }
  });
  checkStoredConsent();
}

function initialiseSkipLink() {
  const skipLink = document.querySelector(".skip-link");
  const mainContent = document.getElementById("main-content");

  if (!skipLink || !mainContent) {
    return;
  }

  mainContent.setAttribute("tabindex", "-1");
  skipLink.addEventListener("click", () => {
    window.requestAnimationFrame(() => mainContent.focus());
  });
}

function initialiseLogoAnimation() {
  const logoLink = document.querySelector(".logo-link");
  const hoverVideo = document.querySelector(".logo-hover-video");
  const staticImage = document.querySelector(".logo-static");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!logoLink || !hoverVideo || !staticImage || reduceMotion.matches) {
    return;
  }

  logoLink.addEventListener("mouseenter", () => {
    staticImage.style.opacity = "0";
    hoverVideo.style.opacity = "1";
    hoverVideo.currentTime = 0;
    hoverVideo.play().catch(() => {});
  });

  logoLink.addEventListener("mouseleave", () => {
    hoverVideo.style.opacity = "0";
    staticImage.style.opacity = "1";

    window.setTimeout(() => {
      hoverVideo.pause();
      hoverVideo.currentTime = 0;
    }, 220);
  });
}

function initialiseNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const navPanel = document.querySelector(".nav-panel");
  const moreToggle = document.querySelector(".more-toggle");
  const moreMenu = document.querySelector(".more-menu");
  const desktopQuery = window.matchMedia("(min-width: 1025px)");

  if (!navToggle || !navPanel || !moreToggle || !moreMenu) {
    return;
  }

  function setNavState(open) {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );
    navPanel.hidden = !open;
  }

  function setMoreState(open) {
    moreToggle.setAttribute("aria-expanded", String(open));
    moreMenu.hidden = !open;
  }

  function syncNavigation() {
    if (desktopQuery.matches) {
      navPanel.hidden = false;
      setMoreState(false);
    } else {
      setNavState(false);
      moreMenu.hidden = false;
    }
  }

  navToggle.addEventListener("click", () => {
    setNavState(navToggle.getAttribute("aria-expanded") !== "true");
  });

  moreToggle.addEventListener("click", () => {
    setMoreState(moreToggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("click", (event) => {
    if (desktopQuery.matches && !event.target.closest(".nav-more")) {
      setMoreState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (
      desktopQuery.matches &&
      moreToggle.getAttribute("aria-expanded") === "true"
    ) {
      setMoreState(false);
      moreToggle.focus();
    } else if (
      !desktopQuery.matches &&
      navToggle.getAttribute("aria-expanded") === "true"
    ) {
      setNavState(false);
      navToggle.focus();
    }
  });

  navPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!desktopQuery.matches) {
        setNavState(false);
      }
    });
  });

  desktopQuery.addEventListener("change", syncNavigation);
  syncNavigation();
}

function initialiseCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

function initialiseContactForm() {
  const form = document.getElementById("contactForm");

  if (!form) {
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  const formStatus = document.getElementById("formStatus");
  const thankYouMessage = document.getElementById("thankYouMessage");
  const spamBlockedMessage = document.getElementById("spamBlockedMessage");
  const sendAnotherButton = document.getElementById("sendAnotherBtn");
  const tryAgainButton = document.getElementById("tryAgainBtn");

  function resetButton() {
    if (!submitButton) {
      return;
    }

    submitButton.textContent = "Send message";
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
  }

  function showStatus(message, type) {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.hidden = false;
    formStatus.focus();
  }

  function checkSpam(email, subject) {
    if (email.trim().toLowerCase() === "sales@thomaswhite.me") {
      return {
        blocked: true,
        reason: "That email address is a known automated spam source.",
        fixes: [
          "Use your own personal or business email address.",
          "If you do not want to provide an email, you can use test@gmail.com, but I will not be able to reply.",
        ],
      };
    }

    if (subject && /^\d{6,}$/.test(subject.trim())) {
      return {
        blocked: true,
        reason:
          "The subject contains only a long number, which matches a common spam pattern.",
        fixes: [
          "Write a short description of why you are getting in touch.",
          "Alternatively, use your name as the subject.",
        ],
      };
    }

    return { blocked: false };
  }

  function showSpamBlocked(result) {
    const reason = document.getElementById("spamReason");
    const fixes = document.getElementById("spamFixes");

    if (!spamBlockedMessage || !reason || !fixes) {
      return;
    }

    reason.textContent = result.reason;
    fixes.replaceChildren();
    result.fixes.forEach((fix) => {
      const item = document.createElement("li");
      item.textContent = fix;
      fixes.appendChild(item);
    });

    form.hidden = true;
    spamBlockedMessage.hidden = false;
    spamBlockedMessage.focus();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const subject = document.getElementById("subject")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim();

    if (!name || !email || !message) {
      showStatus("Please fill in all required fields.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus("Please enter a valid email address.", "error");
      return;
    }

    const spamResult = checkSpam(email, subject);
    if (spamResult.blocked) {
      showSpamBlocked(spamResult);
      return;
    }

    if (submitButton) {
      submitButton.textContent = "Sending…";
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.hidden = true;
      thankYouMessage.hidden = false;
      thankYouMessage.focus();
    } catch (error) {
      showStatus(
        "Sorry, there was a problem sending your message. Please try again and make sure the CAPTCHA is complete.",
        "error",
      );
      resetButton();
    }
  });

  sendAnotherButton?.addEventListener("click", () => {
    thankYouMessage.hidden = true;
    form.hidden = false;
    form.reset();
    resetButton();
    formStatus.hidden = true;
    document.getElementById("name")?.focus();
  });

  tryAgainButton?.addEventListener("click", () => {
    spamBlockedMessage.hidden = true;
    form.hidden = false;
    resetButton();
    formStatus.hidden = true;
    document.getElementById("subject")?.focus();
  });

  form.addEventListener("reset", () => {
    resetButton();
    formStatus.hidden = true;
  });
}

function initialiseGallery() {
  const dialog = document.getElementById("galleryDialog");
  const buttons = Array.from(document.querySelectorAll(".gallery-open"));

  if (!dialog || buttons.length === 0) {
    return;
  }

  const image = document.getElementById("dialogImage");
  const caption = document.getElementById("dialogCaption");
  const closeButton = document.getElementById("dialogClose");
  const previousButton = document.getElementById("dialogPrevious");
  const nextButton = document.getElementById("dialogNext");
  let currentIndex = 0;
  let trigger = null;

  function showImage(index) {
    currentIndex = (index + buttons.length) % buttons.length;
    const button = buttons[currentIndex];
    const thumbnail = button.querySelector("img");

    image.src = button.dataset.fullSrc || thumbnail.currentSrc || thumbnail.src;
    image.alt = thumbnail.alt;
    caption.textContent = button.dataset.caption || "";
  }

  function openDialog(index, sourceButton) {
    trigger = sourceButton;
    showImage(index);
    dialog.showModal();
    document.body.classList.add("dialog-open");
    closeButton.focus();
  }

  function closeDialog() {
    dialog.close();
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => openDialog(index, button));
  });

  previousButton.addEventListener("click", () => showImage(currentIndex - 1));
  nextButton.addEventListener("click", () => showImage(currentIndex + 1));
  closeButton.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showImage(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showImage(currentIndex + 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
    }
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    trigger?.focus();
  });
}

function initialiseYouTubeFacades() {
  document
    .querySelectorAll(".youtube-facade[data-videoid]")
    .forEach((facade) => {
      facade.addEventListener("click", () => {
        const iframe = document.createElement("iframe");
        iframe.className = "youtube-embed";
        iframe.src = `https://www.youtube.com/embed/${facade.dataset.videoid}?autoplay=1`;
        iframe.title = facade.dataset.videoTitle || "YouTube video";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        facade.replaceWith(iframe);
      });
    });
}

function initialiseTrackAudio() {
  const tracks = Array.from(document.querySelectorAll(".track-audio"));
  const toast = document.getElementById("playback-toast");

  tracks.forEach((track) => {
    track.addEventListener("ratechange", () => {
      if (track.playbackRate !== 1) {
        track.playbackRate = 1;
        if (toast) {
          toast.classList.add("show");
          window.setTimeout(() => toast.classList.remove("show"), 2200);
        }
      }
    });

    track.addEventListener("play", () => {
      tracks
        .filter((otherTrack) => otherTrack !== track)
        .forEach((otherTrack) => otherTrack.pause());
    });
  });
}

function initialiseInfoToggles() {
  document.querySelectorAll("[data-info-toggle]").forEach((toggle) => {
    const target = document.getElementById(
      toggle.getAttribute("aria-controls"),
    );

    if (!target) {
      return;
    }

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      target.hidden = !open;
    });
  });
}
