function toggleTheme() {
    document.body.classList.toggle('dark');
  }
  
  window.onscroll = function() {
    let totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    let scrollPosition = window.scrollY;
    let progress = (scrollPosition / totalHeight) * 100;
    document.getElementById('reading-progress').style.width = progress + '%';
  };

  document.addEventListener("DOMContentLoaded", function() {
    let tocList = document.getElementById("toc-list");
    let headers = document.querySelectorAll("article h2, article h3, article h4");
  
    headers.forEach(function(header, index) {
      let listItem = document.createElement("li");
      let anchor = document.createElement("a");
      let id = header.textContent.toLowerCase().replace(/\s+/g, '-');

      header.id = id;
      anchor.href = "#" + id;
      anchor.textContent = header.textContent;
      
      listItem.appendChild(anchor);
      tocList.appendChild(listItem);
    });
  });

  const videoPlayer = document.getElementById('videoPlayer');
const playPauseButton = document.getElementById('playPause');
const progressBar = document.getElementById('progressBar');
const timeDisplay = document.getElementById('timeDisplay');
const muteButton = document.getElementById('muteButton');
const fullScreenButton = document.getElementById('fullScreenButton');
const downloadButton = document.getElementById('downloadButton');
const controls = document.querySelector('.controls');

// Play/Pause functionality
playPauseButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent the click event from propagating to the video container
    if (videoPlayer.paused) {
        videoPlayer.play();
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoPlayer.pause();
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Pause video when clicked on controls
controls.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent the click event from propagating to the video container
    videoPlayer.pause();
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
});

// Update progress bar as video plays
videoPlayer.addEventListener('timeupdate', () => {
  const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
  progressBar.value = progress;

  // Get minutes, seconds, and hours
  let minutes = Math.floor(videoPlayer.currentTime / 60);
  let seconds = Math.floor(videoPlayer.currentTime % 60);
  let hours = Math.floor(videoPlayer.currentTime / 3600);

  // Format seconds to always show two digits
  if (seconds < 10) seconds = '0' + seconds;

  // Format minutes to always show two digits, but only if less than 100 minutes
  if (minutes < 10 && hours === 0) minutes = '0' + minutes;

  // If hours is greater than 0, we need to ensure two-digit hours
  if (hours > 0) {
      minutes = ('0' + minutes).slice(-2); // Ensure minutes show two digits
      seconds = ('0' + seconds).slice(-2); // Ensure seconds show two digits
      timeDisplay.textContent = `${('0' + hours).slice(-2)}:${minutes}:${seconds}`; // Format as HH:MM:SS
  } else {
      timeDisplay.textContent = `${minutes}:${seconds}`; // Format as MM:SS if under 1 hour
  }
});

// Sync progress bar with video playback
progressBar.addEventListener('input', () => {
  const newTime = (progressBar.value / 100) * videoPlayer.duration;
  videoPlayer.currentTime = newTime;
});



// Mute/Unmute functionality
muteButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent the click event from propagating to the video container
    if (videoPlayer.muted) {
        videoPlayer.muted = false;
        muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        videoPlayer.muted = true;
        muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});

// Fullscreen functionality
fullScreenButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent the click event from propagating to the video container
    if (videoPlayer.requestFullscreen) {
        videoPlayer.requestFullscreen();
    } else if (videoPlayer.mozRequestFullScreen) {
        videoPlayer.mozRequestFullScreen();
    } else if (videoPlayer.webkitRequestFullscreen) {
        videoPlayer.webkitRequestFullscreen();
    }
});

// Download functionality
downloadButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent the click event from propagating to the video container
    const link = document.createElement('a');
    link.href = videoPlayer.getElementsByTagName('source')[0].src;
    link.download = 'video.mp4';  // Replace with actual filename
    link.click();
});

// Click on video to resume playing (only if it's paused)
videoPlayer.addEventListener('click', () => {
  if (videoPlayer.paused) {
      // If the video is paused, play it
      videoPlayer.play();
      playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
      // If the video is playing, pause it
      videoPlayer.pause();
      playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
  }
});

videoPlayer.addEventListener('seeked', () => {
  if (!videoPlayer.paused) {
      // Automatically resume playback after seeking if the video was playing
      videoPlayer.play();
      playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
  }
});


const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

// Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const audioSource = audioContext.createMediaElementSource(audio);

// Connect the audio source to analyser and destination
audioSource.connect(analyser);
analyser.connect(audioContext.destination);
analyser.fftSize = 256;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Visualization settings
function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);
  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / bufferLength;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] / 2;
    ctx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

// Event listeners
playBtn.addEventListener('click', async () => {
    try {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      await audio.play();
      drawVisualizer();
    } catch (err) {
      console.error('Error playing audio:', err);
    }
  });
  
pauseBtn.addEventListener('click', () => {
  audio.pause();
});