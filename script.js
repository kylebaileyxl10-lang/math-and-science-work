// --- GDRWeb v1.0.43: JSON-SHEET ADAPTATION ---
console.log("System: v1.0.43 - Loading Sheets as JSON");

window.loadGDRWeb = function(xmlData) {
    cc.game.onStart = function() {
        cc.view.enableRetina(false); 
        cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);

        // Load your sheet as a JSON object first
        cc.loader.loadJson("assets/GJ_GameSheet.plist", function(err, jsonDict) {
            if (err) return console.error("Could not load sheet JSON");

            // Manually inject the frames into the cache to skip the "Not a plist" error
            cc.spriteFrameCache._addSpriteFramesByObject("assets/GJ_GameSheet.plist", jsonDict);
            console.log("Success: Injected JSON frames into Cache");

            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    // Stop the "child already added" error by clearing the scene entirely
                    this.removeAllChildren(true); 
                    
                    this.addChild(new cc.LayerColor(cc.color(20, 80, 180))); 

                    // Test with a name found in your screenshot: "blackCogwheel_01_001.png"
                    let logoSprite;
                    let frame = cc.spriteFrameCache.getSpriteFrame("blackCogwheel_01_001.png");
                    
                    if (frame) {
                        logoSprite = new cc.Sprite(frame);
                        logoSprite.setScale(2.0);
                    } else {
                        logoSprite = new cc.LabelTTF("GDRWeb: Using Text Mode", "Arial", 42);
                    }
                    logoSprite.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
                    this.addChild(logoSprite);

                    // PLAY BUTTON (Using verified squareB_01 as a direct file)
                    const playBtnSprite = new cc.Sprite("assets/GJ_squareB_01.png");
                    const playBtn = new cc.MenuItemSprite(playBtnSprite, playBtnSprite, function() {
                        cc.director.runScene(new GameplayScene());
                    });
                    
                    const menu = new cc.Menu(playBtn);
                    this.addChild(menu);
                    
                    document.getElementById('status').style.display = 'none';
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
                        const levelStr = xmlData.split("<k>k4</k>")[1].split("</s>")[0].trim();
                        const decoded = atob(levelStr.replace(/-/g, '+').replace(/_/g, '/'));
                        const data = pako.inflate(Uint8Array.from(decoded, c => c.charCodeAt(0)), { to: 'string' });
                        
                        data.split(';').slice(0, 500).forEach(obj => {
                            const p = obj.split(',');
                            const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                            if (id && x && y) {
                                const b = new cc.Sprite("assets/GJ_squareB_01.png");
                                b.setPosition(parseFloat(x)/4, (parseFloat(y)/4) + 120);
                                b.setScale(0.3);
                                world.addChild(b);
                            }
                        });
                    } catch(e) { console.log("Rendering..."); }

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
