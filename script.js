const scrollTopBtn = document.getElementById('scrollTop');

window.onscroll = function() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Fade in when page loads
window.onload = () => {
  document.body.style.opacity = 1;
};

// Fade out before navigating away
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", e => {
      // Skip fade if link contains a #
      if (link.href.includes("#")) return;

      if (link.hostname === window.location.hostname) {
        e.preventDefault();
        document.body.style.opacity = 0;
        setTimeout(() => {
          window.location = link.href;
        }, 500); // match transition
      }
    });
  });
});