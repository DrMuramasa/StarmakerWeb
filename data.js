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

// --- GLOBAL SOUND ENGINE ---
// We use 'var' or check if it exists to prevent that "already declared" error
if (typeof bgMusic === 'undefined') {
    var bgMusic = new Audio('audio/background_theme.mp3');
    bgMusic.loop = true;
}

if (typeof squishSnd === 'undefined') {
    var squishSnd = new Audio('audio/squish.mp3');
}

function playSnd() {
    squishSnd.currentTime = 0;
    squishSnd.volume = bgMusic.volume;
    squishSnd.play().catch(() => {});
}

let isMuted = false;
let previousVolume = 0.5;

function initMusic() {
    const savedVol = localStorage.getItem('sm_volume') || 0.5;
    bgMusic.volume = savedVol;
    
    const slider = document.getElementById('volume-slider');
    if (slider) slider.value = savedVol;

    document.addEventListener('click', () => {
        bgMusic.play().catch(() => {});
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
        if (slider) slider.value = 0;
        isMuted = true;
    } else {
        bgMusic.volume = previousVolume;
        if (slider) slider.value = previousVolume;
        isMuted = false;
    }
    updateMuteIcon();
    localStorage.setItem('sm_volume', bgMusic.volume);
}

function updateMuteIcon() {
    const btn = document.getElementById('mute-btn');
    if (btn) btn.innerText = (isMuted || bgMusic.volume === 0) ? "🔈" : "🔊";
}
