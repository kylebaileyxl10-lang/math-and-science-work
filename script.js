// --- GDRWeb v1.0.31: EMERGENCY ASSET BYPASS ---
console.log("System: v1.0.31 - Using existing assets to bypass 404s");

// Mapping IDs to files I saw in your 'assets' search results
const ID_MAP = { 
    "1": "assets/pixel.png", 
    "default": "assets/pixel.png" 
};

window.loadGDRWeb = function(xmlData) {
    const levelMatches = xmlData.split("<k>k4</k>");
    levelMatches.shift(); 
    window.GDR = {
        allLevels: levelMatches.map(s => s.split("</s>")[0].replace("<s>", "").trim()),
        currentLevelIndex: 0,
        selectedIcon: "assets/pixel.png"
    };

    cc.game.onStart = function() {
        const MainMenuScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(125, 0, 255))); 

                // BYPASS: Use sun.png as the logo since GJ_logo is missing
                const logo = new cc.Sprite("assets/sun.png");
                logo.setPosition(cc.winSize.width/2, cc.winSize.height - 120);
                this.addChild(logo);

                const titleLabel = new cc.LabelTTF("GDRWeb Engine", "Arial", 32);
                titleLabel.setPosition(cc.winSize.width/2, cc.winSize.height - 200);
                this.addChild(titleLabel);

                // BYPASS: Use pixel.png for buttons
                const playBtn = new cc.MenuItemImage("assets/pixel.png", "assets/pixel.png", function() {
                    cc.director.runScene(new GameplayScene());
                });
                playBtn.setScale(4.0); // Make the pixel big enough to click

                const menu = new cc.Menu(playBtn);
                this.addChild(menu);
                
                const helpText = new cc.LabelTTF("Click the square to start", "Arial", 18);
                helpText.setPosition(cc.winSize.width/2, 100);
                this.addChild(helpText);
            }
        });

        const GameplayScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                const world = new cc.Layer();
                this.addChild(new cc.LayerColor(cc.color(40, 125, 255)));
                this.addChild(world);

                const player = new cc.Sprite("assets/pixel.png");
                player.setPosition(150, 150);
                player.setColor(cc.color(0, 255, 0));
                world.addChild(player);

                try {
                    const raw = window.GDR.allLevels[0];
                    const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
                    const data = pako.inflate(Uint8Array.from(bin, c => c.charCodeAt(0)), { to: 'string' });
                    
                    data.split(';').slice(0, 2000).forEach(objStr => {
                        const p = objStr.split(',');
                        const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                        if (id && x && y) {
                            const s = new cc.Sprite("assets/pixel.png");
                            s.setPosition(parseFloat(x)/4, (parseFloat(y)/4) + 100);
                            s.setScale(0.5);
                            world.addChild(s);
                        }
                    });
                } catch(e) { console.log("Render error, but continuing..."); }

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
