document.querySelectorAll('.hobby-card, .projects-list li, .backendProject-list li').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // Mouse X relative to the card
        const y = e.clientY - rect.top;  // Mouse Y relative to the card
        const centerX = rect.width / 2; // Card's center X
        const centerY = rect.height / 2; // Card's center Y

        // Amplified rotation angles for a more dramatic effect
        const rotateX = ((centerY - y) / centerY) * 30; // Vertical tilt (up to ±20°)
        const rotateY = ((x - centerX) / centerX) * 30; // Horizontal tilt (up to ±20°)

        // Calculate the distance from the center to adjust the scale
        const distanceX = Math.abs(centerX - x) / centerX;
        const distanceY = Math.abs(centerY - y) / centerY;

        // Calculate the scale factor based on distance
        const scale = 1 + (0.1 * (1 - Math.max(distanceX, distanceY))); // Scale is maximum near the center and decreases toward the edges

        // Adding a floating, glowing effect, and adjusting the size based on mouse position
        card.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease';
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.boxShadow = `0px 10px 20px rgba(0, 0, 0, 0.3), 0px 0px 20px rgba(255, 255, 255, 0.12)`;
    });

    card.addEventListener('mouseleave', () => {
        // Reset the transformation and shadow when cursor leaves the card
        card.style.transition = 'transform 0.2s ease-out, box-shadow 0.2s ease';
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        card.style.boxShadow = '0px 5px 15px rgba(0, 0, 0, 0.1)';
    });
});
