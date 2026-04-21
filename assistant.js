const Asterion = {
    state: 'idle',
    knowledge: {},

    init: async function() {
        // Create elements
        const container = document.createElement('div');
        container.id = 'asterion-container';
        container.innerHTML = `
            <div id="asterion-bubble">
                <div id="asterion-text">...</div>
                <input type="text" id="asterion-input" placeholder="Ask me something...">
            </div>
            <div id="asterion-sprite" class="idle"></div>
        `;
        document.body.appendChild(container);

        this.sprite = document.getElementById('asterion-sprite');
        this.bubble = document.getElementById('asterion-bubble');
        this.input = document.getElementById('asterion-input');
        this.text = document.getElementById('asterion-text');

        // Load Knowledge
        try {
            const res = await fetch('knowledge.json');
            this.knowledge = await res.json();
        } catch(e) { console.error("Knowledge base not found."); }

        this.setupEvents();
        this.startWandering();
    },

    setState: function(newState) {
        this.sprite.className = newState;
        this.state = newState;
    },

    setupEvents: function() {
        this.sprite.onclick = () => {
            if (this.state !== 'read') {
                this.jumpToRead();
            } else {
                this.bubble.style.display = this.bubble.style.display === 'block' ? 'none' : 'block';
            }
        };

        this.input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                this.handleQuery(this.input.value);
                this.input.value = '';
            }
        };
    },

    jumpToRead: function() {
        this.setState('jump');
        this.text.innerText = "Let me check the archives...";
        this.bubble.style.display = 'block';
        
        // Wait for jump animation to finish then switch to reading
        setTimeout(() => {
            this.setState('read');
        }, 1000); 
    },

    handleQuery: function(val) {
        const query = val.toLowerCase();
        let response = "I don't have records on that yet.";

        // Basic search logic
        for (let category in this.knowledge) {
            for (let key in this.knowledge[category]) {
                if (query.includes(key)) {
                    response = this.knowledge[category][key];
                }
            }
        }
        this.text.innerText = response;
    },

    startWandering: function() {
        // Occasionally walk to a new spot if not reading
        setInterval(() => {
            if (this.state === 'idle') {
                this.setState('walk');
                const newRight = Math.floor(Math.random() * 200) + 20;
                document.getElementById('asterion-container').style.right = newRight + 'px';
                
                setTimeout(() => {
                    if (this.state === 'walk') this.setState('idle');
                }, 2000);
            }
        }, 15000);
    }
};

Asterion.init();
