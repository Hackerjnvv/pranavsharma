// render.js

// DOM Elements
const progressBar = document.getElementById('progress-bar');
const statusTitle = document.getElementById('status-title');
const statusText = document.getElementById('status-text');
const downloadContainer = document.getElementById('download-container');
const downloadBtn = document.getElementById('download-btn');

let finalImage; // Yahan 4K image store hogi

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {
        a: parseFloat(urlParams.get('a')),
        b: parseFloat(urlParams.get('b')),
        c: parseFloat(urlParams.get('c')),
        d: parseFloat(urlParams.get('d')),
    };
    const colorScheme = urlParams.get('color');

    if (!params.a) {
        statusTitle.textContent = "Error";
        statusText.textContent = "Parameters not found. Please generate from the main page.";
        return;
    }

    const fourKSketch = (p) => {
        const NUM_POINTS = 4000000, MARGIN = 150, RENDER_CHUNK_SIZE = 50000;
        let points = [], bounds = {}, renderIndex = 0;

        p.setup = () => {
            p.createCanvas(3840, 2160); // Yeh off-screen jaisa kaam karega
            p.colorMode(p.HSB, 360, 100, 100, 1.0);
            p.noLoop();
            
            // Step 1: Points generate karo
            generatePoints();
            p.background(0);
            p.loop(); // Rendering ke liye loop shuru karo
        };

        p.draw = () => {
            // Step 2: Chunks mein render karo
            renderChunk();
            updateProgress();
            
            if (renderIndex >= points.length) {
                p.noLoop();
                onGenerationComplete();
            }
        };

        function generatePoints() {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            let x = 0.1, y = 0.1;
            for (let i = 0; i < NUM_POINTS; i++) {
                let x_new = p.sin(params.a * y) + params.c * p.cos(params.a * x);
                let y_new = p.sin(params.b * x) + params.d * p.cos(params.b * y);
                x = x_new; y = y_new;
                if (i > 100) {
                    points.push({ x, y });
                    if (x < minX) minX = x; if (x > maxX) maxX = x;
                    if (y < minY) minY = y; if (y > maxY) maxY = y;
                }
            }
            bounds = { minX, maxX, minY, maxY };
        }

        function renderChunk() {
            const end = Math.min(renderIndex + RENDER_CHUNK_SIZE, points.length);
            for (let i = renderIndex; i < end; i++) {
                const pt = points[i];
                const drawX = p.map(pt.x, bounds.minX, bounds.maxX, MARGIN, p.width - MARGIN);
                const drawY = p.map(pt.y, bounds.minY, bounds.maxY, MARGIN, p.height - MARGIN);
                applyColorScheme(p, pt.x, pt.y, colorScheme);
                p.point(drawX, drawY);
                
            }
            renderIndex = end;
        }

        function onGenerationComplete() {
            statusTitle.textContent = "Generation Complete!";
            statusText.textContent = "Your 4K image is ready to download.";
            document.getElementById('progress-bar-container').style.display = 'none';
            downloadContainer.style.display = 'block';
            finalImage = p.get(); // Poore canvas ko ek image object mein store karo
            downloadBtn.onclick = () => {
                let filename = `attractor_a${params.a.toFixed(2)}_b${params.b.toFixed(2)}_c${params.c.toFixed(2)}_d${params.d.toFixed(2)}`;
                p.save(finalImage, filename + '.png');
            };
        }
        
        function updateProgress() {
            const percent = (renderIndex / points.length) * 100;
            progressBar.style.width = percent + '%';
            statusText.textContent = `Rendering... ${Math.round(percent)}% complete.`;
        }

        function applyColorScheme(p, x, y, scheme) {
            let hue, sat = 100, bright = 100;
            if (scheme === 'volcano') hue = p.map(x, bounds.minX, bounds.maxX, 0, 60);
            else if (scheme === 'forest') hue = p.map(x, bounds.minX, bounds.maxX, 80, 140);
            else hue = p.map(x, bounds.minX, bounds.maxX, 180, 330);
            p.stroke(hue, sat, bright, 0.7);
        }
    };
    
    new p5(fourKSketch); // 4K generation shuru karo
};