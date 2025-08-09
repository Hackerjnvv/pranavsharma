// This runs in a separate thread
self.onmessage = function(e) {
    const { params, numPoints } = e.data;
    const points = [];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let x = 0.1, y = 0.1;
    
    // Skip the transient
    for (let i = 0; i < 1000; i++) {
        const x_new = Math.sin(params.a * y) + params.c * Math.cos(params.a * x);
        const y_new = Math.sin(params.b * x) + params.d * Math.cos(params.b * y);
        x = x_new;
        y = y_new;
    }
    
    // Generate all points
    for (let i = 0; i < numPoints; i++) {
        const x_new = Math.sin(params.a * y) + params.c * Math.cos(params.a * x);
        const y_new = Math.sin(params.b * x) + params.d * Math.cos(params.b * y);
        x = x_new;
        y = y_new;
        
        points.push({ x, y });
        
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        
        // Send progress updates every 10%
        if (i % (numPoints / 10) === 0) {
            self.postMessage({
                type: 'progress',
                progress: i / numPoints
            });
        }
    }
    
    self.postMessage({
        type: 'result',
        points,
        bounds: { minX, maxX, minY, maxY }
    });
    
    self.close();
};