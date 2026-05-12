// --- GDRWeb v1.0.45: RAW TEXT TO JSON PARSER ---
console.log("System: v1.0.45 - Text-based JSON Sync");

window.loadGDRWeb = function(xmlData) {
    cc.game.onStart = function() {
        cc.view.enableRetina(false); 
        cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);

        // Load file as raw text to bypass syntax errors
        cc.loader.loadTxt("assets/GJ_GameSheet.plist", function(err, textData) {
            if (err) return console.error("Failed to fetch sheet text");

            try {
                const sheetJson = JSON.parse(textData);
                // Force inject the object into the Sprite Cache
                cc.spriteFrameCache._addSpriteFramesByObject("assets/GJ_GameSheet.plist", sheetJson);
                console.log("Success: Parsed JSON text into Cache");
            } catch (e) {
                console.error("JSON Parse Error: Make sure file content is valid JSON");
            }

            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.removeAllChildren(true);
                    this.addChild(new cc.LayerColor(cc.color(20, 80, 180))); 

                    // Check for a confirmed name in your file
                    const frame = cc.spriteFrameCache.getSpriteFrame("blackCogwheel_01_001.png");
                    let logoNode;

                    if (frame) {
                        logoNode = new cc.Sprite(frame);
                        logoNode.setScale(1.5);
                    } else {
                        logoNode = new cc.LabelTTF("GDRWeb Engine", "Arial", 40);
                    }
                    logoNode.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
                    this.addChild(logoNode);

                    // PLAY BUTTON
                    const playBtnSprite = new cc.Sprite("assets/GJ_squareB_01.png");
                    const playBtn = new cc.MenuItemSprite(playBtnSprite, playBtnSprite, function() {
                        cc.director.runScene(new GameplayScene());
                    });
                    const menu = new cc.Menu(playBtn);
                    this.addChild(menu);
                    
                    if (document.getElementById('status')) document.getElementById('status').style.display = 'none';
                }
            });

            const GameplayScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    const world = new cc.Layer();
                    this.addChild(new cc.LayerColor(cc.color(10, 40, 90)));
                    this.addChild(world);

                    const player = new cc.Sprite("assets/icons/player_01.png");
                    player.setPosition(150, 150);
                    world.addChild(player);

                    try {
                        const levelPart = xmlData.split("<k>k4</k>")[1].split("</s>")[0].trim();
                        const decoded = atob(levelPart.replace(/-/g, '+').replace(/_/g, '/'));
                        const data = pako.inflate(Uint8Array.from(decoded, c => c.charCodeAt(0)), { to: 'string' });
                        
                        data.split(';').slice(0, 500).forEach(obj => {
                            const p = obj.split(',');
                            const idIndex = p.indexOf('1');
                            if (idIndex !== -1) {
                                const b = new cc.Sprite("assets/GJ_squareB_01.png");
                                b.setPosition(parseFloat(p[p.indexOf('2') + 1])/4, (parseFloat(p[p.indexOf('3') + 1])/4) + 120);
                                b.setScale(0.3);
                                world.addChild(b);
                            }
                        });
                    } catch(e) { console.log("Rendering level..."); }

                    this.scheduleUpdate();
                    let vY = 0;
                    this.update = function(dt) {
                        world.x -= 300 * dt; player.x += 300 * dt; vY -= 35 * dt; player.y += vY;
                        if (player.y <= 115) { player.y = 115; vY = 0; player.rotation = 0; }
                        else { player.rotation += 320 * dt; }
                    };
                    cc.eventManager.addListener({ event: cc.EventListener.MOUSE, onMouseDown: () => vY = 13 }, this);
                }
            });

            cc.director.runScene(new MainMenuScene());
        });
    };
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml').then(r => r.text()).then(window.loadGDRWeb);
