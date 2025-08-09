/* --- Theme Toggler & Core UI Logic --- */
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Set theme on initial load by checking localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark theme
    htmlEl.setAttribute('data-theme', savedTheme);

    // Handle theme toggle click
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme); // Save the user's preference
    });

    // Attach form submission handler to the contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});


/* --- Telegram Contact Form Logic --- */

const TELEGRAM_BOT_TOKEN = "7916096761:AAEkAF0lyvzPk6uelhkDtdkdn-8x-TSlXRA";
const CHAT_ID = "6128322651";

/**
 * Gathers relevant browser and device details without external IP lookups.
 * This is lightweight and respects user privacy.
 * @returns {object} An object containing client-side details.
 */
function getClientDetails() {
    const userAgent = navigator.userAgent;
    // A more robust regex to capture various browser names and versions
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

/**
 * Asynchronously handles the form submission event.
 * @param {Event} event The form submission event.
 */
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default page reload action

    const form = event.target;
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    const submitButton = form.querySelector('button[type="submit"]');

    // Basic validation to ensure fields are not empty
    if (!emailInput.value.trim() || !messageInput.value.trim()) {
        alert("Please fill in both email and message fields.");
        return;
    }

    // Provide user feedback and prevent multiple submissions
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Gather all data into one object
    const clientDetails = getClientDetails();
    const formData = {
        email: emailInput.value,
        message: messageInput.value,
        ...clientDetails // Use the spread operator to combine objects
    };

    // Construct a clean, readable message for Telegram
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
        // Use async/await for cleaner asynchronous code
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: messageText,
                parse_mode: 'Markdown' // Use Markdown for bolding text
            })
        });

        if (response.ok) {
            alert("Message sent successfully! Thank you for reaching out.");
            form.reset(); // Clear the form fields on success
        } else {
            // Provide more specific feedback if the API call fails
            const errorData = await response.json();
            console.error("Telegram API Error:", errorData.description);
            alert(`Failed to send the message: ${errorData.description}`);
        }
    } catch (error) {
        // Handle network errors (e.g., no internet connection)
        console.error("Network or script error:", error);
        alert("An error occurred. Please check your internet connection and try again.");
    } finally {
        // Re-enable the button in all cases (success, API error, or network error)
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
    }
}