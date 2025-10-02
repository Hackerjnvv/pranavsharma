document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggler ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);

    themeToggleButton.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Dynamic Background Orbs Movement ---
    const orbs = document.querySelectorAll('.orb');

    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        orbs.forEach((orb, index) => {
            // Each orb moves at a different speed for a parallax effect
            const speed = (index + 1) * 0.02; 
            
            const moveX = (clientX - centerX) * speed;
            const moveY = (clientY - centerY) * speed;

            orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // --- Initial Orb Positions ---
    // Randomize initial positions for a more organic look
    orbs.forEach(orb => {
        const top = Math.random() * 80; // 0% to 80% from top
        const left = Math.random() * 80; // 0% to 80% from left
        orb.style.top = `${top}%`;
        orb.style.left = `${left}%`;
    });
});
