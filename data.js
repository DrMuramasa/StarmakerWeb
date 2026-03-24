const characterData = {
    "josef": {
        name: "Josef", bio: "Household head and primary guardian.",
        sprite: "images/characters/Josef/josef_sprite.png", 
        bg: "images/characters/Josef/Josef_BG.jpg",
        quests: [
            { name: "Beer Strategy", title: "Friday Beer", desc: "Unlock Josef's route.", steps: [{t: "Friday interaction", r: "Anna 3 Hearts"}] }
        ]
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
