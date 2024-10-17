// Dictionary to store marker times for keys 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'
let markers = {
  q: null, w: null, e: null, r: null, t: null,
  y: null, u: null, i: null, o: null, p: null
};

// Function to set a marker at the current video time for the given key
function setMarker(key, event) {
  const video = document.querySelector('video');
  const videoProgressBar = document.querySelector('.ytp-progress-bar');
  const currentTime = video.currentTime;

  // Save marker time for the key
  markers[key] = currentTime;

  // Visual marker on progress bar
  drawMarker(key, currentTime, videoProgressBar);
  console.log(`Marker for '${key}' set at: ${currentTime.toFixed(2)} seconds`);
}

// Function to delete a marker for the given key
function deleteMarker(key) {
  const videoProgressBar = document.querySelector('.ytp-progress-bar');

  if (markers[key] !== null) {
      markers[key] = null;
      removeMarkerFromProgressBar(key, videoProgressBar); // Remove the visual marker
      console.log(`Marker for '${key}' deleted.`);
  }
}

// Function to play the video from the marker of the given key
function playFromMarker(key) {
  const video = document.querySelector('video');
  const markerTime = markers[key];

  if (markerTime !== null) {
      video.currentTime = markerTime;
      video.play();
      console.log(`Playing from marker for '${key}' at: ${markerTime.toFixed(2)} seconds`);
  }
}

// Function to draw a marker on the progress bar for a given key
function drawMarker(key, time, progressBar) {
  const markerElement = document.createElement('div');
  markerElement.classList.add('custom-marker', `marker-${key}`);
  markerElement.style.position = 'absolute';

  // Calculate marker position on progress bar
  const percent = time / document.querySelector('video').duration;
  markerElement.style.left = `${percent * 100}%`;
  markerElement.style.top = '0';
  markerElement.style.width = '2px';
  markerElement.style.height = '100%';
  markerElement.style.backgroundColor = getMarkerColor(key);
  markerElement.style.zIndex = '1000';

  // Remove old marker for the same key
  const existingMarker = document.querySelector(`.marker-${key}`);
  if (existingMarker) {
      existingMarker.remove();
  }

  // Add new marker
  progressBar.appendChild(markerElement);
}

// Function to remove a marker visually from the progress bar
function removeMarkerFromProgressBar(key, progressBar) {
  const markerElement = document.querySelector(`.marker-${key}`);
  if (markerElement) {
      markerElement.remove();
  }
}

// Utility function to get a color based on the key
function getMarkerColor(key) {
  const colors = {
      q: 'green', w: 'blue', e: 'red', r: 'purple', t: 'orange',
      y: 'yellow', u: 'cyan', i: 'magenta', o: 'brown', p: 'pink'
  };
  return colors[key] || 'black';
}

// Add event listeners for key presses
document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();

  // Handle setting or playing from marker
  if (key in markers) {
      if (event.ctrlKey) {
          deleteMarker(key); // Ctrl + key: delete marker
      } else {
          if (markers[key] === null) {
              setMarker(key); // No marker exists, set one
          } else {
              playFromMarker(key); // Marker exists, play from it
          }
      }
  }
});
