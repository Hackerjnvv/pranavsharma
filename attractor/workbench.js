// DOM Elements
const sliders = {
    a: document.getElementById('a-slider'),
    b: document.getElementById('b-slider'),
    c: document.getElementById('c-slider'),
    d: document.getElementById('d-slider'),
    density: document.getElementById('point-density')
};

const valueSpans = {
    a: document.getElementById('a-value'),
    b: document.getElementById('b-value'),
    c: document.getElementById('c-value'),
    d: document.getElementById('d-value'),
    density: document.getElementById('density-value')
};

const colorSelect = document.getElementById('color-scheme');
const openRenderBtn = document.getElementById('open-render-page');
const resetBtn = document.getElementById('reset-btn');
const fpsCounter = document.getElementById('fps-counter');
const pointCounter = document.getElementById('point-counter');

// Density presets
const DENSITY_PRESETS = [
    { name: "Low", pointsPerFrame: 100, totalPoints: 50000 },
    { name: "Medium", pointsPerFrame: 500, totalPoints: 200000 },
    { name: "High", pointsPerFrame: 1000, totalPoints: 500000 }
];

let previewInstance;
let lastFrameTime = 0;
let frameCount = 0;
let lastFpsUpdate = 0;
let currentFps = 0;
let renderedPoints = 0;

// Optimized Preview Sketch
const previewSketch = (p) => {
    let points = [];
    let currentIndex = 0;
    let x = 0.1, y = 0.1;
    let density = 2; // Medium by default
    let params = { a: -1.4, b: 1.6, c: 1.0, d: 0.7 };
    let colorScheme = 'nebula';
    let isDrawing = false;
    let pixelDensitySet = false;

    p.setup = () => {
        const canvas = p.createCanvas(300, 300);
        canvas.parent('canvas-wrapper');
        p.colorMode(p.HSB, 360, 100, 100, 1.0);
        p.noStroke();
        
        if (!pixelDensitySet) {
            p.pixelDensity(1); // Improve performance by not using retina resolution
            pixelDensitySet = true;
        }
        
        resetSystem();
    };

    p.draw = () => {
        // Calculate FPS
        calculateFPS();
        
        if (!isDrawing) return;
        
        // Get current density settings
        const densitySettings = DENSITY_PRESETS[density - 1];
        
        // Draw multiple points per frame for better performance
        for (let i = 0; i < densitySettings.pointsPerFrame && currentIndex < densitySettings.totalPoints; i++) {
            // Calculate next point
            const x_new = p.sin(params.a * y) + params.c * p.cos(params.a * x);
            const y_new = p.sin(params.b * x) + params.d * p.cos(params.b * y);
            x = x_new;
            y = y_new;
            
            // Only store points after the initial transient
            if (currentIndex > 100) {
                const drawX = p.map(x, -2.5, 2.5, 0, p.width);
                const drawY = p.map(y, -2.5, 2.5, 0, p.height);
                
                // Apply color based on position and scheme
                applyColor(p, x, y, colorScheme);
                p.circle(drawX, drawY, 1.5);
                
                renderedPoints++;
                pointCounter.textContent = `${renderedPoints.toLocaleString()} points`;
            }
            
            currentIndex++;
        }
        
        // If we've drawn all points, stop drawing
        if (currentIndex >= densitySettings.totalPoints) {
            isDrawing = false;
        }
    };

    function applyColor(p, x, y, scheme) {
        let hue, sat = 100, bright = 100;
        
        switch (scheme) {
            case 'volcano':
                hue = p.map(x, -2.5, 2.5, 0, 60);
                break;
            case 'forest':
                hue = p.map(x, -2.5, 2.5, 80, 140);
                break;
            case 'monochrome':
                p.fill(255, 255, 255, 0.7);
                return;
            default: // nebula
                hue = p.map(x, -2.5, 2.5, 180, 330);
        }
        
        p.fill(hue, sat, bright, 0.7);
    }

    function resetSystem() {
        p.background(10);
        x = 0.1;
        y = 0.1;
        currentIndex = 0;
        renderedPoints = 0;
        pointCounter.textContent = "0 points";
        
        // Start with a clean array
        points = [];
        
        // Start drawing
        isDrawing = true;
    }

    function updateParams(newParams) {
        params = { ...newParams };
        resetSystem();
    }

    function updateColorScheme(scheme) {
        colorScheme = scheme;
        resetSystem();
    }

    function updateDensity(newDensity) {
        density = newDensity;
        resetSystem();
    }

    // Expose functions to the global scope
    window.previewSketch = {
        updateParams,
        updateColorScheme,
        updateDensity,
        resetSystem
    };
};

// Calculate FPS
function calculateFPS() {
    const now = performance.now();
    frameCount++;
    
    if (now - lastFpsUpdate >= 1000) {
        currentFps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
        fpsCounter.textContent = `${currentFps} FPS`;
        frameCount = 0;
        lastFpsUpdate = now;
    }
}

// Function to change slider value by a small step
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
    slider.value = newValue.toFixed(2);
    
    // Trigger the 'input' event to update everything
    slider.dispatchEvent(new Event('input'));
}

// Main Setup
window.onload = () => {
    // Initialize the sketch
    previewInstance = new p5(previewSketch);
    
    // Setup all event listeners
    for (const key in sliders) {
        const slider = sliders[key];
        
        // Slider 'input' listener (to update text and preview)
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value).toFixed(2);
            valueSpans[key].textContent = value;
            
            if (key === 'density') {
                const densityName = DENSITY_PRESETS[value - 1].name;
                valueSpans[key].textContent = densityName;
                window.previewSketch.updateDensity(parseInt(value));
            } else {
                const params = {
                    a: parseFloat(sliders.a.value),
                    b: parseFloat(sliders.b.value),
                    c: parseFloat(sliders.c.value),
                    d: parseFloat(sliders.d.value)
                };
                window.previewSketch.updateParams(params);
            }
        });

        // Arrow key listener for fine-tuning
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                stepValue(key, 1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                stepValue(key, -1);
            }
        });
        
        // Button click listeners for plus/minus buttons
        if (key !== 'density') {
            document.getElementById(`${key}-plus`)?.addEventListener('click', () => stepValue(key, 1));
            document.getElementById(`${key}-minus`)?.addEventListener('click', () => stepValue(key, -1));
        }
    }
    
    // Color scheme change listener
    colorSelect.addEventListener('change', (e) => {
        window.previewSketch.updateColorScheme(e.target.value);
    });
    
    // Reset button
    resetBtn.addEventListener('click', () => {
        window.previewSketch.resetSystem();
    });
    
    // Generate 4K image button
    openRenderBtn.addEventListener('click', () => {
        const params = {
            a: sliders.a.value,
            b: sliders.b.value,
            c: sliders.c.value,
            d: sliders.d.value
        };
        const color = colorSelect.value;
        const density = sliders.density.value;
        
        const url = `render.html?a=${params.a}&b=${params.b}&c=${params.c}&d=${params.d}&color=${color}&density=${density}`;
        window.open(url, '_blank');
    });
    
    // Initialize with default values
    sliders.density.dispatchEvent(new Event('input'));
};