document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggler --- (Aapka existing code)
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    

    // --- Form & Modal Logic ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Attach close handlers for the custom modal
    const modalOverlay = document.getElementById('status-modal');
    const modalButton = document.getElementById('modal-button');
    
    modalButton.addEventListener('click', () => modalOverlay.classList.remove('visible'));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('visible');
        }
    });
});

const gallery = document.getElementById('gallery');
    const galleryItems = document.querySelectorAll('.photo-gallery-grid a');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% item visible hone par trigger ho
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate items one by one
                galleryItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 120); // Har item 120ms ke delay se aayega
                });
                // Animate hone ke baad observer ko stop kar dein
                observer.unobserve(gallery);
            }
        });
    }, observerOptions);

    if (gallery) {
        observer.observe(gallery);
    }
});


/* --- Custom Modal Function --- */
function showModal(message, isSuccess = true) {
    const modalOverlay = document.getElementById('status-modal');
    const modalIcon = document.getElementById('modal-icon');
    const modalMessage = document.getElementById('modal-message');

    modalMessage.textContent = message;

    if (isSuccess) {
        modalIcon.className = 'modal-icon success fas fa-check-circle';
    } else {
        modalIcon.className = 'modal-icon error fas fa-times-circle';
    }
    
    modalOverlay.classList.add('visible');
}

/* --- Telegram Contact Form Logic --- */
const TELEGRAM_BOT_TOKEN = "7916096761:AAEkAF0lyvzPk6uelhkDtdkdn-8x-TSlXRA"; // Replace with your token
const CHAT_ID = "6128322651"; // Replace with your chat ID

function getClientDetails() {
    const userAgent = navigator.userAgent;
    const browserMatch = userAgent.match(/(?:Chrome|Firefox|Safari|Edge|MSIE|Trident|Opera)[\/: ]([\d.]+)/);
    return {
        userAgent: userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        browser: browserMatch ? browserMatch[0] : "Unknown",
        platform: navigator.platform,
        language: navigator.language,
        deviceType: /Mobi|Android|iPhone/i.test(userAgent) ? "Mobile" : "Desktop",
    };
}

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

    const clientDetails = getClientDetails();
    const formData = { email: emailInput.value, message: messageInput.value, ...clientDetails };

    const messageText = `
PORTFOLIO NOTIFICATION
---------------------------------
📬 **Email:** ${formData.email}
📝 **Message:** ${formData.message}
---------------------------------
💻 **Device Type:** ${formData.deviceType}
🌐 **Browser:** ${formData.browser}
🖥️ **OS:** ${formData.platform}
📏 **Screen:** ${formData.screenResolution}
🗣️ **Language:** ${formData.language}
👤 **User Agent:** ${formData.userAgent}
---------------------------------
🔗 **From:** https://pranav-sharma.pages.dev
    `;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: messageText, parse_mode: 'Markdown' })
        });

        if (response.ok) {
            showModal("Message sent successfully! Thank you for reaching out.", true);
            form.reset();
        } else {
            const errorData = await response.json();
            console.error("Telegram API Error:", errorData.description);
            showModal(`Failed to send the message: ${errorData.description}`, false);
        }
    } catch (error) {
        console.error("Network or script error:", error);
        showModal("An error occurred. Please check your connection and try again.", false);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send';
    }
}
