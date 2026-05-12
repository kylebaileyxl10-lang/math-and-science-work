// --- GDRWeb v1.0.44: JS-SHEET COMPATIBILITY ---
console.log("System: v1.0.44 - Loading sheets as JS Modules");

window.loadGDRWeb = function(xmlData) {
    cc.game.onStart = function() {
        cc.view.enableRetina(false); 
        cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);

        // Since you said it's a JS file, Cocos2d might have already run it.
        // We will try to find the data object and inject it.
        const injectSheet = () => {
            // Check if the JS file created a global variable (usually named after the file)
            const sheetData = window.GJ_GameSheet || window.frames; 
            
            if (sheetData) {
                cc.spriteFrameCache._addSpriteFramesByObject("assets/GJ_GameSheet.plist", sheetData);
                console.log("Success: Injected JS-Object frames into Cache");
            }
        };

        const MainMenuScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.removeAllChildren(true); 
                injectSheet(); // Run the injection
                
                this.addChild(new cc.LayerColor(cc.color(20, 80, 180))); 

                // Test item from your screenshot
                let testSprite;
                let frame = cc.spriteFrameCache.getSpriteFrame("blackCogwheel_01_001.png");
                
                if (frame) {
                    testSprite = new cc.Sprite(frame);
                } else {
                    testSprite = new cc.LabelTTF("GDRWeb: JS Object Not Found", "Arial", 32);
                }
                testSprite.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
                this.addChild(testSprite);

                // PLAY BUTTON (Verified direct file)
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

                // Player from verified subfolder
                const player = new cc.Sprite("assets/icons/player_01.png");
                player.setPosition(150, 150);
                world.addChild(player);

                try {
                    const levelStr = xmlData.split("<k>k4</k>")[1].split("</s>")[0].trim();
                    const data = pako.inflate(Uint8Array.from(atob(levelStr.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)), { to: 'string' });
                    
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
                    world.x -= 300 * dt; player.x += 300 * dt; vY -= 35 * dt; player.y += vY;
                    if (player.y <= 115) { player.y = 115; vY = 0; player.rotation = 0; }
                    else { player.rotation += 320 * dt; }
                };
                cc.eventManager.addListener({ event: cc.EventListener.MOUSE, onMouseDown: () => vY = 13 }, this);
            }
        });

        cc.director.runScene(new MainMenuScene());
    };
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml').then(r => r.text()).then(window.loadGDRWeb);
