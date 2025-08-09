// workbench.js

// --- DOM Elements ---
const sliders = { a: document.getElementById('a-slider'), b: document.getElementById('b-slider'), c: document.getElementById('c-slider'), d: document.getElementById('d-slider') };
const valueSpans = { a: document.getElementById('a-value'), b: document.getElementById('b-value'), c: document.getElementById('c-value'), d: document.getElementById('d-value') };
const colorSelect = document.getElementById('color-scheme');
const openRenderBtn = document.getElementById('open-render-page');

let previewInstance;

// --- Preview Sketch (No changes here) ---
const previewSketch = (p) => {
    let x = 0.1, y = 0.1;
    p.setup = () => { p.createCanvas(300, 300).parent('preview-container'); p.colorMode(p.HSB, 360, 100, 100, 1.0); p.reset(); };
    p.draw = () => {
        const params = { a: sliders.a.value, b: sliders.b.value, c: sliders.c.value, d: sliders.d.value };
        for (let i = 0; i < 500; i++) {
            let x_new = p.sin(params.a * y) + params.c * p.cos(params.a * x);
            let y_new = p.sin(params.b * x) + params.d * p.cos(params.b * y);
            x = x_new; y = y_new;
            let drawX = p.map(x, -2.5, 2.5, 0, p.width);
            let drawY = p.map(y, -2.5, 2.5, 0, p.height);
            applyColorScheme(p, x, y, colorSelect.value);
            p.point(drawX, drawY);
        }
    };
    p.reset = () => { p.background(10); x = 0.1; y = 0.1; };
};
function applyColorScheme(p, x, y, scheme) {
    let hue, sat = 100, bright = 100;
    if (scheme === 'volcano') hue = p.map(x, -2.5, 2.5, 0, 60);
    else if (scheme === 'forest') hue = p.map(x, -2.5, 2.5, 80, 140);
    else hue = p.map(x, -2.5, 2.5, 180, 330);
    p.stroke(hue, sat, bright, 0.7);
}

// --- NEW: Function to change slider value by a small step ---
function stepValue(key, direction) {
    const slider = sliders[key];
    const step = parseFloat(slider.step);
    let currentValue = parseFloat(slider.value);
    
    // Calculate new value
    let newValue = currentValue + (step * direction);
    
    // Ensure value stays within min/max bounds
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    newValue = Math.max(min, Math.min(max, newValue));
    
    // Update the slider's value
    slider.value = newValue;
    
    // IMPORTANT: Manually trigger the 'input' event to update everything
    slider.dispatchEvent(new Event('input'));
}


// --- Main Setup ---
window.onload = () => {
    previewInstance = new p5(previewSketch);

    // Setup all event listeners
    for (const key in sliders) {
        const slider = sliders[key];
        
        // 1. Slider 'input' listener (to update text and preview)
        slider.addEventListener('input', (e) => {
            valueSpans[key].textContent = parseFloat(e.target.value).toFixed(2);
            previewInstance.reset();
        });

        // 2. NEW: Arrow key listener for fine-tuning
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault(); // Stop page scroll
                stepValue(key, 1); // Increase value
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault(); // Stop page scroll
                stepValue(key, -1); // Decrease value
            }
        });
        
        // 3. NEW: Button click listeners
        document.getElementById(`${key}-plus`).addEventListener('click', () => stepValue(key, 1));
        document.getElementById(`${key}-minus`).addEventListener('click', () => stepValue(key, -1));
    }
    
    colorSelect.addEventListener('change', () => previewInstance.reset());
    openRenderBtn.addEventListener('click', () => {
        const params = { a: sliders.a.value, b: sliders.b.value, c: sliders.c.value, d: sliders.d.value };
        const color = colorSelect.value;
        const url = `render.html?a=${params.a}&b=${params.b}&c=${params.c}&d=${params.d}&color=${color}`;
        window.open(url, '_blank');
    });
};