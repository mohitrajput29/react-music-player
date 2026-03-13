// Music Data Let's use some reliable URLs
const songs = [
    {
        id: 1,
        title: "Energy",
        artist: "Benjamin Tissot",
        cover: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f92b?q=80&w=500&auto=format&fit=crop",
        src: "https://www.bensound.com/bensound-music/bensound-energy.mp3"
    },
    {
        id: 2,
        title: "Acoustic Breeze",
        artist: "Benjamin Tissot",
        cover: "https://images.unsplash.com/photo-1458560871784-56d23406c091?q=80&w=500&auto=format&fit=crop",
        src: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3"
    },
    {
        id: 3,
        title: "Creative Minds",
        artist: "Benjamin Tissot",
        cover: "https://images.unsplash.com/photo-1516280440502-38b816a3a78d?q=80&w=500&auto=format&fit=crop",
        src: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3"
    },
    {
        id: 4,
        title: "Going Higher",
        artist: "Benjamin Tissot",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500&auto=format&fit=crop",
        src: "https://www.bensound.com/bensound-music/bensound-goinghigher.mp3"
    },
    {
        id: 5,
        title: "Memories",
        artist: "Benjamin Tissot",
        cover: "https://images.unsplash.com/photo-1522869635100-9f4c5e86af9a?q=80&w=500&auto=format&fit=crop",
        src: "https://www.bensound.com/bensound-music/bensound-memories.mp3"
    },
    {
        id: 6,
        title: "November",
        artist: "Benjamin Tissot",
        cover: "https://images.unsplash.com/photo-1502759683299-cdcd6974244f?q=80&w=500&auto=format&fit=crop",
        src: "https://www.bensound.com/bensound-music/bensound-november.mp3"
    }
];

// App State
let currentSongIndex = 0;
let isPlaying = false;
let favorites = new Set();
let currentFilter = 'all'; // 'all' or 'favorites'

// DOM Elements
const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progressArea = document.getElementById('progress-area');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');

const currentTitle = document.getElementById('current-title');
const currentArtist = document.getElementById('current-artist');
const currentCover = document.getElementById('current-cover');
const coverArt = document.getElementById('cover-art');
const favMainBtn = document.getElementById('fav-btn');

const playlistEl = document.getElementById('playlist');
const searchInput = document.getElementById('search-input');
const tabAll = document.getElementById('tab-all');
const tabFavorites = document.getElementById('tab-favorites');
const themeToggle = document.getElementById('theme-toggle');

const volumeArea = document.getElementById('volume-area');
const volumeBar = document.getElementById('volume-bar');
const volumeIcon = document.getElementById('volume-icon');

// Initialize App
function initApp() {
    // Load favorites from local storage if available
    const savedFavs = localStorage.getItem('aura-favorites');
    if (savedFavs) {
        favorites = new Set(JSON.parse(savedFavs));
    }

    loadSong(currentSongIndex);
    renderPlaylist();
    setupEventListeners();
}

// Load Song
function loadSong(index) {
    const song = songs[index];
    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    currentCover.src = song.cover;
    audio.src = song.src;
    
    updateMainFavoriteIcon(song.id);
    highlightCurrentSong();
    
    // Reset progress
    progressBar.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    totalDurationEl.textContent = '--:--';

    // Update cover art animation state
    if (isPlaying) {
        audio.play().catch(e => console.log('Audio play failed:', e));
        coverArt.classList.add('playing');
    } else {
        coverArt.classList.remove('playing');
    }
}

// Play/Pause
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playIcon.classList.remove('ri-pause-fill');
        playIcon.classList.add('ri-play-fill');
        coverArt.classList.remove('playing');
    } else {
        audio.play().catch(e => console.log('Audio play failed:', e));
        playIcon.classList.remove('ri-play-fill');
        playIcon.classList.add('ri-pause-fill');
        coverArt.classList.add('playing');
    }
    isPlaying = !isPlaying;
}

// Next Song
function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    if (!isPlaying) togglePlay();
}

// Previous Song
function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    if (!isPlaying) togglePlay();
}

// Update Progress
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (isNaN(duration)) return;

    // Update progress bar
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Calculate time
    let currentMins = Math.floor(currentTime / 60);
    let currentSecs = Math.floor(currentTime % 60);
    if (currentSecs < 10) currentSecs = `0${currentSecs}`;
    currentTimeEl.textContent = `${currentMins}:${currentSecs}`;

    let totalMins = Math.floor(duration / 60);
    let totalSecs = Math.floor(duration % 60);
    if (totalSecs < 10) totalSecs = `0${totalSecs}`;
    if (totalMins || totalSecs) {
        totalDurationEl.textContent = `${totalMins}:${totalSecs}`;
    }
}

// Set Progress
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (isNaN(duration)) return;
    audio.currentTime = (clickX / width) * duration;
}

// Set Volume
function setVolume(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    let volumePercent = clickX / width;
    
    // Bounds checking
    if (volumePercent < 0) volumePercent = 0;
    if (volumePercent > 1) volumePercent = 1;
    
    audio.volume = volumePercent;
    volumeBar.style.width = `${volumePercent * 100}%`;
    
    // Update icon
    if (volumePercent === 0) {
        volumeIcon.className = 'ri-volume-mute-fill';
    } else if (volumePercent < 0.5) {
        volumeIcon.className = 'ri-volume-down-fill';
    } else {
        volumeIcon.className = 'ri-volume-up-fill';
    }
}

// Render Playlist
function renderPlaylist() {
    playlistEl.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase();
    
    songs.forEach((song, index) => {
        // Filter by favorites
        if (currentFilter === 'favorites' && !favorites.has(song.id)) return;
        
        // Filter by search
        if (!song.title.toLowerCase().includes(searchTerm) && 
            !song.artist.toLowerCase().includes(searchTerm)) return;

        const isFav = favorites.has(song.id);
        
        const songItem = document.createElement('div');
        songItem.classList.add('song-item');
        if (index === currentSongIndex) songItem.classList.add('active');
        
        songItem.innerHTML = `
            <img src="${song.cover}" alt="cover" class="song-item-cover">
            <div class="song-item-info">
                <div class="song-item-title">${song.title}</div>
                <div class="song-item-artist">${song.artist}</div>
            </div>
            <button class="song-item-fav ${isFav ? 'favorited' : ''}" data-id="${song.id}">
                <i class="ri-heart-${isFav ? 'fill' : 'line'}"></i>
            </button>
        `;
        
        // Play song on click
        songItem.addEventListener('click', (e) => {
            // Don't play if clicked on favorite button
            if (e.target.closest('.song-item-fav')) return;
            
            currentSongIndex = index;
            loadSong(currentSongIndex);
            if (!isPlaying) togglePlay();
        });
        
        // Favorite button click
        const favBtn = songItem.querySelector('.song-item-fav');
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(song.id);
        });

        playlistEl.appendChild(songItem);
    });
}

// Toggle Favorite
function toggleFavorite(id) {
    if (favorites.has(id)) {
        favorites.delete(id);
    } else {
        favorites.add(id);
    }
    
    // Save to local storage
    localStorage.setItem('aura-favorites', JSON.stringify([...favorites]));
    
    // Re-render playlist if needed
    if (currentFilter === 'favorites') {
        renderPlaylist();
    } else {
        // Just update icons without re-rendering everything
        renderPlaylist(); 
    }
    
    // Update main playing screen fav icon if it's the current song
    const currentSongId = songs[currentSongIndex].id;
    if (id === currentSongId) {
        updateMainFavoriteIcon(id);
    }
}

function updateMainFavoriteIcon(id) {
    const isFav = favorites.has(id);
    const icon = favMainBtn.querySelector('i');
    if (isFav) {
        favMainBtn.classList.add('favorited');
        icon.className = 'ri-heart-fill';
    } else {
        favMainBtn.classList.remove('favorited');
        icon.className = 'ri-heart-line';
    }
}

// Highlight Current Song
function highlightCurrentSong() {
    const items = playlistEl.querySelectorAll('.song-item');
    // Re-rendering happens on next/prev to ensure correct index logic
    // So we can just call renderPlaylist if needed, or manually manage classes.
    // Calling renderPlaylist is cleaner given search/filter states.
    renderPlaylist();
}

// Theme Toggle
function toggleTheme() {
    const htmlEl = document.documentElement;
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', newTheme);
    
    // Update Icon
    const icon = themeToggle.querySelector('i');
    if (newTheme === 'dark') {
        icon.className = 'ri-sun-line';
    } else {
        icon.className = 'ri-moon-line';
    }
}

function setupEventListeners() {
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
    
    progressArea.addEventListener('click', setProgress);
    volumeArea.addEventListener('click', setVolume);
    
    searchInput.addEventListener('input', renderPlaylist);
    
    tabAll.addEventListener('click', () => {
        currentFilter = 'all';
        tabAll.classList.add('active');
        tabFavorites.classList.remove('active');
        renderPlaylist();
    });
    
    tabFavorites.addEventListener('click', () => {
        currentFilter = 'favorites';
        tabFavorites.classList.add('active');
        tabAll.classList.remove('active');
        renderPlaylist();
    });
    
    favMainBtn.addEventListener('click', () => {
        const currentSongId = songs[currentSongIndex].id;
        toggleFavorite(currentSongId);
    });
    
    themeToggle.addEventListener('click', toggleTheme);
}

// Start
initApp();
