//FADE IN/OUT
window.addEventListener("pageshow", () => {
  document.body.style.opacity = 1;
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", e => {
      if (link.hostname === window.location.hostname) {
        e.preventDefault();
        document.body.style.opacity = 0;
        setTimeout(() => {
          window.location = link.href;
        }, 500);
      }
    });
  });
});

//LOADING SCREEN (WITH GIF)
window.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loading-screen");
    const gif = document.getElementById("loading-gif");

    // Detect if coming from same domain
    const ref = document.referrer;
    const sameDomain = ref && ref.includes(window.location.hostname);

    // If same site navigation, hide loader immediately
    if (sameDomain) {
        loader.style.display = "none";
        return;
    }

    // Otherwise show loader normally
    const newSrc = `/logo-animation-one-loop.gif?t=${Date.now()}`;
    gif.style.opacity = "0";
    gif.src = newSrc;

    gif.addEventListener("load", () => {
        gif.style.opacity = "1";

        const gifDuration = 1530; // change to actual animation length (ms)

        setTimeout(() => {
            loader.classList.add("fade-out");
            setTimeout(() => loader.style.display = "none", 800);
        }, gifDuration + 500);
    });
});

//STICKY NAV LINKS ON MOBILE
document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth <= 768) {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const navLinksRect = navLinks.getBoundingClientRect();
      
      // When nav-links reach the top of the viewport, make them sticky
      if (navLinksRect.top <= 0 && !navLinks.classList.contains('sticky')) {
        navLinks.classList.add('sticky');
      } 
      // When scrolling back up, remove sticky when we're back to the original position
      else if (scrollTop <= navbar.offsetTop && navLinks.classList.contains('sticky')) {
        navLinks.classList.remove('sticky');
      }
    });
  }
});

//CONTACT FORM
if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    const subjectField = document.getElementById("subject");
    if (subjectField) {
        subjectField.placeholder = "Tell me something interesting!";
    }
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formStatus = document.getElementById('formStatus');
        const submitBtn = document.querySelector('.btn-primary');
        const form = document.getElementById('contactForm');
        const thankYouMessage = document.getElementById('thankYouMessage');
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (!name || !email || !message) {
            showStatus('Please fill in all required fields.', 'error');
            resetButton();
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showStatus('Please enter a valid email address.', 'error');
            resetButton();
            return;
        }
        
        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                form.classList.add('form-fade-out');
                
                setTimeout(() => {
                    form.style.display = 'none';
                    thankYouMessage.style.display = 'block';
                    
                    setTimeout(() => {
                        thankYouMessage.classList.add('show');
                    }, 50);
                }, 500);
                
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            showStatus('Sorry, there was a problem sending your message. Please try again.', 'error');
            resetButton();
        }
    });
}

const sendAnotherBtn = document.getElementById('sendAnotherBtn');
if (sendAnotherBtn) {
    sendAnotherBtn.addEventListener('click', function() {
        const form = document.getElementById('contactForm');
        const thankYouMessage = document.getElementById('thankYouMessage');
        
        thankYouMessage.classList.remove('show');
        
        setTimeout(() => {
            thankYouMessage.style.display = 'none';
            form.style.display = 'block';
            form.classList.remove('form-fade-out');
            form.reset();
            resetButton();
            
            document.getElementById('formStatus').style.display = 'none';
        }, 500);
    });
}

function showStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }
}

function resetButton() {
    const submitBtn = document.querySelector('.btn-primary');
    if (submitBtn) {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }
}

if (contactForm) {
    contactForm.addEventListener('reset', function() {
        const formStatus = document.getElementById('formStatus');
        if (formStatus) {
            formStatus.style.display = 'none';
        }
        resetButton();
    });
}

//Open all projects in github
function openLinks() {
  const links = [
    "https://techassistuk.vercel.app/",
    "https://github.com/ThomasWCode/SplitMate",
    "https://github.com/ThomasWCode/Chrome-Dino",
    "https://github.com/ThomasWCode/Game-Of-Life",
    "https://github.com/ThomasWCode/Minesweeper",
    "https://github.com/ThomasWCode/Bouncing-Ball-Physics-Simulation",
  ];

  links.forEach(url => {
    window.open(url, "_blank", "noopener noreferrer");
  });
}

//FULL SCREEN VIEW OF IMAGES ON GALLERY
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create fullscreen modal
    const modal = document.createElement('div');
    modal.className = 'fullscreen-modal';
    modal.innerHTML = `
        <button class="close-btn" aria-label="Close fullscreen">×</button>
        <div class="fullscreen-content">
            <img src="" alt="">
            <div class="fullscreen-caption"></div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add expand buttons to all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        const expandBtn = document.createElement('button');
        expandBtn.className = 'expand-btn';
        expandBtn.innerHTML = '⛶ Expand';
        expandBtn.setAttribute('aria-label', 'Expand image to fullscreen');
        item.appendChild(expandBtn);

        // Click handler for expand button
        expandBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openFullscreen(item);
        });

        // Click handler for the entire gallery item
        item.addEventListener('click', function() {
            openFullscreen(item);
        });
    });

    // Function to open fullscreen
    function openFullscreen(item) {
        const img = item.querySelector('img');
        const caption = item.querySelector('.caption');
        
        const modalImg = modal.querySelector('.fullscreen-content img');
        const modalCaption = modal.querySelector('.fullscreen-caption');
        
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalCaption.textContent = caption ? caption.textContent : '';
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Function to close fullscreen
    function closeFullscreen() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Close button handler
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', closeFullscreen);

    // Close when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeFullscreen();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeFullscreen();
        }
    });
});