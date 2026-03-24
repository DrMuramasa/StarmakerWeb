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

