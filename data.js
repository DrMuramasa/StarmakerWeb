const characterData = {
    "josef": {
        name: "Josef", 
        bio: "Household head and primary guardian. Can be convinced to stay or leave depending on your influence.",
        sprite: "images/characters/Josef/josef_sprite.png", 
        bg: "images/characters/Josef/Josef_BG.jpg",
        quests: [
            { 
                name: "The Entrance Method", 
                title: "Friday Beer Strategy", 
                desc: "Meet Josef on Fridays to decide his fate.", 
                steps: [
                    {t: "Reach 3 Hearts with Anna", r: "Unlocks Josef at entrance"},
                    {t: "Give Beer on Friday (x2)", r: "Builds rapport"},
                    {t: "Reach 4 Hearts with Anna", r: "Triggers final stage"},
                    {t: "Give 3rd Beer & Explain Starmaker", r: "Stay/Leave choice unlocked"}
                ] 
            },
            { 
                name: "The Isabella Method", 
                title: "Sharing Isabella", 
                desc: "Alternative route after the sharing session.", 
                steps: [
                    {t: "Dialog: 'Yeah, it was pretty hot...'", r: "Leads to further questions"},
                    {t: "Dialog: 'Sandwich some more asses?'", r: "Josef Stays + Starts Anna Sharing"}
                ] 
            }
        ]
    },
    "amelia": {
        name: "Amelia", 
        bio: "Cafe owner and fitness enthusiast.",
        sprite: "images/characters/Amelia/ameliaBase_sprite.png", 
        bg: "images/characters/Amelia/Amelia_BG.png",
        quests: [
            { 
                name: "Coffee Shop", 
                title: "Shift Work", 
                desc: "Visit Amelia during work.", 
                steps: [{t: "Work 3 shifts", r: "Requires 1000 Subs"}] 
            }
        ]
    },
    "emma": {
        name: "Emma",
        bio: "The high-energy fitness buff with a hidden supernatural curiosity.",
        sprite: "images/characters/Emma/emmabase_sprite.png",
        bg: "images/characters/Emma/Emma_BG.png",
        quests: [
            { 
                name: "Sauna Sessions", 
                title: "Heat of the Moment", 
                desc: "Meet Emma in the sauna once per week.", 
                steps: [
                    {t: "Visit 1 & 2", r: "Builds tension"},
                    {t: "Visit 3 Choice", r: "Fight urges (Solo) or Reveal Mario (Sharing)"}
                ] 
            },
            {
                name: "Cryptid Hunter",
                title: "The Farm Experiments",
                desc: "Help Emma research local legends.",
                steps: [
                    {t: "Invite to Farm", r: "Unlocks research lab"},
                    {t: "Tuesday Hunt", r: "Find Bigfoot, Lizardman, and Vampire"}
                ]
            }
        ]
    },
    "evelyn": {
        name: "Evelyn",
        bio: "The brilliant and clinical scientist working out of a hidden lab.",
        sprite: "images/characters/Evelyn/Everlyn_sprite.png",
        bg: "images/characters/Evelyn/Evelyn_BG.png",
        quests: [
            { 
                name: "The Hidden Lab", 
                title: "Warehouse Secrets", 
                desc: "Find Evelyn's lab through the Foundry and Harbor.", 
                steps: [
                    {t: "Unlock Studio Raw Sex", r: "Triggers hospital meeting"},
                    {t: "Path: Foundry > Harbor > Warehouse", r: "Accesses the Lab"}
                ] 
            },
            {
                name: "Alchemy",
                title: "Genetic Modification",
                desc: "Trade monster parts for powerful enhancements.",
                steps: [
                    {t: "Collect Materials", r: "Need Spit, Hair, and Tears"},
                    {t: "Create Pills", r: "Unlocks Booba, Futa, and Cum mods"}
                ]
            }
        ]
    },
    "toni": {
        name: "Toni",
        bio: "The street-racing mechanic with a heavy debt and a fast car.",
        sprite: "images/characters/Toni/ToniBar_sprite.png",
        bg: "images/characters/Toni/Toni_BG.png",
        quests: [
            { 
                name: "Squirt Racing", 
                title: "The Badlands Debt", 
                desc: "Win races to clear Toni's $60k debt.", 
                steps: [
                    {t: "Pay Entry Fees", r: "Requires 3x $20,000"},
                    {t: "Win 3 Races vs Jack", r: "Clears debt and triggers alley hug"}
                ] 
            },
            {
                name: "Tech Support",
                title: "Studio Fix",
                desc: "Toni helps fix the internet at the studio.",
                steps: [
                    {t: "Complete Alley Scene", r: "Toni visits the studio"},
                    {t: "Garage Invite", r: "Unlocks Toni as an employee"}
                ]
            }
        ]
    },
    "sofia": {
        name: "Sofia",
        bio: "The determined investigator...",
        sprite: "images/characters/Sofia/sofia_sprite.png",
        bg: "images/characters/Sofia/Sofia_BG.png",
        quests: [
            { 
                name: "The Sting", 
                steps: [
                    {t: "Sneak her in", r: "Leads to 3-some"},
                    {t: "Use the Wire", r: "Arrests Mario"}
                ] 
            }
        ]
    }
};

// --- 1. CORE UTILITIES (Defined First) ---

function updateMuteIcon() {
    const btn = document.getElementById('mute-btn');
    if (btn) {
        // Now checks the global isMuted state instead of volume level
        btn.innerText = isMuted ? "🔈" : "🔊"; 
    }
}

function updateVolume(val) {
    if (typeof bgMusic !== 'undefined') {
        bgMusic.volume = val;
        localStorage.setItem('sm_volume', val);
        
        // If the user manually slides the volume above 0, un-mute them
        if (val > 0 && isMuted) {
            isMuted = false;
            localStorage.setItem('sm_muted', 'false');
        }
        
        updateMuteIcon();
    }
}

// Initialize mute state from localStorage or default to false
let isMuted = localStorage.getItem('sm_muted') === 'true'; 
let previousVolume = parseFloat(localStorage.getItem('sm_volume')) || 0.5;

function toggleMute() {
    const slider = document.getElementById('volume-slider');
    if (typeof bgMusic === 'undefined') return;

    if (!isMuted) {
        // Muting
        previousVolume = bgMusic.volume > 0 ? bgMusic.volume : 0.5;
        bgMusic.volume = 0; // Update the audio object directly
        if (slider) slider.value = 0;
        isMuted = true;
    } else {
        // Unmuting
        bgMusic.volume = previousVolume; // Update the audio object directly
        if (slider) slider.value = previousVolume;
        isMuted = false;
    }
    
    // Save state
    localStorage.setItem('sm_muted', isMuted);
    updateMuteIcon();
}

// --- 2. GLOBAL SOUND ENGINE ---

if (typeof bgMusic === 'undefined') {
    var bgMusic = new Audio('audio/background_theme.mp3');
    bgMusic.loop = true;
    
    bgMusic.addEventListener('timeupdate', function() {
        var buffer = 0.40;
        if(this.currentTime > this.duration - buffer) {
            this.currentTime = 0;
            this.play();
        }
    });
}

if (typeof squishSnd === 'undefined') {
    var squishSnd = new Audio('audio/squish.mp3');
}

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
    
    // Determine the target volume based on mute state
    let targetVol = isMuted ? 0 : previousVolume; 

    const savedTime = parseFloat(localStorage.getItem('sm_music_time')) || 0;

    if (typeof bgMusic !== 'undefined') {
        if (!bgMusic.src.includes(savedTrack)) bgMusic.src = savedTrack;
        bgMusic.volume = 0; 
        bgMusic.currentTime = savedTime;
        
        bgMusic.play().then(() => {
            // Only fade in if we are NOT muted
            if (!isMuted) {
                let currentFadeVol = 0;
                const fadeInterval = setInterval(() => {
                    if (currentFadeVol < targetVol) {
                        currentFadeVol += 0.05;
                        bgMusic.volume = Math.min(currentFadeVol, targetVol);
                    } else {
                        clearInterval(fadeInterval);
                        updateMuteIcon();
                    }
                }, 50);
            } else {
                updateMuteIcon();
            }
        }).catch(() => {
            document.addEventListener('click', () => {
                bgMusic.play();
                bgMusic.volume = targetVol;
                updateMuteIcon();
            }, { once: true });
        });
    }
    
    const slider = document.getElementById('volume-slider');
    if (slider) slider.value = targetVol;

    const trackNameDisplay = document.getElementById('current-track-name');
    const trackLabel = localStorage.getItem('sm_track_label') || "Default Theme";
    if (trackNameDisplay) trackNameDisplay.innerText = "PLAYING: " + trackLabel;

    document.querySelectorAll('.track-item').forEach(btn => {
        if (btn.innerText.includes(trackLabel)) btn.classList.add('playing');
    });
}

function changeTrack(path, label) {
    if (typeof playSnd === 'function') playSnd();
    localStorage.setItem('sm_preferred_track', path);
    localStorage.setItem('sm_track_label', label);
    
    if (typeof bgMusic !== 'undefined') {
        const currentVol = bgMusic.volume;
        bgMusic.pause();
        bgMusic.src = path;
        bgMusic.currentTime = 0; 
        bgMusic.volume = currentVol;
        bgMusic.play();
    }

    const display = document.getElementById('current-track-name');
    if (display) display.innerText = "PLAYING: " + label;

    document.querySelectorAll('.track-item').forEach(btn => {
        btn.classList.remove('playing');
        if (btn.innerText.includes(label)) btn.classList.add('playing');
    });
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

// --- CRT MODE TOGGLE ---
function toggleCRT() {
    if (typeof playSnd === 'function') playSnd();
    const overlay = document.getElementById('global-crt');
    const badge = document.getElementById('crt-badge');
    const btn = document.querySelector('button[onclick="toggleCRT()"]');
    
    if (overlay) {
        overlay.classList.toggle('active');
        const isActive = overlay.classList.contains('active');
        localStorage.setItem('sm_crt_enabled', isActive);
        
        // Update Indicator Badge
        if (badge) {
            if (isActive) badge.classList.add('active');
            else badge.classList.remove('active');
        }
        
        // Update Button Text & Colors
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

let touchstartX = 0;
let touchendX = 0;

function handleGesture() {
    const swipeThreshold = 50;
    if (touchendX < touchstartX - swipeThreshold) {
        if (typeof changeImage === 'function') changeImage(1); 
    }
    if (touchendX > touchstartX + swipeThreshold) {
        if (typeof changeImage === 'function') changeImage(-1);
    }
}

document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
}, {passive: true});

document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    const isSwipeable = e.target.closest('.lightbox') || 
                        e.target.closest('.sprite-window') || 
                        e.target.closest('.char-image-box') ||
                        e.target.closest('#lightbox-modal');

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
        crtDiv.id = 'global-crt';
        crtDiv.className = 'crt-overlay';
        document.body.appendChild(crtDiv);
    }

    // 3. Inject CRT Indicator Badge into the Header
    const headerTitle = document.querySelector('header div');
    let badge = document.getElementById('crt-badge');
    if (headerTitle && !badge) {
        badge = document.createElement('span');
        badge.id = 'crt-badge';
        badge.className = 'crt-indicator';
        badge.innerText = 'CRT';
        // Insert it right after "STARMAKER DATABASE"
        headerTitle.appendChild(badge); 
    }

    // 4. Inject Glitch Screen Globally
    if (!document.getElementById('glitch-screen')) {
        const glitchDiv = document.createElement('div');
        glitchDiv.id = 'glitch-screen';
        document.body.appendChild(glitchDiv);
    }

    // 5. Apply Saved CRT State on Page Load
    const isCrtEnabled = localStorage.getItem('sm_crt_enabled') === 'true';
    if (isCrtEnabled) {
        document.getElementById('global-crt').classList.add('active');
        if (badge) badge.classList.add('active');
    }
    
    const crtBtn = document.querySelector('button[onclick="toggleCRT()"]');
    if (crtBtn) {
        crtBtn.innerText = isCrtEnabled ? "📺 CRT MODE: ON" : "📺 CRT MODE: OFF";
        crtBtn.style.color = isCrtEnabled ? "#00ff00" : "#ff4466";
        crtBtn.style.borderColor = isCrtEnabled ? "#00ff00" : "#ff4466";
    }

    // 6. Intercept Page Links for Glitch Transition (Only if CRT is ON)
    document.querySelectorAll('a.nav-btn').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetURL = link.getAttribute('href');
            
            if (targetURL && targetURL.includes('.html')) {
                e.preventDefault(); 
                if (typeof playSnd === 'function') playSnd(); 
                
                // Check if CRT is enabled right now
                if (localStorage.getItem('sm_crt_enabled') === 'true') {
                    const glitch = document.getElementById('glitch-screen');
                    if (glitch) glitch.classList.add('active');
                    
                    // Slightly faster transition
                    setTimeout(() => {
                        window.location.href = targetURL;
                    }, 250); 
                } else {
                    // CRT is off, transition instantly
                    window.location.href = targetURL;
                }
            }
        });
    });
});
