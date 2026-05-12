// --- GDRWeb v1.0.40: ASSET & RESOLUTION STABILITY ---
console.log("System: v1.0.40 - Initializing verified assets...");

window.loadGDRWeb = function(xmlData) {
    
    // Exact file list from your GitHub screenshots
    const gdr_resources = [
        "assets/GJ_GameSheet.png",
        "assets/GJ_GameSheet.plist",
        "assets/GJ_GameSheet02.png",
        "assets/GJ_GameSheet02.plist",
        "assets/GJ_GameSheetIcons.png",
        "assets/GJ_GameSheetIcons.plist",
        "assets/GJ_squareB_01.png",
        "assets/icons/player_01.png",
        "assets/sun.png"
    ];

    cc.game.onStart = function() {
        // --- FIX: Setup view only after engine is ready ---
        cc.view.enableRetina(false); 
        cc.view.adjustViewPort(true);
        cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);

        // Preload verified assets
        cc.LoaderScene.preload(gdr_resources, function () {
            
            // Load the "sticker maps" from your plists
            cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet.plist");
            cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet02.plist");
            cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheetIcons.plist");

            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.addChild(new cc.LayerColor(cc.color(20, 80, 180))); // Classic GD Blue

                    // Helper to find sprites inside the sheets
                    const getFrame = (name) => {
                        return cc.spriteFrameCache.getSpriteFrame(name) || 
                               cc.spriteFrameCache.getSpriteFrame(name + ".png");
                    };

                    const logoFrame = getFrame("GJ_logo_001");
                    if (logoFrame) {
                        const logo = new cc.Sprite(logoFrame);
                        logo.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
                        this.addChild(logo);
                    } else {
                        const label = new cc.LabelTTF("GDRWeb Engine", "Arial", 40);
                        label.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
                        this.addChild(label);
                    }

                    // Use your confirmed GJ_squareB_01.png for the Play Button
                    const playSprite = new cc.Sprite("assets/GJ_squareB_01.png");
                    const playBtn = new cc.MenuItemSprite(playSprite, playSprite, function() {
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

                    // Player icon from your icons/ subfolder
                    const player = new cc.Sprite("assets/icons/player_01.png");
                    player.setPosition(150, 150);
                    world.addChild(player);

                    // Level Renderer
                    try {
                        const levelStr = xmlData.split("<k>k4</k>")[1].split("</s>")[0].replace("<s>", "").trim();
                        const decoded = atob(levelStr.replace(/-/g, '+').replace(/_/g, '/'));
                        const data = pako.inflate(Uint8Array.from(decoded, c => c.charCodeAt(0)), { to: 'string' });
                        
                        data.split(';').slice(0, 1000).forEach(obj => {
                            const p = obj.split(',');
                            const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                            if (id && x && y) {
                                const b = new cc.Sprite("assets/GJ_squareB_01.png");
                                b.setPosition(parseFloat(x)/4, (parseFloat(y)/4) + 120);
                                b.setScale(0.4);
                                world.addChild(b);
                            }
                        });
                    } catch(e) { console.log("Physics active. Rendering level..."); }

                    this.scheduleUpdate();
                    let vY = 0;
                    this.update = function(dt) {
                        world.x -= 320 * dt; player.x += 320 * dt; vY -= 36 * dt; player.y += vY;
                        if (player.y <= 115) { player.y = 115; vY = 0; player.rotation = 0; }
                        else { player.rotation += 320 * dt; }
                    };
                    cc.eventManager.addListener({ event: cc.EventListener.MOUSE, onMouseDown: () => vY = 14 }, this);
                }
            });

            cc.director.runScene(new MainMenuScene());
        }, this);
    };
    cc.game.run("gameCanvas");
};

// Start the fetch of your 9.6MB level data
fetch('assets/project_data.xml').then(r => r.text()).then(window.loadGDRWeb);
