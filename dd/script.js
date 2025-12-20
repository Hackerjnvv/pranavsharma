const video = document.getElementById('video');
const alarmSound = document.getElementById('alarmSound');
const loadingMessage = document.getElementById('loading-message');

// Constants bilkul Python code jaise
const EAR_THRESHOLD = 0.25;
const CONSECUTIVE_FRAMES_THRESHOLD = 20;

let counter = 0;

// face-api.js ke models load karna
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models')
]).then(startVideo);

// Webcam start karna
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
            loadingMessage.innerText = "Webcam Started! Look at the camera.";
        })
        .catch(err => {
            console.error(err);
            loadingMessage.innerText = "Error: Could not start webcam.";
        });
}

// Helper function: do points ke beech ka distance
function euclideanDist(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// Helper function: Eye Aspect Ratio (EAR) calculate karna
function getEAR(eye) {
    const A = euclideanDist(eye[1], eye[5]);
    const B = euclideanDist(eye[2], eye[4]);
    const C = euclideanDist(eye[0], eye[3]);
    const ear = (A + B) / (2.0 * C);
    return ear;
}

// Main detection loop
video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.querySelector('.container').append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

        if (detections) {
            const landmarks = detections.landmarks;
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();

            const leftEAR = getEAR(leftEye);
            const rightEAR = getEAR(rightEye);

            const ear = (leftEAR + rightEAR) / 2.0;

            // Canvas ko clear karke uspar video frame aur detections draw karna
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

            // Drowsiness logic
            if (ear < EAR_THRESHOLD) {
                counter++;
                if (counter >= CONSECUTIVE_FRAMES_THRESHOLD) {
                    // Alert text draw karna
                    const ctx = canvas.getContext('2d');
                    ctx.font = '24px Arial';
                    ctx.fillStyle = 'red';
                    ctx.fillText('DROWSINESS ALERT!', 10, 30);
                    
                    // Alarm bajana
                    if (alarmSound.paused) {
                        alarmSound.play();
                    }
                }
            } else {
                counter = 0;
                alarmSound.pause();
                alarmSound.currentTime = 0; // Reset sound
            }

            // EAR value display karna
            const ctx = canvas.getContext('2d');
            ctx.font = '20px Arial';
            ctx.fillStyle = 'lime';
            ctx.fillText(`EAR: ${ear.toFixed(2)}`, canvas.width - 150, 30);
        } else {
            // Agar face detect nahi hua
            counter = 0;
            alarmSound.pause();
            alarmSound.currentTime = 0;
        }
    }, 100); // Har 100ms mein check karega
});