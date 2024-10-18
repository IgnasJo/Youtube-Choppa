// Function to render the list of saved videos and markers in the popup
function renderMarkers() {
  chrome.storage.local.get(null, (items) => {
    const videoList = document.getElementById('videoList');
    videoList.innerHTML = '';

    for (let videoId in items) {
      const { markers, title, author } = items[videoId];
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Create video item with title, author, link, and expand button
      let videoItemHTML = `
        <div class="video-item">
          <span>Title: ${title} | Author: ${author}</span>
          <a href="${videoUrl}" target="_blank"> [Open Video]</a>
          <div class="expand-btn">▶</div>
          <div class="marker-list" style="display: none;">
      `;

      // Generate markers for this video
      for (let key in markers) {
        if (markers[key] !== null) {
          const timeFormatted = new Date(markers[key] * 1000).toISOString().substr(11, 8);
          const markerLink = `${videoUrl}&t=${Math.floor(markers[key])}`;

          // Append links to marker times
          videoItemHTML += `
            <div>
              ${key.toUpperCase()}: 
              <a href="${markerLink}" class="marker-link" target="_blank">${timeFormatted}</a>
            </div>
          `;
        }
      }

      // Close the marker list and video item
      videoItemHTML += `
          </div>
        </div>
      `;

      // Append the generated HTML to the video list
      videoList.innerHTML += videoItemHTML;
    }

    // Add event listeners for expand/collapse functionality
    videoList.querySelectorAll('.expand-btn').forEach((expandButton) => {
      expandButton.addEventListener('click', () => {
        const markerList = expandButton.nextElementSibling;
        const isExpanded = markerList.style.display === 'block';
        markerList.style.display = isExpanded ? 'none' : 'block';
        expandButton.textContent = isExpanded ? '▶' : '▼';
      });
    });
  });
}

// Call renderMarkers when the popup is loaded
document.addEventListener('DOMContentLoaded', renderMarkers);
