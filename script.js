// --- GDRWeb v1.0.38: NO-HD OVERRIDE ---
console.log("System: v1.0.38 - Standard Assets Only");

window.loadGDRWeb = function(xmlData) {
    
    // THE FIX: Stop the engine from looking for -hd or -uhd files
    cc.view.enableRetina(false); 
    
    const gdr_resources = [
        "assets/GJ_GameSheet.png",
        "assets/GJ_GameSheet.plist",
        "assets/GJ_GameSheet02.png",
        "assets/GJ_GameSheet02.plist",
        "assets/GJ_GameSheetIcons.png",
        "assets/GJ_GameSheetIcons.plist",
        "assets/GJ_squareB_01.png",
        "assets/icons/player_01.png"
    ];

    cc.game.onStart = function() {
        // Preload only the files we have
        cc.LoaderScene.preload(gdr_resources, function () {
            
            // Load frames into the map
            cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet.plist");
            cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet02.plist");
            cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheetIcons.plist");

            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.addChild(new cc.LayerColor(cc.color(20, 70, 160))); 

                    // Check for Logo inside the sheets
                    let logoFrame = cc.spriteFrameCache.getSpriteFrame("GJ_logo_001.png") || 
                                    cc.spriteFrameCache.getSpriteFrame("GJ_logo_001");
                    
                    if (logoFrame) {
                        const logo = new cc.Sprite("#" + logoFrame.getTextureName()); // Fixed sprite lookup
                        logo.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
                        this.addChild(logo);
                    } else {
                        const label = new cc.LabelTTF("GDRWeb", "Arial", 40);
                        label.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
                        this.addChild(label);
                    }

                    // Use the confirmed GJ_squareB_01.png for Play Button
                    const playSprite = new cc.Sprite("assets/GJ_squareB_01.png");
                    const playBtn = new cc.MenuItemSprite(playSprite, playSprite, function() {
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
                    this.addChild(new cc.LayerColor(cc.color(5, 30, 80)));
                    this.addChild(world);

                    const player = new cc.Sprite("assets/icons/player_01.png");
                    player.setPosition(150, 150);
                    world.addChild(player);

                    // Level decoding
                    try {
                        const levelStr = xmlData.split("<k>k4</k>")[1].split("</s>")[0].replace("<s>", "").trim();
                        const decoded = atob(levelStr.replace(/-/g, '+').replace(/_/g, '/'));
                        const data = pako.inflate(Uint8Array.from(decoded, c => c.charCodeAt(0)), { to: 'string' });
                        
                        data.split(';').slice(0, 500).forEach(obj => {
                            const p = obj.split(',');
                            const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                            if (id && x && y) {
                                const b = new cc.Sprite("assets/GJ_squareB_01.png");
                                b.setPosition(parseFloat(x)/4, (parseFloat(y)/4) + 100);
                                b.setScale(0.35);
                                world.addChild(b);
                            }
                        });
                    } catch(e) { console.log("Rendering..."); }

                    this.scheduleUpdate();
                    let vY = 0;
                    this.update = function(dt) {
                        world.x -= 300 * dt; player.x += 300 * dt; vY -= 35 * dt; player.y += vY;
                        if (player.y <= 110) { player.y = 110; vY = 0; player.rotation = 0; }
                        else { player.rotation += 300 * dt; }
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
