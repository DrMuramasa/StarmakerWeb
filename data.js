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
        sprite: "images/characters/Amelia/amelia_sprite.png", 
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
        sprite: "images/characters/Emma/emma_sprite.png",
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
        sprite: "images/characters/Evelyn/evelyn_sprite.png",
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
        sprite: "images/characters/Toni/toni_sprite.png",
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
        bio: "The determined investigator looking to bring down Mario.",
        sprite: "images/characters/Sofia/sofia_sprite.png",
        bg: "images/characters/Sofia/Sofia_BG.png",
        quests: [
            { 
                name: "The Sting", 
                title: "Arresting Mario", 
                desc: "Coordinate with Sofia at the Gas Station on Fridays.", 
                steps: [
                    {t: "Sneak her in", r: "Leads to 3-some with Mario"},
                    {t: "Use the Wire", r: "Arrests Mario and unlocks Sofia's home"}
                ] 
            },
            {
                name: "The Betrayal",
                title: "Double Agent",
                desc: "Tell Mario about Sofia's plan.",
                steps: [
                    {t: "Snitch to Mario", r: "Unlocks Guest Room Key"},
                    {t: "Guest Room Access", r: "Unlocks special Sofia scenes"}
                ]
            }
        ]
    }
};

// --- GLOBAL SOUND ENGINE ---
// 'var' allows the variable to be shared across pages without crashing
if (typeof bgMusic === 'undefined') {
    var bgMusic = new Audio('audio/background_theme.mp3');
    bgMusic.loop = true;
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

let isMuted = false;
let previousVolume = 0.5;

// --- UPDATED MUSIC ENGINE ---

function initMusic() {
    const savedVol = localStorage.getItem('sm_volume') || 0.5;
    const savedTime = localStorage.getItem('sm_music_time') || 0; // Get the last timestamp

    if (typeof bgMusic !== 'undefined') {
        bgMusic.volume = savedVol;
        bgMusic.currentTime = savedTime; // Jump to where we left off
        
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                document.addEventListener('click', () => {
                    bgMusic.play();
                }, { once: true });
            });
        }
    }
    
    const slider = document.getElementById('volume-slider');
    if (slider) slider.value = savedVol;
    updateMuteIcon();
}

// THIS IS THE SECRET SAUCE:
// Every 1 second, save the current time so if they click a link, we know where they were.
setInterval(() => {
    if (typeof bgMusic !== 'undefined' && !bgMusic.paused) {
        localStorage.setItem('sm_music_time', bgMusic.currentTime);
    }
}, 1000);

// Also save right when the user closes/leaves the page
window.onbeforeunload = function() {
    if (typeof bgMusic !== 'undefined') {
        localStorage.setItem('sm_music_time', bgMusic.currentTime);
    }
};

function updateVolume(val) {
    if (typeof bgMusic !== 'undefined') {
        bgMusic.volume = val;
        isMuted = (val == 0);
        updateMuteIcon();
        localStorage.setItem('sm_volume', val);
    }
}

function toggleMute() {
    const slider = document.getElementById('volume-slider');
    if (typeof bgMusic === 'undefined') return;

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
    if (btn) btn.innerText = (isMuted || (typeof bgMusic !== 'undefined' && bgMusic.volume == 0)) ? "🔈" : "🔊";
}
