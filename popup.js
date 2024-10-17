// Function to render the list of saved videos and markers in the popup
function renderMarkers() {
  chrome.storage.local.get(null, (items) => {
    const videoList = document.getElementById('videoList');
    videoList.innerHTML = '';

    for (let videoId in items) {
      const markers = items[videoId];
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Create video link
      const videoItem = document.createElement('div');
      videoItem.classList.add('video-item');
      const videoLink = document.createElement('a');
      videoLink.href = videoUrl;
      videoLink.textContent = `Video: ${videoId}`;
      videoLink.target = '_blank';
      videoItem.appendChild(videoLink);

      // List markers for this video
      for (let key in markers) {
        if (markers[key] !== null) {
          const timeFormatted = new Date(markers[key] * 1000).toISOString().substr(11, 8);

          const markerLink = document.createElement('a');
          markerLink.href = `${videoUrl}&t=${Math.floor(markers[key])}`;
          markerLink.textContent = `${key.toUpperCase()}: ${timeFormatted}`;
          markerLink.classList.add('marker-link');
          markerLink.target = '_blank';
          videoItem.appendChild(markerLink);
        }
      }

      videoList.appendChild(videoItem);
    }
  });
}

// Call renderMarkers when the popup is loaded
document.addEventListener('DOMContentLoaded', renderMarkers);
