function initializeCategoryFilters() {
    // Get all filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Add click event listener to each button
    filterButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            // Remove 'active' class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            // Add 'active' class to the clicked button
            this.classList.add('active');
        });
    });
}

// ============================================================================
// 2. SEARCH FUNCTIONALITY
// ============================================================================

/**
 * Initialize search functionality
 * Filters video cards based on search term in title and channel name
 */
function initializeSearch() {
    // Get search elements
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const videoCards = document.querySelectorAll('.video-card');

    /**
     * Perform search and filter videos
     */
    function performSearch() {
        // Get search term and convert to lowercase
        const searchTerm = searchInput.value.toLowerCase().trim();

        // Loop through each video card
        videoCards.forEach(card => {
            // Get video title and channel name
            const videoTitle = card.querySelector('.video-title').textContent.toLowerCase();
            const videoChannel = card.querySelector('.video-channel').textContent.toLowerCase();

            // Check if search term matches title or channel (case-insensitive)
            const isMatch = videoTitle.includes(searchTerm) || videoChannel.includes(searchTerm);

            // Show or hide the card
            if (searchTerm === '' || isMatch) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Handle search form submission (search button click)
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        performSearch();
    });

    // Handle Enter key press in search input
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    initializeCategoryFilters();
    initializeSearch();
});
