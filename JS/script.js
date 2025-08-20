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

// Enhanced form handling with Formspree (AJAX submission)
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission
    
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.querySelector('.btn-primary');
    const form = document.getElementById('contactForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Basic validation
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (!name || !email || !message) {
        showStatus('Please fill in all required fields.', 'error');
        resetButton();
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        resetButton();
        return;
    }
    
    try {
        // Submit form data to Formspree using fetch
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Fade out form and show thank you message
            form.classList.add('form-fade-out');
            
            setTimeout(() => {
                form.style.display = 'none';
                thankYouMessage.style.display = 'block';
                
                // Trigger fade in animation
                setTimeout(() => {
                    thankYouMessage.classList.add('show');
                }, 50);
            }, 500); // Wait for fade out to complete
            
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        showStatus('Sorry, there was a problem sending your message. Please try again.', 'error');
        resetButton();
    }
});

// Send another message button
document.getElementById('sendAnotherBtn').addEventListener('click', function() {
    const form = document.getElementById('contactForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    // Fade out thank you message
    thankYouMessage.classList.remove('show');
    
    setTimeout(() => {
        thankYouMessage.style.display = 'none';
        form.style.display = 'block';
        form.classList.remove('form-fade-out');
        form.reset();
        resetButton();
        
        // Clear any status messages
        document.getElementById('formStatus').style.display = 'none';
    }, 500); // Wait for fade out
});

function showStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
    
    // Hide status after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
}

function resetButton() {
    const submitBtn = document.querySelector('.btn-primary');
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
}

// Form reset handling
document.getElementById('contactForm').addEventListener('reset', function() {
    document.getElementById('formStatus').style.display = 'none';
    resetButton();
});