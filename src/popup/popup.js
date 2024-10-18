// Function to render the list of saved videos and markers in the popup
function renderMarkers() {
  chrome.storage.local.get(null, (items) => {
    const videoList = document.getElementById('videoList');
    videoList.innerHTML = '';

    for (let videoId in items) {
      const { markers, title, author } = items[videoId];
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Create video item with title and author
      const videoItem = document.createElement('div');
      videoItem.classList.add('video-item');

      const videoTitleElement = document.createElement('span');
      videoTitleElement.textContent = `Title: ${title} | Author: ${author}`;
      videoItem.appendChild(videoTitleElement);

      // Create video link
      const videoLink = document.createElement('a');
      videoLink.href = videoUrl;
      videoLink.textContent = ' [Open Video]';
      videoLink.target = '_blank';
      videoItem.appendChild(videoLink);

      // Create expand/collapse button for markers
      const expandButton = document.createElement('div');
      expandButton.classList.add('expand-btn');
      expandButton.textContent = '▶'; // Arrow symbol
      videoItem.appendChild(expandButton);

      // Create markers list
      const markerList = document.createElement('div');
      markerList.classList.add('marker-list');
      markerList.style.display = 'none'; // Hidden by default

      // List markers for this video
      for (let key in markers) {
        if (markers[key] !== null) {
          const timeFormatted = new Date(markers[key] * 1000).toISOString().substr(11, 8);

          const markerData = document.createElement('div');
          markerData.textContent = `${key.toUpperCase()}: `;

          const markerLink = document.createElement('a');
          markerLink.href = `${videoUrl}&t=${Math.floor(markers[key])}`;
          markerLink.textContent = `${timeFormatted}`;
          markerLink.classList.add('marker-link');
          markerLink.target = '_blank';
          
          markerData.appendChild(markerLink);
          markerList.appendChild(markerData);
        }
      }

      // Toggle marker list visibility on button click
      expandButton.addEventListener('click', () => {
        const isExpanded = markerList.style.display === 'block';
        markerList.style.display = isExpanded ? 'none' : 'block';
        expandButton.textContent = isExpanded ? '▶' : '▼'; // Toggle arrow direction
      });

      videoItem.appendChild(markerList);
      videoList.appendChild(videoItem);
    }
  });
}

// Call renderMarkers when the popup is loaded
document.addEventListener('DOMContentLoaded', renderMarkers);
