// Initialize marker position in seconds
let markerTime = 0;

// Function to set a marker on double-click
function setMarker(event) {
    const video = document.querySelector('video');
    const videoProgressBar = document.querySelector('.ytp-progress-bar');

    // Get the width of the progress bar and the position of the click
    const progressBarRect = videoProgressBar.getBoundingClientRect();
    const clickX = event.clientX - progressBarRect.left;

    // Calculate marker time based on where the user clicked
    const percent = clickX / progressBarRect.width;
    markerTime = percent * video.duration;

    // Draw a visual marker on the progress bar (optional)
    drawMarker(clickX, progressBarRect);
    
    console.log(`Marker set at: ${markerTime.toFixed(2)} seconds`);
}

// Function to draw a marker on the timeline (optional)
function drawMarker(clickX, progressBarRect) {
    const marker = document.createElement('div');
    marker.style.position = 'absolute';
    marker.style.left = `${clickX}px`;
    marker.style.top = '0';
    marker.style.width = '2px';
    marker.style.height = `${progressBarRect.height}px`;
    marker.style.backgroundColor = 'green';
    marker.style.zIndex = '1000';

    // Remove previous marker if any
    const existingMarker = document.querySelector('.custom-marker');
    if (existingMarker) {
        existingMarker.remove();
    }

    // Add marker to the progress bar
    marker.classList.add('custom-marker');
    document.querySelector('.ytp-progress-bar').appendChild(marker);
}

// Function to play the video from the marker when Q is pressed
function playFromMarker(event) {
    if (event.key.toLowerCase() === 'q') {
        const video = document.querySelector('video');
        if (markerTime) {
            video.currentTime = markerTime;
            video.play();
            console.log(`Playing from marker at: ${markerTime.toFixed(2)} seconds`);
        }
    }
}

// Add event listeners
document.addEventListener('dblclick', (event) => {
    if (event.target.classList.contains('ytp-progress-bar')) {
        setMarker(event); // Set marker when double-clicking on the progress bar
    }
});

document.addEventListener('keydown', playFromMarker);
