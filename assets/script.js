document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THEME TOGGLER ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    const applyTheme = (theme) => {
        body.dataset.theme = theme;
        localStorage.setItem('theme', theme);
        // Update browser chrome color
        if (theme === 'dark') {
            themeMeta.setAttribute('content', '#111314');
        } else {
            themeMeta.setAttribute('content', '#F9F9F9');
        }
    };

    themeToggleButton.addEventListener('click', () => {
        const newTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // Apply saved theme on load or respect user's OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    }


    // --- 2. TABLE OF CONTENTS ACTIVE STATE HIGHLIGHTING ---
    const tocLinks = document.querySelectorAll('.c-toc a');
    const headings = Array.from(tocLinks).map(link => {
        const id = link.getAttribute('href').substring(1);
        return document.getElementById(id);
    }).filter(Boolean); // Filter out any nulls if an ID is bad

    if (tocLinks.length > 0 && headings.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const correspondingLink = document.querySelector(`.c-toc a[href="#${id}"]`);
                if (entry.isIntersecting) {
                    // When a heading enters the viewport, deactivate all links and activate the current one.
                    tocLinks.forEach(link => link.classList.remove('is-active'));
                    correspondingLink.classList.add('is-active');
                }
            });
        }, {
            // Triggers when a heading is in a 70% band in the middle of the screen
            rootMargin: '-30% 0px -70% 0px',
            threshold: 0
        });

        headings.forEach(heading => observer.observe(heading));
    }


    // --- 3. SENSITIVE CONTENT OVERLAY ---
    const revealButton = document.getElementById('reveal-sensitive');
    const sensitiveOverlay = document.querySelector('.c-sensitive-overlay');

    if (revealButton && sensitiveOverlay) {
        revealButton.addEventListener('click', () => {
            sensitiveOverlay.classList.add('is-hidden');
        }, { once: true }); // Remove listener after first click
    }

    
    // --- 4. COPY LINK TOAST NOTIFICATION (Example for a share button) ---
    // In a real app, you'd have multiple share buttons. This is a placeholder.
    // Let's make the byline copy the link for this demo.
    const byline = document.querySelector('.c-article__byline');
    const toast = document.getElementById('toast');

    if (byline && toast) {
        byline.style.cursor = 'pointer';
        byline.title = 'Copy article link';
        byline.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                toast.classList.add('is-visible');
                setTimeout(() => {
                    toast.classList.remove('is-visible');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }
});