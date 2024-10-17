// Dictionary to store marker times for keys 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'
let markers = {
  z: null, x: null, c: null, v: null, b: null
};

// TODO: handle cases of playlists

// Call loadMarkers when the content script runs
loadMarkers(window.location.href);

// detect URL changes (chromium native)
navigation.addEventListener('navigate', (event) => {
  loadMarkers(event.destination.url);
});

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

// Function to set a marker at the current video time for the given key
function setMarker(key) {
  const video = document.querySelector('video');
  const videoUrl = window.location.href;
  const currentTime = video.currentTime;

  markers[key] = currentTime; // Set marker
  drawMarker(key, currentTime, document.querySelector('.ytp-progress-bar'));
  saveMarkers(videoUrl); // Save markers after setting
}

// Function to save markers to chrome.storage
function saveMarkers(videoUrl) {
  const videoId = new URL(videoUrl).searchParams.get('v'); // Extract video ID
  chrome.storage.local.set({ [videoId]: markers }, () => {
    console.log(`Markers for video ${videoId} saved.`);
  });
}

// Function to load markers from chrome.storage
function loadMarkers(videoUrl) {
  // start without markers
  document.querySelectorAll('.custom-marker')
    .forEach(marker => marker.remove());
  const videoId = new URL(videoUrl).searchParams.get('v');
  chrome.storage.local.get([videoId], (result) => {
    if (result[videoId]) {
      markers = result[videoId];
      for (let key in markers) {
        if (markers[key] !== null) {
          // delay for loading
          setTimeout(
           () => drawMarker(key, markers[key], document.querySelector('.ytp-progress-bar')),
           1000);
        }
      }
      console.log(`Markers for video ${videoId} loaded.`);
    }
    else {
      // cleanup
      for (let key in markers) {
        markers[key] = null;
      }
      console.log(`No markers found for video ${videoId}.`);
    }
  });
}

// Function to delete a marker for the given key
function deleteMarker(key) {
  if (markers[key] !== null) {
    markers[key] = null; // Remove marker
    removeMarkerFromProgressBar(key, document.querySelector('.ytp-progress-bar'));
    saveMarkers(window.location.href); // Save markers after deletion
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

  // Set hover tooltip: Show the key and the timestamp
  const timeFormatted = new Date(time * 1000).toISOString().substr(11, 8); // Format time as HH:MM:SS
  markerElement.setAttribute('title', `${key.toUpperCase()}: ${timeFormatted}`);

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
    z: 'green', x: 'blue', c: 'brown', v: 'purple', b: 'cyan',
  };
  return colors[key] || 'black';
}

// Optional: CSS for tooltips (append to the document head)
const style = document.createElement('style');
style.textContent = `
.custom-marker {
  position: absolute;
  width: 2px;
  height: 100%;
  z-index: 1000;
  cursor: pointer;
}
.custom-marker[title]:hover::after {
  content: attr(title);
  position: absolute;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 5px;
  font-size: 12px;
  border-radius: 3px;
  white-space: nowrap;
  top: -25px;
  left: -10px;
  z-index: 1001;
}
`;
document.head.appendChild(style);
