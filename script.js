/* ============================================================================
   MON-TUBE JAVASCRIPT - COMPLETE FUNCTIONAL FOUNDATION
   ============================================================================ */

// ============================================================================
// 1. VIDEO DATA STRUCTURE
// ============================================================================

const VIDEOS = [
    {
        id: 1,
        title: 'Amazing Discoveries in Modern Technology',
        channel: 'Tech Explore Channel',
        views: '245K',
        date: '2 days ago',
        duration: '12:45',
        category: 'Technology',
        youtubeId: 'y8OnoxKSXOU'
    },
    {
        id: 2,
        title: 'Complete Guide to Morning Routine',
        channel: 'Daily Wellness Tips',
        views: '1.2M',
        date: '1 week ago',
        duration: '8:30',
        category: 'Education',
        youtubeId: 'dQw4w9WgXcQ'
    },
    {
        id: 3,
        title: 'Gaming Tournament Highlights 2024',
        channel: 'Pro Gaming Arena',
        views: '892K',
        date: '3 days ago',
        duration: '15:12',
        category: 'Gaming',
        youtubeId: 'ZZ5LpwO-An4'
    },
    {
        id: 4,
        title: 'Cooking the Perfect Pasta from Scratch',
        channel: 'Culinary Masterclass',
        views: '567K',
        date: '5 days ago',
        duration: '22:05',
        category: 'Cooking',
        youtubeId: 'OIvHMR3G_rE'
    },
    {
        id: 5,
        title: 'Travel Vlog: Exploring Hidden Gems in Europe',
        channel: 'World Wanderer',
        views: '2.3M',
        date: '1 day ago',
        duration: '19:33',
        category: 'Travel',
        youtubeId: 'W0LHQG18plc'
    },
    {
        id: 6,
        title: 'Web Development Tips for Beginners',
        channel: 'Code Academy',
        views: '445K',
        date: '4 days ago',
        duration: '11:20',
        category: 'Technology',
        youtubeId: 'qz0aGYrrlhU'
    },
    {
        id: 7,
        title: 'Fitness Challenge: 30 Days Transformation',
        channel: 'Fitness Revolution',
        views: '1.8M',
        date: '2 weeks ago',
        duration: '30:15',
        category: 'Sports',
        youtubeId: 'nUUz5hsP8nc'
    },
    {
        id: 8,
        title: 'Music Production Studio Tour and Equipment Guide',
        channel: 'Sound Studio Secrets',
        views: '634K',
        date: '6 days ago',
        duration: '13:47',
        category: 'Music',
        youtubeId: 'AhWHyeXHN24'
    },
    {
        id: 9,
        title: 'Documentary: The History of Animation',
        channel: 'Creative Minds Studio',
        views: '756K',
        date: '10 days ago',
        duration: '25:58',
        category: 'Education',
        youtubeId: '_eSS-aVy74c'
    },
    {
        id: 10,
        title: 'Photography Masterclass: Lighting and Composition',
        channel: 'Visual Arts Academy',
        views: '328K',
        date: '3 weeks ago',
        duration: '16:42',
        category: 'Education',
        youtubeId: '4Ky_5J78GF4'
    },
    {
        id: 11,
        title: 'DIY Home Improvement Projects on a Budget',
        channel: 'Home & Design',
        views: '912K',
        date: '8 days ago',
        duration: '9:55',
        category: 'Cooking',
        youtubeId: '6HjLe-1wkPk'
    },
    {
        id: 12,
        title: 'Space Exploration: Latest NASA Missions Explained',
        channel: 'Science Explorer',
        views: '1.5M',
        date: '12 days ago',
        duration: '21:18',
        category: 'Technology',
        youtubeId: 'kKKM8Y-u7ds'
    }
];

// ============================================================================
// 2. STATE MANAGEMENT
// ============================================================================

const APP_STATE = {
    currentPage: 'home',
    currentCategory: 'All',
    searchTerm: '',
    currentVideoId: null,
    currentSection: 'home'
};

// ============================================================================
// 3. LOCALSTORAGE HELPERS
// ============================================================================

const StorageManager = {
    // History
    getHistory() {
        const history = localStorage.getItem('mon-tube-history');
        return history ? JSON.parse(history) : [];
    },
    
    addToHistory(videoId) {
        const history = this.getHistory();
        // Remove if already exists to avoid duplicates
        const filtered = history.filter(id => id !== videoId);
        // Add to beginning
        filtered.unshift(videoId);
        // Keep only last 50
        filtered.splice(50);
        localStorage.setItem('mon-tube-history', JSON.stringify(filtered));
    },

    // Watch Later
    getWatchLater() {
        const watchLater = localStorage.getItem('mon-tube-watch-later');
        return watchLater ? JSON.parse(watchLater) : [];
    },
    
    addToWatchLater(videoId) {
        const watchLater = this.getWatchLater();
        if (!watchLater.includes(videoId)) {
            watchLater.push(videoId);
            localStorage.setItem('mon-tube-watch-later', JSON.stringify(watchLater));
        }
    },
    
    removeFromWatchLater(videoId) {
        const watchLater = this.getWatchLater();
        const filtered = watchLater.filter(id => id !== videoId);
        localStorage.setItem('mon-tube-watch-later', JSON.stringify(filtered));
    },
    
    isInWatchLater(videoId) {
        return this.getWatchLater().includes(videoId);
    },

    // Liked Videos
    getLikedVideos() {
        const liked = localStorage.getItem('mon-tube-liked');
        return liked ? JSON.parse(liked) : [];
    },
    
    toggleLike(videoId) {
        const liked = this.getLikedVideos();
        if (liked.includes(videoId)) {
            const filtered = liked.filter(id => id !== videoId);
            localStorage.setItem('mon-tube-liked', JSON.stringify(filtered));
            return false;
        } else {
            liked.push(videoId);
            localStorage.setItem('mon-tube-liked', JSON.stringify(liked));
            return true;
        }
    },
    
    isLiked(videoId) {
        return this.getLikedVideos().includes(videoId);
    },

    // Subscriptions
    getSubscriptions() {
        const subscriptions = localStorage.getItem('mon-tube-subscriptions');
        return subscriptions ? JSON.parse(subscriptions) : [];
    },
    
    toggleSubscription(channelName) {
        const subscriptions = this.getSubscriptions();
        if (subscriptions.includes(channelName)) {
            const filtered = subscriptions.filter(name => name !== channelName);
            localStorage.setItem('mon-tube-subscriptions', JSON.stringify(filtered));
            return false;
        } else {
            subscriptions.push(channelName);
            localStorage.setItem('mon-tube-subscriptions', JSON.stringify(subscriptions));
            return true;
        }
    },
    
    isSubscribed(channelName) {
        return this.getSubscriptions().includes(channelName);
    }
};

// ============================================================================
// 4. VIDEO RENDERING
// ============================================================================

function createVideoCard(video) {
    const card = document.createElement('article');
    card.className = 'video-card';
    const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
    
    card.innerHTML = `
        <div class="video-thumbnail">
            <img src="${thumbnailUrl}" alt="${video.title}">
            <span class="video-duration">${video.duration}</span>
        </div>
        <div class="video-info">
            <div class="video-avatar">
                <img src="https://via.placeholder.com/40x40?text=${video.channel.charAt(0)}" alt="${video.channel}">
            </div>
            <div class="video-details">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-channel">${video.channel}</p>
                <p class="video-meta">${video.views} views • ${video.date}</p>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => openVideo(video.id));
    return card;
}

function renderVideos(videos, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    videos.forEach(video => {
        container.appendChild(createVideoCard(video));
    });
}

// ============================================================================
// 5. FILTERING & SEARCH LOGIC
// ============================================================================

function getFilteredVideos() {
    let filtered = VIDEOS;
    
    // Filter by category
    if (APP_STATE.currentCategory !== 'All') {
        filtered = filtered.filter(v => v.category === APP_STATE.currentCategory);
    }
    
    // Filter by search term
    if (APP_STATE.searchTerm.trim() !== '') {
        const term = APP_STATE.searchTerm.toLowerCase().trim();
        filtered = filtered.filter(v => 
            v.title.toLowerCase().includes(term) || 
            v.channel.toLowerCase().includes(term)
        );
    }
    
    return filtered;
}

function updateVideoDisplay() {
    const filtered = getFilteredVideos();
    renderVideos(filtered, 'video-grid');
    
    // Show/hide empty state
    const emptyState = document.getElementById('empty-state-home');
    emptyState.style.display = filtered.length === 0 ? 'block' : 'none';
}

function updateExploreDisplay() {
    const filtered = getFilteredVideos();
    renderVideos(filtered, 'explore-video-grid');
    
    // Show/hide empty state
    const emptyState = document.getElementById('empty-state-explore');
    emptyState.style.display = filtered.length === 0 ? 'block' : 'none';
}

// ============================================================================
// 6. CATEGORY FILTERING
// ============================================================================

function initializeCategoryFilters() {
    const categoryContainers = [
        document.getElementById('category-filters'),
        document.getElementById('explore-category-filters')
    ];
    
    categoryContainers.forEach(container => {
        if (!container) return;
        
        const buttons = container.querySelectorAll('.filter-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all buttons in this container
                buttons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update state
                APP_STATE.currentCategory = this.getAttribute('data-category');
                
                // Update display based on current page
                if (APP_STATE.currentPage === 'home') {
                    updateVideoDisplay();
                } else if (APP_STATE.currentPage === 'explore') {
                    updateExploreDisplay();
                }
            });
        });
    });
}

// ============================================================================
// 7. SEARCH FUNCTIONALITY
// ============================================================================

function initializeSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (!searchForm || !searchInput) return;
    
    function performSearch() {
        APP_STATE.searchTerm = searchInput.value;
        
        // Keep the current category selection - don't reset it
        // This allows searching within a selected category
        updateVideoDisplay();
    }
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch();
    });
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// ============================================================================
// 8. VIDEO PLAYER
// ============================================================================

function getVideoById(videoId) {
    return VIDEOS.find(v => v.id === videoId);
}

function openVideo(videoId) {
    const video = getVideoById(videoId);
    if (!video) return;
    
    // Add to history
    StorageManager.addToHistory(videoId);
    
    // Update state
    APP_STATE.currentVideoId = videoId;
    
    // Get player element and update
    const playerElement = document.getElementById('youtube-player');
    if (playerElement) {
        playerElement.src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`;
    }
    
    // Update title and info
    const titleElement = document.getElementById('player-title');
    const channelElement = document.getElementById('player-channel');
    const viewsElement = document.getElementById('player-views');
    const dateElement = document.getElementById('player-date');
    const avatarElement = document.getElementById('player-avatar');
    
    if (titleElement) titleElement.textContent = video.title;
    if (channelElement) channelElement.textContent = video.channel;
    if (viewsElement) viewsElement.textContent = `${video.views} views`;
    if (dateElement) dateElement.textContent = video.date;
    if (avatarElement) avatarElement.src = `https://via.placeholder.com/48x48?text=${video.channel.charAt(0)}`;
    
    // Update buttons
    updatePlayerButtons();
    
    // Switch to player page
    goToPage('player');
}

function updatePlayerButtons() {
    const videoId = APP_STATE.currentVideoId;
    const likeButton = document.getElementById('like-button');
    const watchLaterButton = document.getElementById('watch-later-button');
    
    // Update like button
    if (StorageManager.isLiked(videoId)) {
        likeButton.classList.add('active');
    } else {
        likeButton.classList.remove('active');
    }
    
    // Update watch later button
    if (StorageManager.isInWatchLater(videoId)) {
        watchLaterButton.classList.add('active');
    } else {
        watchLaterButton.classList.remove('active');
    }
}

function refreshCurrentPage() {
    // Refresh the display of the current page
    if (APP_STATE.currentPage === 'history') {
        renderHistory();
    } else if (APP_STATE.currentPage === 'watch-later') {
        renderWatchLater();
    } else if (APP_STATE.currentPage === 'liked-videos') {
        renderLikedVideos();
    } else if (APP_STATE.currentPage === 'home') {
        updateVideoDisplay();
    } else if (APP_STATE.currentPage === 'explore') {
        updateExploreDisplay();
    }
}

function initializePlayerButtons() {
    const likeButton = document.getElementById('like-button');
    const watchLaterButton = document.getElementById('watch-later-button');
    
    likeButton.addEventListener('click', function() {
        const videoId = APP_STATE.currentVideoId;
        const isLiked = StorageManager.toggleLike(videoId);
        
        if (isLiked) {
            this.classList.add('active');
        } else {
            this.classList.remove('active');
        }
        
        // Refresh current page in case it's the liked videos page
        refreshCurrentPage();
    });
    
    watchLaterButton.addEventListener('click', function() {
        const videoId = APP_STATE.currentVideoId;
        if (StorageManager.isInWatchLater(videoId)) {
            StorageManager.removeFromWatchLater(videoId);
            this.classList.remove('active');
        } else {
            StorageManager.addToWatchLater(videoId);
            this.classList.add('active');
        }
        
        // Refresh current page in case it's the watch later page
        refreshCurrentPage();
    });
}

// ============================================================================
// 9. HISTORY PAGE
// ============================================================================

function renderHistory() {
    const historyIds = StorageManager.getHistory();
    const historyVideos = historyIds
        .map(id => getVideoById(id))
        .filter(v => v !== undefined);
    
    renderVideos(historyVideos, 'history-video-grid');
    
    const emptyState = document.getElementById('empty-state-history');
    emptyState.style.display = historyVideos.length === 0 ? 'block' : 'none';
}

// ============================================================================
// 10. WATCH LATER PAGE
// ============================================================================

function renderWatchLater() {
    const watchLaterIds = StorageManager.getWatchLater();
    const watchLaterVideos = watchLaterIds
        .map(id => getVideoById(id))
        .filter(v => v !== undefined);
    
    renderVideos(watchLaterVideos, 'watch-later-video-grid');
    
    const emptyState = document.getElementById('empty-state-watch-later');
    emptyState.style.display = watchLaterVideos.length === 0 ? 'block' : 'none';
}

// ============================================================================
// 11. LIKED VIDEOS PAGE
// ============================================================================

function renderLikedVideos() {
    const likedIds = StorageManager.getLikedVideos();
    const likedVideos = likedIds
        .map(id => getVideoById(id))
        .filter(v => v !== undefined);
    
    renderVideos(likedVideos, 'liked-videos-grid');
    
    const emptyState = document.getElementById('empty-state-liked-videos');
    emptyState.style.display = likedVideos.length === 0 ? 'block' : 'none';
}

// ============================================================================
// 12. SUBSCRIPTIONS PAGE
// ============================================================================

function renderSubscriptions() {
    const container = document.getElementById('subscriptions-container');
    if (!container) return;
    
    // Get unique channels
    const channels = [...new Set(VIDEOS.map(v => v.channel))];
    const subscriptions = StorageManager.getSubscriptions();
    
    container.innerHTML = '';
    
    // Show subscribed channels
    channels.forEach(channelName => {
        const isSubscribed = StorageManager.isSubscribed(channelName);
        const card = document.createElement('div');
        card.className = 'subscription-card';
        card.innerHTML = `
            <img src="https://via.placeholder.com/80x80?text=${channelName.charAt(0)}" alt="${channelName}" class="subscription-avatar">
            <p class="subscription-name">${channelName}</p>
            <p class="subscription-subscribers">Sample channel</p>
            <button class="subscription-toggle" data-channel="${channelName}">
                ${isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        `;
        
        // Add event listener to subscribe button
        const button = card.querySelector('.subscription-toggle');
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const channelName = this.getAttribute('data-channel');
            const isNowSubscribed = StorageManager.toggleSubscription(channelName);
            this.textContent = isNowSubscribed ? 'Subscribed' : 'Subscribe';
            this.classList.toggle('active');
        });
        
        if (isSubscribed) {
            button.classList.add('active');
        }
        
        container.appendChild(card);
    });
    
    const emptyState = document.getElementById('empty-state-subscriptions');
    emptyState.style.display = subscriptions.length === 0 ? 'block' : 'none';
}

// ============================================================================
// 13. PAGE NAVIGATION
// ============================================================================

function goToPage(pageName) {
    // Stop YouTube player if leaving player page
    if (APP_STATE.currentPage === 'player' && pageName !== 'player') {
        const playerElement = document.getElementById('youtube-player');
        if (playerElement) {
            playerElement.src = '';
        }
    }
    
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show requested page
    const pageElement = document.getElementById(`page-${pageName}`);
    if (pageElement) {
        pageElement.classList.add('active');
    }
    
    // Update state
    APP_STATE.currentPage = pageName;
    
    // Update sidebar active link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${pageName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Close mobile menu
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
    
    // Render page-specific content
    if (pageName === 'history') {
        renderHistory();
    } else if (pageName === 'watch-later') {
        renderWatchLater();
    } else if (pageName === 'liked-videos') {
        renderLikedVideos();
    } else if (pageName === 'subscriptions') {
        renderSubscriptions();
    } else if (pageName === 'explore') {
        // Reset to All category for explore
        APP_STATE.currentCategory = 'All';
        const exploreButtons = document.querySelectorAll('#explore-category-filters .filter-btn');
        exploreButtons.forEach(btn => {
            if (btn.getAttribute('data-category') === 'All') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        updateExploreDisplay();
    } else if (pageName === 'home') {
        updateVideoDisplay();
    }
}

function initializeNavigation() {
    // Sidebar links
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            goToPage(page);
        });
    });
    
    // Logo link
    document.getElementById('logo-link').addEventListener('click', function(e) {
        e.preventDefault();
        goToPage('home');
    });
    
    // Back button
    document.getElementById('back-button').addEventListener('click', function(e) {
        e.preventDefault();
        goToPage('home');
    });
}

// ============================================================================
// 14. HEADER PANELS
// ============================================================================

function initializeHeaderPanels() {
    // Upload button
    const uploadBtn = document.getElementById('upload-btn');
    const uploadPanel = document.getElementById('upload-panel');
    const uploadClose = document.getElementById('upload-close');
    
    if (uploadBtn && uploadPanel) {
        uploadBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            uploadPanel.classList.toggle('active');
            // Close notifications and profile panels
            document.getElementById('notifications-panel').classList.remove('active');
            document.getElementById('profile-panel').classList.remove('active');
        });
        
        uploadClose.addEventListener('click', function() {
            uploadPanel.classList.remove('active');
        });
        
        uploadPanel.addEventListener('click', function(e) {
            if (e.target === uploadPanel) {
                uploadPanel.classList.remove('active');
            }
        });
    }
    
    // Notifications button
    const notificationsBtn = document.getElementById('notifications-btn');
    const notificationsPanel = document.getElementById('notifications-panel');
    const notificationsClose = document.getElementById('notifications-close');
    
    if (notificationsBtn && notificationsPanel) {
        notificationsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationsPanel.classList.toggle('active');
            // Close upload and profile panels
            document.getElementById('upload-panel').classList.remove('active');
            document.getElementById('profile-panel').classList.remove('active');
        });
        
        notificationsClose.addEventListener('click', function() {
            notificationsPanel.classList.remove('active');
        });
    }
    
    // Profile button
    const profileBtn = document.getElementById('profile-btn');
    const profilePanel = document.getElementById('profile-panel');
    
    if (profileBtn && profilePanel) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profilePanel.classList.toggle('active');
            // Close upload and notifications panels
            document.getElementById('upload-panel').classList.remove('active');
            document.getElementById('notifications-panel').classList.remove('active');
        });
    }
    
    // Close panels when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-section')) {
            document.getElementById('upload-panel').classList.remove('active');
            document.getElementById('notifications-panel').classList.remove('active');
            document.getElementById('profile-panel').classList.remove('active');
        }
    });
}

// ============================================================================
// 15. MOBILE MENU
// ============================================================================

function initializeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!menuToggle || !sidebar) return;
    
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        sidebar.classList.toggle('open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.sidebar') && !e.target.closest('.menu-toggle')) {
            sidebar.classList.remove('open');
        }
    });
}

// ============================================================================
// 16. INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initial render
    renderVideos(VIDEOS, 'video-grid');
    renderVideos(VIDEOS, 'explore-video-grid');
    
    // Initialize features
    initializeCategoryFilters();
    initializeSearch();
    initializePlayerButtons();
    initializeNavigation();
    initializeMobileMenu();
    initializeHeaderPanels();
    
    // Set initial home page
    goToPage('home');
});