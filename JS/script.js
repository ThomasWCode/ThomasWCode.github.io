window.onload = () => {
  document.body.style.opacity = 1;
};

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

document.getElementById('contactForm').addEventListener('submit', async function(e) {
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

document.getElementById('sendAnotherBtn').addEventListener('click', function() {
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

function showStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
    
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

document.getElementById('contactForm').addEventListener('reset', function() {
    document.getElementById('formStatus').style.display = 'none';
    resetButton();
});