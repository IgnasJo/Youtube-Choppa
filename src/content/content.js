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

// Utility function to get a color based on the key
function getMarkerColor(key) {
  const colors = {
    z: 'green', x: 'blue', c: 'brown', v: 'purple', b: 'orange',
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
    }
    else if (event.altKey) {
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
  const videoTitle = document.querySelector('#title > h1').innerText || 'Unknown Title'; // Get video title
  const videoAuthor = document.querySelector('#channel-name a').innerText || 'Unknown Author'; // Get video author

  // Check if all markers are null
  const allMarkersNull = Object.values(markers).every(value => value === null);

  if (allMarkersNull) {
    // Remove the video entry from storage if all markers are null
    chrome.storage.local.remove(videoId, () => {
      console.log(`All markers are null. Record for video ${videoId} removed.`);
    });
  }
  else {

    // Save markers along with video title and author
    const videoData = {
      markers: markers,
      title: videoTitle,
      author: videoAuthor
    };
    // Save the markers if there's at least one valid marker
    chrome.storage.local.set({ [videoId]: videoData }, () => {
      console.log(`Markers for video ${videoId} saved.`);
    });
  }
}


function removeExistingMarkers() {
  const existingMarkers = document.querySelectorAll('.custom-marker')
  if (existingMarkers) existingMarkers.forEach(marker => marker.remove());
}

// Function to load markers from chrome.storage
function loadMarkers(videoUrl) {
  removeExistingMarkers();
  const videoId = new URL(videoUrl).searchParams.get('v');
  chrome.storage.local.get([videoId], (result) => {
    if (result[videoId]) {
      markers = result[videoId].markers;
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
  // Calculate marker position on progress bar
  const percent = time / document.querySelector('video').duration;
  const timeFormatted = new Date(time * 1000).toISOString().slice(11, 19); // Format time as HH:MM:SS
  const backgroundColor = getMarkerColor(key);

  // Create marker HTML using string interpolation
  const markerHTML = `
    <div class="custom-marker marker-${key}" 
         style="left: ${percent * 100}%; background-color: ${backgroundColor};" 
         title="${key.toUpperCase()}: ${timeFormatted}">
      <div class="marker-bubble">${key.toUpperCase()}</div>
    </div>
  `;

  // Remove old marker for the same key
  removeMarkerFromProgressBar(key);

  // Append the new marker to the progress bar without disrupting existing markers
  progressBar.insertAdjacentHTML('beforeend', markerHTML);
}


// Function to remove a marker visually from the progress bar
function removeMarkerFromProgressBar(key) {
  const markerElement = document.querySelector(`.marker-${key}`);
  if (markerElement) {
    markerElement.remove();
  }
}