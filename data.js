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
        name: "Amelia", bio: "Cafe owner and fitness enthusiast.",
        sprite: "images/characters/Amelia/amelia_sprite.png", 
        bg: "images/characters/Amelia/Amelia_BG.png",
        quests: [{ name: "Shift Work", title: "Cafe Grind", desc: "Work at the cafe.", steps: [{t: "Work 3 shifts", r: "Requires 1000 Subs"}] }]
    },
    "amelia": {
        name: "Amelia", bio: "Cafe owner and fitness enthusiast.",
        sprite: "images/characters/Amelia/amelia_sprite.png", 
        bg: "images/characters/Amelia/Amelia_BG.png",
        quests: [
            { name: "Coffee Shop", title: "Shift Work", desc: "Visit Amelia during work.", steps: [{t: "Work 3 shifts", r: "Requires 1000 Subs"}] }
        ]
    }
};

// Shared Sound Function
function playSnd() {
    const snd = document.getElementById('squishSnd');
    if(snd) { snd.currentTime = 0; snd.play(); }
}

// Global Audio Setup
const bgMusic = new Audio('audio/background_theme.mp3'); // Ensure path is correct
bgMusic.loop = true;

function initMusic() {
    const savedVol = localStorage.getItem('sm_volume') || 0.5;
    bgMusic.volume = savedVol;
    
    // Check if slider exists on page and set it
    const slider = document.getElementById('volume-slider');
    if(slider) slider.value = savedVol;

    // Try to play (Browsers often block auto-play until first click)
    document.addEventListener('click', () => {
        bgMusic.play().catch(() => {}); 
    }, { once: true });
}

function updateVolume(val) {
    bgMusic.volume = val;
    localStorage.setItem('sm_volume', val);
}

// --- Sound Effects ---
const squishSnd = new Audio('audio/squish.mp3'); // Ensure this path matches your file

function playSnd() {
    // Reset the sound to the start so it can be spammed/clicked quickly
    squishSnd.currentTime = 0; 
    // Use the same volume as the background music for consistency
    squishSnd.volume = bgMusic.volume; 
    squishSnd.play().catch(() => { /* Prevent errors if clicked before interaction */ });
}

// --- Music Engine ---
let isMuted = false;
let previousVolume = 0.5;
// IMPORTANT: Update this path to your actual music file
const bgMusic = new Audio('audio/background_theme.mp3'); 
bgMusic.loop = true;

function initMusic() {
    // Load volume from browser memory
    const savedVol = localStorage.getItem('sm_volume') || 0.5;
    bgMusic.volume = savedVol;
    
    const slider = document.getElementById('volume-slider');
    if(slider) slider.value = savedVol;
    
    updateMuteIcon();

    // Browser safety: Start music on the first click anywhere
    document.addEventListener('click', () => {
        bgMusic.play().catch(() => { /* Handle auto-play block */ });
    }, { once: true });
}

function updateVolume(val) {
    bgMusic.volume = val;
    isMuted = (val == 0);
    updateMuteIcon();
    localStorage.setItem('sm_volume', val);
}

function toggleMute() {
    const slider = document.getElementById('volume-slider');
    if (!isMuted) {
        previousVolume = bgMusic.volume > 0 ? bgMusic.volume : 0.5;
        bgMusic.volume = 0;
        if(slider) slider.value = 0;
        isMuted = true;
    } else {
        bgMusic.volume = previousVolume;
        if(slider) slider.value = previousVolume;
        isMuted = false;
    }
    updateMuteIcon();
    localStorage.setItem('sm_volume', bgMusic.volume);
}

function updateMuteIcon() {
    const btn = document.getElementById('mute-btn');
    if (btn) {
        btn.innerText = (isMuted || bgMusic.volume === 0) ? "🔈" : "🔊";
    }
}

// Auto-run when any page finishes loading
window.addEventListener('DOMContentLoaded', initMusic);
