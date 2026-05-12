// --- GDRWeb v1.0.36: SHEET-FIRST LOGIC ---
console.log("System: v1.0.36 - Checking Sprite Cache");

window.loadGDRWeb = function(xmlData) {
    const status = document.getElementById('status-text');
    
    // We only list the files that actually exist in your screenshots
    const gdr_resources = [
        "assets/GJ_GameSheet.png",
        "assets/GJ_GameSheet.plist",
        "assets/GJ_GameSheet02.png",
        "assets/GJ_GameSheet02.plist",
        "assets/GJ_GameSheetIcons.png",
        "assets/GJ_GameSheetIcons.plist",
        "assets/icons/player_01.png",
        "assets/GJ_squareB_01.png",
        "assets/sun.png"
    ];

    cc.game.onStart = function() {
        cc.LoaderScene.preload(gdr_resources, function () {
            // Force-load the sheets into the "sticker map" memory
            cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet.plist");
            cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet02.plist");
            cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheetIcons.plist");

            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.addChild(new cc.LayerColor(cc.color(15, 60, 150))); // GD Blue

                    // This helper looks for the "sticker" in memory instead of a file on disk
                    const getFrame = (name) => {
                        let frame = cc.spriteFrameCache.getSpriteFrame(name) || 
                                    cc.spriteFrameCache.getSpriteFrame(name + ".png");
                        if (frame) return new cc.Sprite("#" + (name.includes(".png") ? name : name + ".png"));
                        return null;
                    };

                    // Load Logo from the sheet map
                    const logo = getFrame("GJ_logo_001");
                    if (logo) {
                        logo.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
                        this.addChild(logo);
                    } else {
                        // If the sheet name is wrong, show text so the game doesn't crash
                        const label = new cc.LabelTTF("GDRWeb: Logo Not in Sheet", "Arial", 24);
                        label.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
                        this.addChild(label);
                    }

                    // Use your squareB_01.png (which exists!) for the play button
                    const playSprite = new cc.Sprite("assets/GJ_squareB_01.png");
                    const playBtn = new cc.MenuItemSprite(playSprite, playSprite, function() {
                        cc.director.runScene(new GameplayScene());
                    });
                    
                    const menu = new cc.Menu(playBtn);
                    this.addChild(menu);

                    if (document.getElementById('loader-ui')) document.getElementById('loader-ui').style.display = 'none';
                }
            });

            const GameplayScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    const world = new cc.Layer();
                    this.addChild(new cc.LayerColor(cc.color(5, 40, 100)));
                    this.addChild(world);

                    // Using the player icon from your subfolder
                    const player = new cc.Sprite("assets/icons/player_01.png");
                    player.setPosition(150, 150);
                    world.addChild(player);

                    // RENDERER
                    try {
                        const levelPart = xmlData.split("<k>k4</k>")[1].split("</s>")[0].replace("<s>", "").trim();
                        const decoded = atob(levelPart.replace(/-/g, '+').replace(/_/g, '/'));
                        const data = pako.inflate(Uint8Array.from(decoded, c => c.charCodeAt(0)), { to: 'string' });
                        
                        data.split(';').slice(0, 1500).forEach(objStr => {
                            const p = objStr.split(',');
                            const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                            if (id && x && y) {
                                const block = new cc.Sprite("assets/GJ_squareB_01.png");
                                block.setPosition(parseFloat(x)/4, (parseFloat(y)/4) + 100);
                                block.setScale(0.4);
                                world.addChild(block);
                            }
                        });
                    } catch(e) { console.error("Level Parse Error:", e); }

                    this.scheduleUpdate();
                    let vY = 0;
                    this.update = function(dt) {
                        world.x -= 300 * dt; player.x += 300 * dt; vY -= 35 * dt; player.y += vY;
                        if (player.y <= 110) { player.y = 110; vY = 0; player.rotation = 0; }
                        else { player.rotation += 280 * dt; }
                    };
                    cc.eventManager.addListener({ event: cc.EventListener.MOUSE, onMouseDown: () => vY = 12 }, this);
                }
            });

            cc.director.runScene(new MainMenuScene());
        }, this);
    };
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml').then(r => r.text()).then(window.loadGDRWeb);
