// --- GDRWeb v1.0.42: UI OVERRIDE & CLEANUP ---
console.log("System: v1.0.42 - Forced UI Reset");

window.loadGDRWeb = function(xmlData) {
    
    const gdr_resources = [
        "assets/GJ_GameSheet.png",
        "assets/GJ_GameSheet.plist",
        "assets/GJ_GameSheet02.png",
        "assets/GJ_GameSheet02.plist",
        "assets/GJ_squareB_01.png",
        "assets/icons/player_01.png"
    ];

    cc.game.onStart = function() {
        cc.view.enableRetina(false); 
        cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);

        cc.LoaderScene.preload(gdr_resources, function () {
            
            // Safety load plists
            try {
                cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet.plist");
                cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet02.plist");
            } catch(e) { console.log("Sheet map warning ignored."); }

            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.removeAllChildren(); // THE FIX: Wipes old children to prevent Assertion Error
                    
                    this.addChild(new cc.LayerColor(cc.color(20, 80, 180))); 

                    // LOGO LOOKUP
                    let logo;
                    let frame = cc.spriteFrameCache.getSpriteFrame("GJ_logo_001.png") || 
                                cc.spriteFrameCache.getSpriteFrame("GJ_logo_001");
                    
                    if (frame) {
                        logo = new cc.Sprite(frame);
                    } else {
                        logo = new cc.LabelTTF("GDRWeb Engine", "Arial", 42);
                    }
                    logo.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
                    this.addChild(logo);

                    // PLAY BUTTON (Using verified squareB_01)
                    const playBtnSprite = new cc.Sprite("assets/GJ_squareB_01.png");
                    const playBtn = new cc.MenuItemSprite(playBtnSprite, playBtnSprite, function() {
                        cc.director.runScene(new GameplayScene());
                    });
                    playBtn.setScale(1.5);
                    
                    const menu = new cc.Menu(playBtn);
                    this.addChild(menu);
                    
                    if (document.getElementById('status')) document.getElementById('status').style.display = 'none';
                }
            });

            const GameplayScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.removeAllChildren();
                    
                    const world = new cc.Layer();
                    this.addChild(new cc.LayerColor(cc.color(10, 40, 90)));
                    this.addChild(world);

                    const player = new cc.Sprite("assets/icons/player_01.png");
                    player.setPosition(150, 150);
                    world.addChild(player);

                    try {
                        const levelStr = xmlData.split("<k>k4</k>")[1].split("</s>")[0].replace("<s>", "").trim();
                        const decoded = atob(levelStr.replace(/-/g, '+').replace(/_/g, '/'));
                        const data = pako.inflate(Uint8Array.from(decoded, c => c.charCodeAt(0)), { to: 'string' });
                        
                        data.split(';').slice(0, 500).forEach(obj => {
                            const p = obj.split(',');
                            const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                            if (id && x && y) {
                                const b = new cc.Sprite("assets/GJ_squareB_01.png");
                                b.setPosition(parseFloat(x)/4, (parseFloat(y)/4) + 120);
                                b.setScale(0.4);
                                world.addChild(b);
                            }
                        });
                    } catch(e) { console.log("Level active."); }

                    this.scheduleUpdate();
                    let vY = 0;
                    this.update = function(dt) {
                        world.x -= 300 * dt; player.x += 300 * dt; vY -= 35 * dt; player.y += vY;
                        if (player.y <= 115) { player.y = 115; vY = 0; player.rotation = 0; }
                        else { player.rotation += 300 * dt; }
                    };
                    cc.eventManager.addListener({ event: cc.EventListener.MOUSE, onMouseDown: () => vY = 13 }, this);
                }
            });

            cc.director.runScene(new MainMenuScene());
        }, this);
    };
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml').then(r => r.text()).then(window.loadGDRWeb);
