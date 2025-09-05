document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggler ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Interactive Background Orbs ---
    const orbs = document.querySelectorAll('.orb');
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth) * 100;
        const y = (clientY / window.innerHeight) * 100;

        orbs[0].style.transform = `translate(${x / 2}%, ${y / 2}%)`;
        orbs[1].style.transform = `translate(${100 - x}%, ${y / 1.5}%)`;
        orbs[2].style.transform = `translate(${x / 3}%, ${100 - y}%)`;
    });

    // --- Typing Animation ---
    const typingText = document.getElementById('typing-text');
    const words = ["Web Developer.", "AI Enthusiast.", "Student Programmer."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        const displayedText = isDeleting
            ? currentWord.substring(0, charIndex--)
            : currentWord.substring(0, charIndex++);
        
        typingText.textContent = displayedText;

        if (!isDeleting && charIndex === currentWord.length + 1) {
            isDeleting = true;
            setTimeout(type, 2000); // Pause before deleting
        } else if (isDeleting && charIndex === -1) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500); // Pause before typing next word
        } else {
            const typingSpeed = isDeleting ? 75 : 150;
            setTimeout(type, typingSpeed);
        }
    }
    if (typingText) {
        type();
    }

    // --- Lazy Load Animation for Gallery ---
    const gallery = document.getElementById('gallery');
    const galleryItems = document.querySelectorAll('.photo-gallery-grid a');
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            galleryItems.forEach((item, index) => {
                setTimeout(() => item.classList.add('visible'), index * 120);
            });
            observer.unobserve(gallery);
        }
    }, { threshold: 0.1 });
    if (gallery) {
        observer.observe(gallery);
    }

    // --- Form & Modal Logic ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    const modalOverlay = document.getElementById('status-modal');
    const modalButton = document.getElementById('modal-button');
    modalButton.addEventListener('click', () => modalOverlay.classList.remove('visible'));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('visible');
    });
});

/* --- Custom Modal & Telegram Logic --- */
function showModal(message, isSuccess = true) {
    const modalOverlay = document.getElementById('status-modal');
    const modalIcon = document.getElementById('modal-icon');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modalIcon.className = isSuccess ? 'modal-icon success fas fa-check-circle' : 'modal-icon error fas fa-times-circle';
    modalOverlay.classList.add('visible');
}

const TELEGRAM_BOT_TOKEN = "7916096761:AAEkAF0lyvzPk6uelhkDtdkdn-8x-TSlXRA";
const CHAT_ID = "6128322651";

async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!emailInput.value.trim() || !messageInput.value.trim()) {
        showModal("Please fill in both email and message fields.", false);
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    const clientDetails = (() => { /* Self-invoking function for details */
        const ua = navigator.userAgent;
        return {
            browser: (ua.match(/(?:Chrome|Firefox|Safari|Edge|MSIE|Trident|Opera)[\/: ]([\d.]+)/) || [])[0] || "Unknown",
            os: navigator.platform,
            device: /Mobi|Android|iPhone/i.test(ua) ? "Mobile" : "Desktop",
        };
    })();

    const messageText = `
PORTFOLIO NOTIFICATION
---------------------------------
📬 **Email:** ${emailInput.value}
📝 **Message:** ${messageInput.value}
---------------------------------
💻 **Device:** ${clientDetails.device} (${clientDetails.os})
🌐 **Browser:** ${clientDetails.browser}
---------------------------------
🔗 **From:** https://pranav-sharma.pages.dev
    `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: messageText, parse_mode: 'Markdown' })
        });

        if (response.ok) {
            showModal("Message sent successfully! Thank you for reaching out.", true);
            form.reset();
        } else {
            const errorData = await response.json();
            showModal(`Failed to send message: ${errorData.description}`, false);
        }
    } catch (error) {
        showModal("An error occurred. Please check your connection.", false);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send';
    }
}
