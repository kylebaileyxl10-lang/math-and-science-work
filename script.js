// --- GDRWeb v1.0.33: SPRITESHEET ENGINE ---
console.log("System: v1.0.33 - Slicing GameSheets...");

window.loadGDRWeb = function(xmlData) {
    cc.game.onStart = function() {
        
        // 1. LOAD THE SPRITESHEETS (The "Real" Way)
        cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet.plist");
        cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet02.plist");
        cc.spriteFrameCache.addSpriteFrames("assets/icons/bird_01.plist");

        const MainMenuScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(40, 125, 255)));

                // 2. USE REAL SPRITE NAMES (From the .plist)
                // These names come directly from the internal GD files
                const logo = new cc.Sprite("#GJ_logo_001.png"); 
                logo.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
                this.addChild(logo);

                const playBtn = new cc.MenuItemImage(
                    "#GJ_playBtn_001.png", 
                    "#GJ_playBtn_001.png",
                    function() { cc.director.runScene(new GameplayScene()); }
                );

                const menu = new cc.Menu(playBtn);
                this.addChild(menu);
            }
        });

        const GameplayScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(0, 102, 255)));
                const world = new cc.Layer();
                this.addChild(world);

                // Use a real square from the sheet
                const player = new cc.Sprite("#GJ_square01.png");
                player.setPosition(150, 150);
                world.addChild(player);

                // PARSE LEVEL DATA
                const levelRaw = xmlData.split("<k>k4</k>")[1].split("</s>")[0].replace("<s>", "").trim();
                const data = pako.inflate(Uint8Array.from(atob(levelRaw.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)), { to: 'string' });
                
                data.split(';').slice(0, 3000).forEach(objStr => {
                    const p = objStr.split(',');
                    const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                    if (id && x && y) {
                        const s = new cc.Sprite("#GJ_square01.png");
                        s.setPosition(parseFloat(x)/4, (parseFloat(y)/4) + 100);
                        s.setScale(0.4);
                        world.addChild(s);
                    }
                });

                this.scheduleUpdate();
                let vY = 0;
                this.update = function(dt) {
                    world.x -= 340 * dt; player.x += 340 * dt; vY -= 38 * dt; player.y += vY;
                    if (player.y <= 115) { player.y = 115; vY = 0; player.rotation = 0; }
                    else { player.rotation += 320 * dt; }
                };
                cc.eventManager.addListener({ event: cc.EventListener.MOUSE, onMouseDown: function() { vY = 14; }}, this);
            }
        });

        cc.director.runScene(new MainMenuScene());
    };
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml').then(r => r.text()).then(window.loadGDRWeb);
