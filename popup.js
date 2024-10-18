// Function to render the list of saved videos and markers in the popup
function renderMarkers() {
  chrome.storage.local.get(null, (items) => {
    const videoList = document.getElementById('videoList');
    videoList.innerHTML = '';

    for (let videoId in items) {
      const markers = items[videoId];
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Create video item container
      const videoItem = document.createElement('div');
      videoItem.classList.add('video-item');

      // Create video link
      const videoHeader = document.createElement('div');
      videoHeader.classList.add('video-header');

      const videoLink = document.createElement('a');
      videoLink.href = videoUrl;
      videoLink.textContent = `Video: ${videoId}`;
      videoLink.target = '_blank';
      videoHeader.appendChild(videoLink);

      // Create expand/collapse triangle button
      const toggleButton = document.createElement('div');
      toggleButton.classList.add('triangle', 'triangle-left'); // Initially points left
      videoHeader.appendChild(toggleButton);

      // Append the video header (link + triangle) to video item
      videoItem.appendChild(videoHeader);

      // Create markers list (hidden by default)
      const markerList = document.createElement('div');
      markerList.classList.add('marker-list');
      markerList.style.display = 'none'; // Hidden by default

      // List markers for this video
      for (let key in markers) {
        if (markers[key] !== null) {
          const timeFormatted = new Date(markers[key] * 1000).toISOString().substr(11, 8);

          const markerLink = document.createElement('a');
          markerLink.href = `${videoUrl}&t=${Math.floor(markers[key])}`;
          markerLink.textContent = `${key.toUpperCase()}: ${timeFormatted}`;
          markerLink.classList.add('marker-link');
          markerLink.target = '_blank';
          markerList.appendChild(markerLink);
        }
      }

      // Append the marker list to video item
      videoItem.appendChild(markerList);

      // Toggle marker list visibility
      toggleButton.addEventListener('click', () => {
        const isVisible = markerList.style.display === 'block';
        markerList.style.display = isVisible ? 'none' : 'block';

        // Toggle the direction of the triangle
        toggleButton.classList.toggle('triangle-left', isVisible);
        toggleButton.classList.toggle('triangle-down', !isVisible);
      });

      // Append video item to the video list
      videoList.appendChild(videoItem);
    }
  });
}

// Call renderMarkers when the popup is loaded
document.addEventListener('DOMContentLoaded', renderMarkers);

// Optional: CSS for the triangle and styling
const style = document.createElement('style');
style.textContent = `
  .video-item {
    margin-bottom: 10px;
  }
  .video-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .triangle {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    cursor: pointer;
  }
  .triangle-left {
    border-top: 10px solid black; /* Points to left (initial) */
  }
  .triangle-down {
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 10px solid black; /* Points to bottom when expanded */
  }
  .marker-list {
    margin-top: 5px;
    padding-left: 10px;
  }
  .marker-link {
    display: block;
    margin-bottom: 3px;
  }
`;
document.head.appendChild(style);
