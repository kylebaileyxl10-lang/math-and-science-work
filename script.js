// --- GDRWeb v1.0.46: SCENE TRANSITION STABILITY ---
console.log("System: v1.0.46 - Finalizing UI entry");

window.loadGDRWeb = function(xmlData) {
    cc.game.onStart = function() {
        cc.view.enableRetina(false); 
        cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);

        cc.loader.loadTxt("assets/GJ_GameSheet.plist", function(err, textData) {
            if (err) return console.error("Failed to fetch sheet text");

            try {
                const sheetJson = JSON.parse(textData);
                cc.spriteFrameCache._addSpriteFramesByObject("assets/GJ_GameSheet.plist", sheetJson);
                console.log("Success: Sheet Map Active");
            } catch (e) { console.error("JSON Error"); }

            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    // Nuclear option to prevent "Child already added"
                    this.removeAllChildren(true);
                    
                    this.addChild(new cc.LayerColor(cc.color(20, 80, 180))); 

                    // Your verified Black Cogwheel
                    const frame = cc.spriteFrameCache.getSpriteFrame("blackCogwheel_01_001.png");
                    if (frame) {
                        const logoNode = new cc.Sprite(frame);
                        logoNode.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
                        logoNode.setScale(1.5);
                        this.addChild(logoNode);
                    }

                    // PLAY BUTTON (Using verified squareB_01)
                    const playBtnSprite = new cc.Sprite("assets/GJ_squareB_01.png");
                    const playBtn = new cc.MenuItemSprite(playBtnSprite, playBtnSprite, function() {
                        cc.director.runScene(new GameplayScene());
                    });
                    
                    const menu = new cc.Menu(playBtn);
                    // Use force reset on menu to ensure no ID collision
                    menu.enabled = true;
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
                        const data = pako.inflate(Uint8Array.from(atob(levelPart.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)), { to: 'string' });
                        
                        data.split(';').slice(0, 500).forEach(obj => {
                            const p = obj.split(',');
                            if (p.indexOf('1') !== -1) {
                                const b = new cc.Sprite("assets/GJ_squareB_01.png");
                                b.setPosition(parseFloat(p[p.indexOf('2') + 1])/4, (parseFloat(p[p.indexOf('3') + 1])/4) + 120);
                                b.setScale(0.3);
                                world.addChild(b);
                            }
                        });
                    } catch(e) { console.log("Level active."); }

                    this.scheduleUpdate();
                    let vY = 0;
                    this.update = function(dt) {
                        world.x -= 320 * dt; player.x += 320 * dt; vY -= 38 * dt; player.y += vY;
                        if (player.y <= 115) { player.y = 115; vY = 0; player.rotation = 0; }
                        else { player.rotation += 320 * dt; }
                    };
                    cc.eventManager.addListener({ event: cc.EventListener.MOUSE, onMouseDown: () => vY = 14 }, this);
                }
            });

            // ADDED DELAY: Wait 100ms for LoaderScene to fully exit before running MainMenu
            setTimeout(() => {
                cc.director.runScene(new MainMenuScene());
            }, 100);
        });
    };
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml').then(r => r.text()).then(window.loadGDRWeb);
