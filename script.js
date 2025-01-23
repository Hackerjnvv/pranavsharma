
document.querySelectorAll('.hobby-card, .projects-list li').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // Mouse X relative to the card
        const y = e.clientY - rect.top;  // Mouse Y relative to the card
        const centerX = rect.width / 2; // Card's center X
        const centerY = rect.height / 2; // Card's center Y

        // Amplified rotation angles for a more dramatic effect
        const rotateX = ((centerY - y) / centerY) * 20; // Vertical tilt (up to Â±20Â°)
        const rotateY = ((x - centerX) / centerX) * 20; // Horizontal tilt (up to Â±20Â°)

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
    });

    card.addEventListener('mouseleave', () => {
        // Reset the transformation when cursor leaves the card
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
});