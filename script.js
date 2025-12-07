// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Sticky navbar on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile navigation toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===================================
// TESTIMONIAL CAROUSEL
// ===================================
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');
const testimonialDotsContainer = document.getElementById('testimonialDots');

if (testimonialTrack) {
    const testimonials = testimonialTrack.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    // Create dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToTestimonial(index));
        testimonialDotsContainer.appendChild(dot);
    });
    
    const dots = testimonialDotsContainer.querySelectorAll('.carousel-dot');
    
    function updateTestimonial() {
        const offset = -currentTestimonial * 100;
        testimonialTrack.style.transform = `translateX(${offset}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentTestimonial);
        });
    }
    
    function goToTestimonial(index) {
        currentTestimonial = index;
        updateTestimonial();
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        updateTestimonial();
    }
    
    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        updateTestimonial();
    }
    
    if (testimonialNext) {
        testimonialNext.addEventListener('click', nextTestimonial);
    }
    
    if (testimonialPrev) {
        testimonialPrev.addEventListener('click', prevTestimonial);
    }
    
    // Auto-play carousel
    setInterval(nextTestimonial, 5000);
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all animated cards
const animatedCards = document.querySelectorAll('.card-animate');
animatedCards.forEach(card => observer.observe(card));

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===================================
// EMAILJS CONFIGURATION
// ===================================
const EMAILJS_CONFIG = {
    publicKey: 'V9rIk-StUc1fTIxC8',
    serviceId: 'service_l98zmwo',
    admissionTemplateId: 'template_rzmy8ki',
    contactTemplateId: 'template_l7ss6ml'
};

// Initialize EmailJS
(function() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
})();

// ===================================
// FORM SUBMISSION HANDLERS
// ===================================

// Helper function to show notification
function showNotification(form, message, type = 'success') {
    // Remove existing notifications
    const existingNotif = form.querySelector('.form-notification');
    if (existingNotif) existingNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = `form-notification form-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        background: ${type === 'success' ? 'var(--gold-100)' : 'var(--red-100)'};
        color: ${type === 'success' ? 'var(--primary-900)' : 'var(--red-700)'};
        padding: var(--space-md);
        border-radius: var(--radius-md);
        margin-top: var(--space-md);
        text-align: center;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    
    form.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Helper function to set button loading state
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;
        button.style.opacity = '0.7';
        button.style.cursor = 'not-allowed';
    } else {
        button.textContent = button.dataset.originalText;
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    }
}

// Admission Form Handler
const admissionForm = document.getElementById('admissionForm');
if (admissionForm) {
    admissionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true);
        
        // Prepare template parameters
        const templateParams = {
            from_name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
            user_email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            qualification: document.getElementById('qualification').value,
            percentage: document.getElementById('percentage').value,
            institution: document.getElementById('institution').value,
            course: document.getElementById('course').options[document.getElementById('course').selectedIndex].text,
            batch: document.getElementById('batch').options[document.getElementById('batch').selectedIndex].text,
            message: document.getElementById('message').value || 'No additional information provided'
        };
        
        // Send email via EmailJS
        emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.admissionTemplateId,
            templateParams
        )
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showNotification(admissionForm, 'Application submitted successfully! We will contact you soon.', 'success');
            admissionForm.reset();
            setButtonLoading(submitBtn, false);
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            showNotification(admissionForm, 'Failed to send application. Please try again or contact us directly at amicuslaw.edu@gmail.com', 'error');
            setButtonLoading(submitBtn, false);
        });
    });
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true);
        
        // Prepare template parameters
        const templateParams = {
            from_name: document.getElementById('name').value,
            user_email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            subject: document.getElementById('subject').options[document.getElementById('subject').selectedIndex].text,
            message: document.getElementById('contactMessage').value
        };
        
        // Send email via EmailJS
        emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.contactTemplateId,
            templateParams
        )
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showNotification(contactForm, 'Message sent successfully! We will respond within 24 hours.', 'success');
            contactForm.reset();
            setButtonLoading(submitBtn, false);
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            showNotification(contactForm, 'Failed to send message. Please try again or call us at +977-9867825654', 'error');
            setButtonLoading(submitBtn, false);
        });
    });
}

// ===================================
// LAZY LOADING FOR IMAGES
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add active class to current page navigation
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

console.log('Amicus Institute of Law - Website Loaded Successfully');
