// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.setAttribute('data-theme', body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Typing Animation
const typingText = document.querySelector('.typing-text');
const phrases = ['Web Developer', 'UI/UX Designer', 'Full-stack developer'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? 100 : 200);
    }
}

type();

// Form Handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Notification System
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Scroll Reveal Animation
window.addEventListener('scroll', reveal);

function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Project Data
const projectsData = [
    {
        id: 0,
        title: "Hostel Booking App",
        image: "https://picsum.photos/400/200?random=1",
        description: "A mobile application built with React Native and Expo that simplifies hostel booking for students. Features include real-time room availability, secure payments, and virtual room tours.",
        features: [
            "📱 Cross-platform mobile app (iOS & Android)",
            "🔐 User authentication and profiles",
            "💳 Secure payment integration",
            "🏠 Real-time room availability",
            "📸 Virtual room tours",
            "📍 Location-based search"
        ],
        techStack: ["React Native", "Expo", "Firebase", "Node.js", "Express", "Google Maps API"],
        metrics: [
            { label: "User Rating", value: "4.8/5" },
            { label: "Downloads", value: "1000+" },
            { label: "Response Time", value: "<2s" }
        ],
        githubLink: "https://github.com/yourusername/hostel-booking-app",
        linkedinLink: "https://linkedin.com/in/yourusername"
    }
    // Add more projects as needed
];

// Modal Elements
const modal = document.getElementById('projectModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalFeatures = document.getElementById('modalFeatures');
const modalTechStack = document.getElementById('modalTechStack');
const modalMetrics = document.getElementById('modalMetrics');
const modalDemoLink = document.getElementById('modalDemoLink');
const modalGithubLink = document.getElementById('modalGithubLink');

// Open Modal Function
function openProjectModal(projectId) {
    const project = projectsData[projectId];
    
    // Set modal content
    modalImage.src = project.image;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    
    // Set features
    modalFeatures.innerHTML = project.features
        .map(feature => `<li>${feature}</li>`)
        .join('');
    
    // Set tech stack
    modalTechStack.innerHTML = project.techStack
        .map(tech => `<span>${tech}</span>`)
        .join('');
    
    // Set metrics
    modalMetrics.innerHTML = project.metrics
        .map(metric => `
            <div class="metric">
                <span class="metric-number">${metric.value}</span>
                <span class="metric-label">${metric.label}</span>
            </div>
        `).join('');
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close Modal Function
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable scrolling
}

// Close modal when clicking the X
document.querySelector('.close-modal').onclick = closeModal;

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});








