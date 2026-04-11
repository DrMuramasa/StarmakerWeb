// --- DATABASE FETCH ENGINE ---
let characterData = []; // Full raw list
let filteredData = [];  // Filtered list for the grid

async function initDatabase() {
    try {
        const response = await fetch('database.json');
        const rawData = await response.json();
        
        // Normalize: supports both raw arrays and {"characters": [...]} objects
        characterData = Array.isArray(rawData) ? rawData : (rawData.characters || []);
        
        // Initial filter run (to apply saved share preferences)
        applyFilters();
        
    } catch (error) {
        console.error("CRITICAL ERROR: Failed to load database.json!", error);
    }
}

// Fire the engine immediately
initDatabase();

// --- NEW: FILTER & SEARCH ENGINE ---
function applyFilters() {
    const searchInput = document.getElementById('char-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    
    // Get share state from localStorage (default to 'true' if not set)
    const isShareEnabled = localStorage.getItem('sm_share_enabled') !== 'false';

    filteredData = characterData.filter(char => {
        // 1. Name Search Check
        const nameMatch = char.name.toLowerCase().includes(searchTerm);

        // 2. Share Content Check
        // Scans the sprite path or folder name for "share" or "shared"
        const path = (char.sprite || "").toLowerCase();
        const isSharedAsset = path.includes("share") || path.includes("shared");
        
        // If shared assets are DISABLED, we only return items that ARE NOT shared.
        const shareMatch = isShareEnabled ? true : !isSharedAsset;

        return nameMatch && shareMatch;
    });

    // Redraw the grid with the filtered results
    if (typeof renderCharacterGrid === 'function') {
        renderCharacterGrid();
    }
}

// Function to call when typing in the search bar
function handleSearch(val) {
    applyFilters();
}

// Function to toggle the share filter
function toggleShareFilter() {
    if (typeof playSnd === 'function') playSnd(); // Keep that squish sound!
    
    const currentState = localStorage.getItem('sm_share_enabled') !== 'false';
    const newState = !currentState;
    
    localStorage.setItem('sm_share_enabled', newState);
    
    // Update the button UI if it exists
    updateShareBtnUI(newState);
    
    applyFilters();
}

function updateShareBtnUI(isEnabled) {
    const btn = document.getElementById('share-filter-btn');
    if (btn) {
        btn.innerText = isEnabled ? "📂 SHARED: ON" : "📂 SHARED: OFF";
        btn.style.borderColor = isEnabled ? "#00ff00" : "#ff4466";
        btn.style.color = isEnabled ? "#00ff00" : "#ff4466";
    }
}

// --- NO CHANGES TO THE REST OF YOUR UTILITIES BELOW ---

// --- 1. CORE UTILITIES (Audio, Mute, Volume) ---
let storedVol = localStorage.getItem('sm_volume');
let previousVolume = storedVol !== null ? parseFloat(storedVol) : 0.5;
let isMuted = localStorage.getItem('sm_muted') === 'true'; 

function updateMuteIcon() {
    const btn = document.getElementById('mute-btn');
    if (btn) btn.innerText = isMuted ? "🔈" : "🔊"; 
}

function updateVolume(val) {
    if (typeof bgMusic !== 'undefined') {
        bgMusic.volume = val;
        localStorage.setItem('sm_volume', val);
        if (val == 0 && !isMuted) { isMuted = true; localStorage.setItem('sm_muted', 'true'); } 
        else if (val > 0 && isMuted) { isMuted = false; localStorage.setItem('sm_muted', 'false'); }
        updateMuteIcon();
    }
}

function toggleMute() {
    const slider = document.getElementById('volume-slider');
    if (typeof bgMusic === 'undefined') return;
    if (!isMuted) {
        previousVolume = bgMusic.volume > 0 ? bgMusic.volume : 0.5;
        bgMusic.volume = 0; if (slider) slider.value = 0; isMuted = true;
    } else {
        let restoreVol = previousVolume > 0 ? previousVolume : 0.5;
        bgMusic.volume = restoreVol; if (slider) slider.value = restoreVol; isMuted = false;
    }
    localStorage.setItem('sm_muted', isMuted);
    updateMuteIcon();
}

// --- 2. GLOBAL SOUND ENGINE ---
if (typeof bgMusic === 'undefined') {
    var bgMusic = new Audio('audio/background_theme.mp3');
    bgMusic.loop = true;
    bgMusic.addEventListener('timeupdate', function() {
        var buffer = 0.40;
        if(this.currentTime > this.duration - buffer) { this.currentTime = 0; this.play(); }
    });
}
if (typeof squishSnd === 'undefined') { var squishSnd = new Audio('audio/squish.mp3'); }
function playSnd() {
    if (typeof squishSnd !== 'undefined') {
        squishSnd.currentTime = 0;
        squishSnd.volume = (typeof bgMusic !== 'undefined') ? bgMusic.volume : 0.5;
        squishSnd.play().catch(() => {});
    }
}

// --- 3. UPDATED MUSIC ENGINE ---
function initMusic(defaultTrack = 'audio/background_theme.mp3') {
    const savedTrack = localStorage.getItem('sm_preferred_track') || defaultTrack;
    let targetVol = isMuted ? 0 : previousVolume; 
    const savedTime = parseFloat(localStorage.getItem('sm_music_time')) || 0;
    if (typeof bgMusic !== 'undefined') {
        if (!bgMusic.src.includes(savedTrack)) bgMusic.src = savedTrack;
        bgMusic.volume = 0; bgMusic.currentTime = savedTime;
        bgMusic.play().then(() => {
            if (!isMuted) {
                let currentFadeVol = 0;
                const fadeInterval = setInterval(() => {
                    if (currentFadeVol < targetVol) {
                        currentFadeVol += 0.05;
                        bgMusic.volume = Math.min(currentFadeVol, targetVol);
                    } else { clearInterval(fadeInterval); updateMuteIcon(); }
                }, 50);
            } else { updateMuteIcon(); }
        }).catch(() => {
            document.addEventListener('click', () => {
                bgMusic.play(); bgMusic.volume = targetVol; updateMuteIcon();
            }, { once: true });
        });
    }
    const slider = document.getElementById('volume-slider');
    if (slider) slider.value = targetVol;
    const trackLabel = localStorage.getItem('sm_track_label') || "Default Theme";
    const trackNameDisplay = document.getElementById('current-track-name');
    if (trackNameDisplay) trackNameDisplay.innerText = "PLAYING: " + trackLabel;
}


// --- 4. NAVIGATION & SETTINGS TOGGLES ---
function toggleSettings() {
    if (typeof playSnd === 'function') playSnd();
    const modal = document.getElementById('settings-modal');
    if (!modal) return;
    if (modal.style.getPropertyValue('display') === 'flex') {
        modal.style.setProperty('display', 'none', 'important');
    } else {
        modal.style.setProperty('display', 'flex', 'important');
    }
}

function toggleCRT() {
    if (typeof playSnd === 'function') playSnd();
    const overlay = document.getElementById('global-crt');
    const badge = document.getElementById('crt-badge');
    const btn = document.querySelector('button[onclick="toggleCRT()"]');
    if (overlay) {
        overlay.classList.toggle('active');
        const isActive = overlay.classList.contains('active');
        localStorage.setItem('sm_crt_enabled', isActive);
        document.body.classList.toggle('crt-active', isActive);
        if (badge) isActive ? badge.classList.add('active') : badge.classList.remove('active');
        if (btn) {
            btn.innerText = isActive ? "📺 CRT MODE: ON" : "📺 CRT MODE: OFF";
            btn.style.color = isActive ? "#00ff00" : "#ff4466";
            btn.style.borderColor = isActive ? "#00ff00" : "#ff4466";
        }
    }
}

function toggleMenu() {
    if (typeof playSnd === 'function') playSnd();
    const nav = document.getElementById('main-nav');
    const modal = document.getElementById('settings-modal');
    if (nav) {
        nav.classList.toggle('active');
        if (!nav.classList.contains('active') && modal) {
            modal.style.setProperty('display', 'none', 'important');
        }
    }
}

// --- 5. ULTIMATE GLOBAL SWIPE ENGINE ---
let touchstartX = 0; let touchendX = 0;
function handleGesture() {
    const swipeThreshold = 50;
    if (touchendX < touchstartX - swipeThreshold && typeof changeImage === 'function') changeImage(1); 
    if (touchendX > touchstartX + swipeThreshold && typeof changeImage === 'function') changeImage(-1);
}
document.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, {passive: true});
document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    const isSwipeable = e.target.closest('.lightbox') || e.target.closest('.sprite-window') || e.target.closest('.char-image-box') || e.target.closest('#lightbox-modal');
    if (isSwipeable) handleGesture();
}, {passive: true});

setInterval(() => {
    if (typeof bgMusic !== 'undefined' && !bgMusic.paused) {
        localStorage.setItem('sm_music_time', bgMusic.currentTime);
    }
}, 1000);

// --- 6. PAGE LOAD INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    // 1. Audio Setup
    let targetVol = isMuted ? 0 : previousVolume;
    const slider = document.getElementById('volume-slider');
    if (slider) slider.value = targetVol;
    if (typeof bgMusic !== 'undefined') bgMusic.volume = targetVol;
    updateMuteIcon();

    // 2. Inject CRT Overlay Globally
    if (!document.getElementById('global-crt')) {
        const crtDiv = document.createElement('div');
        crtDiv.id = 'global-crt'; crtDiv.className = 'crt-overlay';
        document.body.appendChild(crtDiv);
    }

    // 3. Inject CRT Indicator Badge
    const headerTitle = document.querySelector('header div');
    let badge = document.getElementById('crt-badge');
    if (headerTitle && !badge) {
        badge = document.createElement('span');
        badge.id = 'crt-badge'; badge.className = 'crt-indicator';
        badge.innerText = 'CRT';
        headerTitle.appendChild(badge); 
    }

    // 4. Inject Glitch Screen
    if (!document.getElementById('glitch-screen')) {
        const glitchDiv = document.createElement('div');
        glitchDiv.id = 'glitch-screen';
        document.body.appendChild(glitchDiv);
    }

    // 5. Apply Saved States
    const isCrtEnabled = localStorage.getItem('sm_crt_enabled') === 'true';
    if (isCrtEnabled) {
        document.getElementById('global-crt').classList.add('active');
        if (badge) badge.classList.add('active');
        document.body.classList.add('crt-active');
    }
    
    // Initialize Share Button UI
    updateShareBtnUI(localStorage.getItem('sm_share_enabled') !== 'false');

    // 6. Navigation Links with Glitch
    document.querySelectorAll('a.nav-btn').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetURL = link.getAttribute('href');
            if (targetURL && targetURL.includes('.html')) {
                e.preventDefault(); if (typeof playSnd === 'function') playSnd(); 
                if (localStorage.getItem('sm_crt_enabled') === 'true') {
                    const glitch = document.getElementById('glitch-screen');
                    if (glitch) glitch.classList.add('active');
                    setTimeout(() => { window.location.href = targetURL; }, 250); 
                } else { window.location.href = targetURL; }
            }
        });
    });
});

function goHome() {
    if (typeof playSnd === 'function') playSnd(); 
    if (localStorage.getItem('sm_crt_enabled') === 'true') {
        const glitch = document.getElementById('glitch-screen');
        if (glitch) glitch.classList.add('active');
        setTimeout(() => { window.location.href = 'home.html'; }, 250); 
    } else { window.location.href = 'home.html'; }
}
