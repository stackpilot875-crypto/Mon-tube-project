// ============================================================================
// MON-TUBE - Clean JavaScript
// ============================================================================

// VIDEO DATA
const VIDEOS = [
    { id: 1, title: 'Amazing Discoveries in Modern Technology', channel: 'Tech Explore Channel', views: '245K', date: '2 days ago', duration: '12:45', category: 'Technology', youtubeId: 'y8OnoxKSXOU' },
    { id: 2, title: 'Complete Guide to Morning Routine', channel: 'Daily Wellness Tips', views: '1.2M', date: '1 week ago', duration: '8:30', category: 'Education', youtubeId: 'dQw4w9WgXcQ' },
    { id: 3, title: 'Gaming Tournament Highlights 2024', channel: 'Pro Gaming Arena', views: '892K', date: '3 days ago', duration: '15:12', category: 'Gaming', youtubeId: 'ZZ5LpwO-An4' },
    { id: 4, title: 'Cooking the Perfect Pasta from Scratch', channel: 'Culinary Masterclass', views: '567K', date: '5 days ago', duration: '22:05', category: 'Cooking', youtubeId: 'OIvHMR3G_rE' },
    { id: 5, title: 'Travel Vlog: Exploring Hidden Gems in Europe', channel: 'World Wanderer', views: '2.3M', date: '1 day ago', duration: '19:33', category: 'Travel', youtubeId: 'W0LHQG18plc' },
    { id: 6, title: 'Web Development Tips for Beginners', channel: 'Code Academy', views: '445K', date: '4 days ago', duration: '11:20', category: 'Technology', youtubeId: 'qz0aGYrrlhU' },
    { id: 7, title: 'Fitness Challenge: 30 Days Transformation', channel: 'Fitness Revolution', views: '1.8M', date: '2 weeks ago', duration: '30:15', category: 'Sports', youtubeId: 'nUUz5hsP8nc' },
    { id: 8, title: 'Music Production Studio Tour and Equipment Guide', channel: 'Sound Studio Secrets', views: '634K', date: '6 days ago', duration: '13:47', category: 'Music', youtubeId: 'AhWHyeXHN24' },
    { id: 9, title: 'Documentary: The History of Animation', channel: 'Creative Minds Studio', views: '756K', date: '10 days ago', duration: '25:58', category: 'Education', youtubeId: '_eSS-aVy74c' },
    { id: 10, title: 'Photography Masterclass: Lighting and Composition', channel: 'Visual Arts Academy', views: '328K', date: '3 weeks ago', duration: '16:42', category: 'Education', youtubeId: '4Ky_5J78GF4' },
    { id: 11, title: 'DIY Home Improvement Projects on a Budget', channel: 'Home & Design', views: '912K', date: '8 days ago', duration: '9:55', category: 'Cooking', youtubeId: '6HjLe-1wkPk' },
    { id: 12, title: 'Space Exploration: Latest NASA Missions Explained', channel: 'Science Explorer', views: '1.5M', date: '12 days ago', duration: '21:18', category: 'Technology', youtubeId: 'kKKM8Y-u7ds' }
];

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><circle cx='20' cy='20' r='20' fill='%23272727'/><circle cx='20' cy='15' r='6' fill='%23aaaaaa'/><path d='M10 32c0-5.5 4.5-8 10-8s10 2.5 10 8' fill='%23aaaaaa'/></svg>";

// APPLICATION STATE
const state = {
    currentPage: 'home',
    currentCategory: 'All',
    searchTerm: '',
    currentVideoId: null,
    currentLibraryTab: 'history'
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

// UTILITY FUNCTIONS
function getVideo(id) {
    return VIDEOS.find(v => v.id === id);
}

function getThumbnail(youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

function getFilteredVideos() {
    let filtered = VIDEOS;
    
    if (state.currentCategory !== 'All') {
        filtered = filtered.filter(v => v.category === state.currentCategory);
    }
    
    if (state.searchTerm.trim()) {
        const term = state.searchTerm.toLowerCase().trim();
        filtered = filtered.filter(v => 
            v.title.toLowerCase().includes(term) || 
            v.channel.toLowerCase().includes(term)
        );
    }
    
    return filtered;
}

// VIDEO RENDERING
function createVideoCard(video) {
    const div = document.createElement('div');
    div.className = 'video-card';
    div.innerHTML = `
        <div class="video-thumbnail">
            <img src="${getThumbnail(video.youtubeId)}" alt="${video.title}">
            <span class="video-duration">${video.duration}</span>
        </div>
        <div class="video-info">
            <img src="${DEFAULT_AVATAR}" alt="" class="video-avatar">
            <div class="video-details">
                <p class="video-title">${video.title}</p>
                <p class="video-channel">${video.channel}</p>
                <p class="video-meta">${video.views} • ${video.date}</p>
            </div>
        </div>
    `;
    div.addEventListener('click', () => openVideo(video.id));
    return div;
}

function renderVideos(videos, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    videos.forEach(v => container.appendChild(createVideoCard(v)));
}

function updateHome() {
    const filtered = getFilteredVideos();
    renderVideos(filtered, 'video-grid');
    const empty = document.getElementById('empty-state-home');
    if (empty) empty.style.display = filtered.length ? 'none' : 'block';
}

function updateExplore() {
    const filtered = getFilteredVideos();
    renderVideos(filtered, 'explore-grid');
    const empty = document.getElementById('empty-state-explore');
    if (empty) empty.style.display = filtered.length ? 'none' : 'block';
}

// NAVIGATION
function goToPage(pageName) {
    if (state.currentPage === 'player') {
        const iframe = document.getElementById('video-player');
        if (iframe) iframe.src = '';
    }
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(`page-${pageName}`);
    if (page) page.classList.add('active');
    
    document.querySelectorAll('[data-page]').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-page') === pageName);
    });
    
    state.currentPage = pageName;
    
    closeSidebar();
    
    if (pageName === 'home') updateHome();
    else if (pageName === 'explore') updateExplore();
    else if (pageName === 'library') renderLibrary();
    else if (pageName === 'subscriptions') renderSubscriptions();
}

function openVideo(id) {
    const video = getVideo(id);
    if (!video) return;
    
    storage.addHistory(id);
    state.currentVideoId = id;
    
    const player = document.getElementById('video-player');
    if (player) player.src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`;
    
    const title = document.getElementById('player-title');
    const meta = document.getElementById('player-meta');
    const channel = document.getElementById('player-channel');
    const avatar = document.getElementById('channel-avatar');
    
    if (title) title.textContent = video.title;
    if (meta) meta.textContent = `${video.views} views • ${video.date}`;
    if (channel) channel.textContent = video.channel;
    if (avatar) avatar.src = getThumbnail(video.youtubeId);
    
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

// LIBRARY RENDERING & COUNTS
function updateLibraryCounts() {
    const historyVideos = storage.getHistory().map(getVideo).filter(Boolean);
    const watchLaterVideos = storage.getWatchLater().map(getVideo).filter(Boolean);
    const likedVideos = storage.getLiked().map(getVideo).filter(Boolean);

    const historyCount = document.getElementById('history-count');
    const watchLaterCount = document.getElementById('watch-later-count');
    const likedCount = document.getElementById('liked-count');

    if (historyCount) historyCount.textContent = `${historyVideos.length} video${historyVideos.length === 1 ? '' : 's'}`;
    if (watchLaterCount) watchLaterCount.textContent = `${watchLaterVideos.length} video${watchLaterVideos.length === 1 ? '' : 's'}`;
    if (likedCount) likedCount.textContent = `${likedVideos.length} video${likedVideos.length === 1 ? '' : 's'}`;
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

    let videos = [];
    let title = 'History';
    let emptyText = 'No watch history';

    if (tab === 'history') {
        videos = storage.getHistory().map(getVideo).filter(Boolean);
        title = 'Watch History';
        emptyText = 'No watch history yet';
        if (clearHistoryBtn) clearHistoryBtn.style.display = videos.length ? 'inline-block' : 'none';
    } else if (tab === 'watch-later') {
        videos = storage.getWatchLater().map(getVideo).filter(Boolean);
        title = 'Watch Later';
        emptyText = 'No saved videos in Watch Later';
        if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
    } else if (tab === 'liked') {
        videos = storage.getLiked().map(getVideo).filter(Boolean);
        title = 'Liked Videos';
        emptyText = 'No liked videos yet';
        if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
    }

    if (titleEl) titleEl.textContent = title;
    renderVideos(videos, 'library-video-grid');
    if (emptyEl) {
        emptyEl.textContent = emptyText;
        emptyEl.style.display = videos.length ? 'none' : 'block';
    }
}

// SUBSCRIPTIONS
function renderSubscriptions() {
    const grid = document.getElementById('subscriptions-grid');
    const empty = document.getElementById('empty-state-subscriptions');
    if (!grid) return;
    
    const channels = [...new Set(VIDEOS.map(v => v.channel))];
    const subscriptions = storage.getSubscriptions();
    
    grid.innerHTML = '';
    channels.forEach(name => {
        const isSubscribed = subscriptions.includes(name);
        const div = document.createElement('div');
        div.className = 'subscription-card';
        div.innerHTML = `
            <img src="${DEFAULT_AVATAR}" alt="${name}" class="avatar">
            <p class="channel-name">${name}</p>
            <p class="channel-meta">Sample channel</p>
            <button class="subscription-toggle ${isSubscribed ? 'active' : ''}" data-channel="${name}">
                ${isSubscribed ? 'Subscribed' : 'Subscribe'}
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
    
    if (empty) empty.style.display = subscriptions.length ? 'none' : 'block';
}

// CATEGORY FILTERS
function initCategoryFilters() {
    const filterContainer = (id, pageUpdate) => {
        const container = document.getElementById(id);
        if (!container) return;
        container.addEventListener('click', (e) => {
            if (!e.target.classList.contains('filter-btn')) return;
            
            container.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            e.target.classList.add('active');
            state.currentCategory = e.target.getAttribute('data-category');
            pageUpdate();
        });
    };
    
    filterContainer('category-filters', updateHome);
    filterContainer('explore-filters', updateExplore);
}

// SEARCH
function initSearch() {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    
    if (!form || !input) return;
    
    const performSearch = () => {
        state.searchTerm = input.value;
        updateHome();
    };
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch();
    });
    
    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// PLAYER BUTTONS
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

// NAVIGATION LINKS
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

// SIDEBAR
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

// HEADER PANELS
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

// LIBRARY NAVIGATION & TABS
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

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    renderVideos(VIDEOS, 'video-grid');
    renderVideos(VIDEOS, 'explore-grid');
    
    initCategoryFilters();
    initSearch();
    initPlayerButtons();
    initNav();
    initMobileSidebar();
    initPanels();
    initLibrary();
    
    goToPage('home');
});