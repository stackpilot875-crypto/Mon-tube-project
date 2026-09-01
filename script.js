// ============================================================================
// MON-TUBE - Real YouTube Videos Version
// Fetches videos from YouTube Data API v3
// ============================================================================

// API Key (set in HTML)
const API_KEY = window.YOUTUBE_API_KEY || '';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// APPLICATION STATE
const state = {
    currentPage: 'home',
    currentCategory: 'All',
    searchTerm: 'technology', // Default search term
    currentVideoId: null,
    currentLibraryTab: 'history',
    videos: [],
    loading: false
};

// LOCALSTORAGE MANAGEMENT
const storage = {
    getHistory: () => JSON.parse(localStorage.getItem('history') || '[]'),
    addHistory: (id) => {
        const history = storage.getHistory();
        const existingIdx = history.indexOf(id);
        if (existingIdx > -1) history.splice(existingIdx, 1);
        history.unshift(id);
        history.splice(50);
        localStorage.setItem('history', JSON.stringify(history));
    },
    clearHistory: () => {
        localStorage.removeItem('history');
    },
   
    getWatchLater: () => JSON.parse(localStorage.getItem('watchLater') || '[]'),
    toggleWatchLater: (id) => {
        const items = storage.getWatchLater();
        const index = items.indexOf(id);
        if (index > -1) items.splice(index, 1);
        else items.push(id);
        localStorage.setItem('watchLater', JSON.stringify(items));
        return index === -1;
    },
   
    getLiked: () => JSON.parse(localStorage.getItem('liked') || '[]'),
    toggleLiked: (id) => {
        const items = storage.getLiked();
        const index = items.indexOf(id);
        if (index > -1) items.splice(index, 1);
        else items.push(id);
        localStorage.setItem('liked', JSON.stringify(items));
        return index === -1;
    },
   
    getSubscriptions: () => JSON.parse(localStorage.getItem('subscriptions') || '[]'),
    toggleSubscription: (channel) => {
        const items = storage.getSubscriptions();
        const index = items.indexOf(channel);
        if (index > -1) items.splice(index, 1);
        else items.push(channel);
        localStorage.setItem('subscriptions', JSON.stringify(items));
        return index === -1;
    }
};

// ============================================================================
// YOUTUBE API FUNCTIONS
// ============================================================================

async function searchYouTubeVideos(query, maxResults = 12) {
    if (!API_KEY) {
        console.error('YouTube API Key not configured. Add it to index.html');
        return [];
    }

    state.loading = true;
    showLoadingState();

    try {
        const response = await fetch(
            `${YOUTUBE_API_URL}/search?key=${API_KEY}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=${maxResults}&order=relevance&videoEmbeddable=true`
        );
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            state.videos = [];
            state.loading = false;
            return [];
        }

        // Transform YouTube results into our video format
        state.videos = data.items.map((item, index) => ({
            id: index + 1,
            youtubeId: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.medium.url,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt,
            category: state.currentCategory || 'All'
        }));

        state.loading = false;
        return state.videos;
    } catch (error) {
        console.error('YouTube API Error:', error);
        state.loading = false;
        return [];
    }
}

async function getTrendingVideos(maxResults = 12) {
    if (!API_KEY) {
        console.error('YouTube API Key not configured.');
        return [];
    }

    state.loading = true;
    showLoadingState();

    try {
        const response = await fetch(
            `${YOUTUBE_API_URL}/videos?key=${API_KEY}&part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=${maxResults}&videoCategoryId=0`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        state.videos = data.items.map((item, index) => ({
            id: index + 1,
            youtubeId: item.id,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.medium.url,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt,
            category: 'Trending',
            views: item.statistics.viewCount
        }));

        state.loading = false;
        return state.videos;
    } catch (error) {
        console.error('YouTube API Error:', error);
        state.loading = false;
        return [];
    }
}

function showLoadingState() {
    const grids = document.querySelectorAll('.video-grid');
    grids.forEach(grid => {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: #aaa;">Loading videos...</div>';
    });
}

// ============================================================================
// VIDEO RENDERING
// ============================================================================

function createVideoCard(video) {
    const div = document.createElement('div');
    div.className = 'video-card';
    
    // Format view count
    let views = 'New';
    if (video.views) {
        const count = parseInt(video.views);
        if (count > 1000000) {
            views = (count / 1000000).toFixed(1) + 'M';
        } else if (count > 1000) {
            views = (count / 1000).toFixed(1) + 'K';
        } else {
            views = count.toString();
        }
    }

    const channelInitial = video.channel.charAt(0).toUpperCase();
    const placeholderColor = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][Math.floor(Math.random() * 6)];

    div.innerHTML = `
        <div class="video-thumbnail">
            <img src="${video.thumbnail}" alt="${video.title}" style="object-fit: cover;">
            <span class="video-duration">▶ YouTube</span>
        </div>
        <div class="video-info">
            <img src="https://via.placeholder.com/40/${placeholderColor.replace('#', '')}?text=${channelInitial}" alt="" class="video-avatar" style="border-radius: 50%; background: ${placeholderColor};">
            <div class="video-details">
                <p class="video-title">${video.title}</p>
                <p class="video-channel">${video.channel}</p>
                <p class="video-meta">${views} views</p>
            </div>
        </div>
    `;
    div.addEventListener('click', () => openVideo(video.youtubeId, video.title, video.channel, video.thumbnail));
    return div;
}

function renderVideos(videos, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    if (videos.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #888;">No videos found. Try a different search.</div>';
        return;
    }
    videos.forEach(v => container.appendChild(createVideoCard(v)));
}

async function updateHome() {
    const videos = await searchYouTubeVideos(state.searchTerm || 'technology', 12);
    renderVideos(videos, 'video-grid');
    const empty = document.getElementById('empty-state-home');
    if (empty) empty.style.display = 'none';
}

async function updateExplore() {
    const videos = await getTrendingVideos(12);
    renderVideos(videos, 'explore-grid');
    const empty = document.getElementById('empty-state-explore');
    if (empty) empty.style.display = 'none';
}

// ============================================================================
// NAVIGATION
// ============================================================================

function goToPage(pageName) {
    if (state.currentPage === 'player') {
        const iframe = document.getElementById('video-player');
        if (iframe) iframe.src = '';
    }
   
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(`page-${pageName}`);
    if (page) page.classList.add('active');
   
    // Sidebar animation
    document.querySelectorAll('[data-page]').forEach(link => {
        const isNowActive = link.getAttribute('data-page') === pageName;
        
        if (isNowActive && !link.classList.contains('active')) {
            link.classList.add('active', 'animating');
            link.addEventListener('animationend', function removeAnimating() {
                link.classList.remove('animating');
                link.removeEventListener('animationend', removeAnimating);
            });
        } else if (!isNowActive && link.classList.contains('active')) {
            link.classList.remove('active', 'animating');
        }
    });
   
    state.currentPage = pageName;
    closeSidebar();
   
    if (pageName === 'home') updateHome();
    else if (pageName === 'explore') updateExplore();
    else if (pageName === 'library') renderLibrary();
    else if (pageName === 'subscriptions') renderSubscriptions();
}

function openVideo(youtubeId, title, channel, thumbnail) {
    state.currentVideoId = youtubeId;
    
    const player = document.getElementById('video-player');
    if (player) player.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
   
    const titleEl = document.getElementById('player-title');
    const metaEl = document.getElementById('player-meta');
    const channelEl = document.getElementById('player-channel');
    const avatarEl = document.getElementById('channel-avatar');
   
    if (titleEl) titleEl.textContent = title;
    if (metaEl) metaEl.textContent = `YouTube Video`;
    if (channelEl) channelEl.textContent = channel;
    if (avatarEl) avatarEl.src = thumbnail;
   
    updatePlayerButtons();
    goToPage('player');
}

function updatePlayerButtons() {
    const id = state.currentVideoId;
    const likeBtn = document.getElementById('like-btn');
    const watchBtn = document.getElementById('watch-later-btn');
   
    if (likeBtn) {
        likeBtn.classList.toggle('active', storage.getLiked().includes(id));
    }
    if (watchBtn) {
        watchBtn.classList.toggle('active', storage.getWatchLater().includes(id));
    }
}

function refreshCurrentPage() {
    if (state.currentPage === 'library') renderLibrary();
}

// ============================================================================
// LIBRARY, SUBSCRIPTIONS, FILTERS
// ============================================================================

function updateLibraryCounts() {
    const historyCount = document.getElementById('history-count');
    const watchLaterCount = document.getElementById('watch-later-count');
    const likedCount = document.getElementById('liked-count');

    if (historyCount) historyCount.textContent = `${storage.getHistory().length} video${storage.getHistory().length === 1 ? '' : 's'}`;
    if (watchLaterCount) watchLaterCount.textContent = `${storage.getWatchLater().length} video${storage.getWatchLater().length === 1 ? '' : 's'}`;
    if (likedCount) likedCount.textContent = `${storage.getLiked().length} video${storage.getLiked().length === 1 ? '' : 's'}`;
}

function renderLibrary() {
    updateLibraryCounts();

    const tab = state.currentLibraryTab;
    const titleEl = document.getElementById('library-section-title');
    const emptyEl = document.getElementById('library-empty-state');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    document.querySelectorAll('.library-tab-card').forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-library-tab') === tab);
    });

    let count = 0;
    let title = 'History';
    let emptyText = 'No watch history';

    if (tab === 'history') {
        count = storage.getHistory().length;
        title = 'Watch History';
        emptyText = 'No watch history yet';
        if (clearHistoryBtn) clearHistoryBtn.style.display = count ? 'inline-block' : 'none';
    } else if (tab === 'watch-later') {
        count = storage.getWatchLater().length;
        title = 'Watch Later';
        emptyText = 'No saved videos in Watch Later';
        if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
    } else if (tab === 'liked') {
        count = storage.getLiked().length;
        title = 'Liked Videos';
        emptyText = 'No liked videos yet';
        if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
    }

    if (titleEl) titleEl.textContent = title;
    if (emptyEl) {
        emptyEl.textContent = emptyText;
        emptyEl.style.display = count ? 'none' : 'block';
    }
}

function renderSubscriptions() {
    const grid = document.getElementById('subscriptions-grid');
    const empty = document.getElementById('empty-state-subscriptions');
    if (!grid) return;
   
    const subscriptions = storage.getSubscriptions();
    grid.innerHTML = '';
    
    if (subscriptions.length === 0) {
        if (empty) empty.style.display = 'block';
        return;
    }

    subscriptions.forEach(name => {
        const div = document.createElement('div');
        div.className = 'subscription-card';
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        div.innerHTML = `
            <img src="https://via.placeholder.com/80/${color.replace('#', '')}?text=${name.charAt(0)}" alt="${name}" class="avatar">
            <p class="channel-name">${name}</p>
            <p class="channel-meta">YouTube Channel</p>
            <button class="subscription-toggle active" data-channel="${name}">
                Subscribed
            </button>
        `;
        const btn = div.querySelector('.subscription-toggle');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isNow = storage.toggleSubscription(name);
            btn.textContent = isNow ? 'Subscribed' : 'Subscribe';
            btn.classList.toggle('active');
        });
        grid.appendChild(div);
    });
   
    if (empty) empty.style.display = 'none';
}

// ============================================================================
// SEARCH & FILTERS
// ============================================================================

function initSearch() {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
   
    if (!form || !input) return;
   
    const performSearch = async (query) => {
        if (!query.trim()) return;
        state.searchTerm = query;
        const videos = await searchYouTubeVideos(state.searchTerm, 12);
        renderVideos(videos, 'video-grid');
    };
   
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch(input.value);
    });
}

function initCategoryFilters() {
    const filterContainer = (id, containerId) => {
        const container = document.getElementById(id);
        if (!container) return;
        container.addEventListener('click', async (e) => {
            if (!e.target.classList.contains('filter-btn')) return;
           
            container.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
           
            e.target.classList.add('active');
            const category = e.target.getAttribute('data-category');
            
            const videos = await searchYouTubeVideos(category, 12);
            renderVideos(videos, containerId);
        });
    };
   
    filterContainer('category-filters', 'video-grid');
    filterContainer('explore-filters', 'explore-grid');
}

// ============================================================================
// PLAYER BUTTONS, SIDEBAR, PANELS
// ============================================================================

function initPlayerButtons() {
    const likeBtn = document.getElementById('like-btn');
    const watchBtn = document.getElementById('watch-later-btn');
   
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            storage.toggleLiked(state.currentVideoId);
            likeBtn.classList.toggle('active');
            refreshCurrentPage();
        });
    }
   
    if (watchBtn) {
        watchBtn.addEventListener('click', () => {
            storage.toggleWatchLater(state.currentVideoId);
            watchBtn.classList.toggle('active');
            refreshCurrentPage();
        });
    }
   
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToPage('home');
        });
    }
}

function initNav() {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            goToPage(link.getAttribute('data-page'));
        });
    });
   
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            goToPage('home');
        });
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');
}

function initMobileSidebar() {
    const toggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
   
    if (!toggle || !sidebar) return;
   
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.toggle('open');
    });
   
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.sidebar') && !e.target.closest('.menu-toggle')) {
            closeSidebar();
        }
    });
}

function initPanels() {
    const setupPanel = (btnId, panelId, closeId = null) => {
        const btn = document.getElementById(btnId);
        const panel = document.getElementById(panelId);
       
        if (!btn || !panel) return;
       
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllPanels();
            panel.classList.add('active');
        });
       
        if (closeId) {
            const closeBtn = document.getElementById(closeId);
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    panel.classList.remove('active');
                });
            }
        }
    };
   
    const closeAllPanels = () => {
        document.getElementById('upload-modal')?.classList.remove('active');
        document.getElementById('notifications-panel')?.classList.remove('active');
        document.getElementById('profile-panel')?.classList.remove('active');
    };
   
    setupPanel('upload-btn', 'upload-modal', 'upload-close');
    setupPanel('notifications-btn', 'notifications-panel', 'notifications-close');
    setupPanel('profile-btn', 'profile-panel');
   
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-actions') && !e.target.closest('.panel') && !e.target.closest('.modal')) {
            closeAllPanels();
        }
    });
}

function initLibrary() {
    const tabsContainer = document.getElementById('library-tabs');
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.library-tab-card');
            if (!card) return;
            e.preventDefault();
            const tabName = card.getAttribute('data-library-tab');
            if (tabName) {
                state.currentLibraryTab = tabName;
                renderLibrary();
            }
        });
    }

    const clearHistoryBtn = document.getElementById('clear-history-btn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            storage.clearHistory();
            renderLibrary();
        });
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    // Check if API key is set
    if (!API_KEY) {
        console.error('YouTube API Key not set!');
        alert('YouTube API Key not configured. Please check index.html');
        return;
    }
    
    console.log('API Key loaded, fetching initial videos...');
    
    // Load initial videos (search)
    const initialVideos = await searchYouTubeVideos(state.searchTerm, 12);
    renderVideos(initialVideos, 'video-grid');
    
    // Preload trending videos for explore
    setTimeout(async () => {
        const trendingVideos = await getTrendingVideos(12);
        if (trendingVideos.length > 0) {
            console.log('Trending videos cached');
        }
    }, 1000);
   
    initSearch();
    initCategoryFilters();
    initPlayerButtons();
    initNav();
    initMobileSidebar();
    initPanels();
    initLibrary();
   
    goToPage('home');
});