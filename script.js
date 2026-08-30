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
// 2. INITIALIZE ON PAGE LOAD
// ============================================================================

/**
 * Run initialization when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeCategoryFilters();
});
