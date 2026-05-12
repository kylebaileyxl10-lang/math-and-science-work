// --- GDRWeb v1.0.32: FOLDER PATH SYNC ---
console.log("System: v1.0.32 - Syncing with real folder structure");

const ID_MAP = { 
    "1": "assets/GJ_squareB_01.png", // Using your actual square file
    "default": "assets/GJ_squareB_01.png" 
};

window.loadGDRWeb = function(xmlData) {
    const levelMatches = xmlData.split("<k>k4</k>");
    levelMatches.shift(); 
    window.GDR = {
        allLevels: levelMatches.map(s => s.split("</s>")[0].replace("<s>", "").trim()),
        currentLevelIndex: 0,
        // SYNC: Pointing to your 'assets/icons/' folder
        selectedIcon: "assets/icons/player_01.png" 
    };

    cc.game.onStart = function() {
        const MainMenuScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(20, 100, 255))); 

                // Use your 'sun.png' as a placeholder logo for now
                const logo = new cc.Sprite("assets/sun.png");
                logo.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
                this.addChild(logo);

                // Use 'GJ_squareB_01.png' as the Play Button
                const playBtn = new cc.MenuItemImage("assets/GJ_squareB_01.png", "assets/GJ_squareB_01.png", function() {
                    cc.director.runScene(new GameplayScene());
                });
                playBtn.setScale(2.0);

                const menu = new cc.Menu(playBtn);
                this.addChild(menu);
            }
        });

        const GameplayScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(40, 125, 255)));
                const world = new cc.Layer();
                this.addChild(world);

                // Load the player icon from your subfolder
                const player = new cc.Sprite(window.GDR.selectedIcon);
                player.setPosition(150, 150);
                world.addChild(player);

                try {
                    const raw = window.GDR.allLevels[0];
                    const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
                    const data = pako.inflate(Uint8Array.from(bin, c => c.charCodeAt(0)), { to: 'string' });
                    
                    data.split(';').slice(0, 3000).forEach(objStr => {
                        const p = objStr.split(',');
                        const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                        if (id && x && y) {
                            const s = new cc.Sprite("assets/GJ_squareB_01.png");
                            s.setPosition(parseFloat(x)/4, (parseFloat(y)/4) + 100);
                            s.setScale(0.4);
                            world.addChild(s);
                        }
                    });
                } catch(e) { console.log("Render continuing..."); }

                this.scheduleUpdate();
                let vY = 0;
                this.update = function(dt) {
                    world.x -= 300 * dt; player.x += 300 * dt; vY -= 35 * dt; player.y += vY;
                    if (player.y <= 115) { player.y = 115; vY = 0; player.rotation = 0; }
                    else { player.rotation += 300 * dt; }
                };
                cc.eventManager.addListener({ event: cc.EventListener.MOUSE, onMouseDown: function() { vY = 13; }}, this);
            }
        });

        cc.director.runScene(new MainMenuScene());
    };
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml?v=' + Date.now()).then(r => r.text()).then(window.loadGDRWeb);
