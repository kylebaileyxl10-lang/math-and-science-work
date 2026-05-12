// --- GDRWeb v1.0.50: FINAL STABILITY SYNC ---
console.log("System: v1.0.50 - Executing safe initialization");

window.loadGDRWeb = function(xmlData) {
    cc.game.onStart = function() {
        // --- SAFE VIEWPORT SETUP ---
        if (cc.view) {
            cc.view.enableRetina(false);
            cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
        }

        cc.loader.loadTxt("assets/GJ_GameSheet.plist", function(err, textData) {
            if (!err && textData) {
                try {
                    cc.spriteFrameCache._addSpriteFramesByObject("assets/GJ_GameSheet.plist", JSON.parse(textData));
                } catch (e) { console.warn("Sheet skip"); }
            }

            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    if (this.getChildrenCount() > 0) return;

                    this.addChild(new cc.LayerColor(cc.color(20, 80, 180))); 

                    // Logo verification
                    const frame = cc.spriteFrameCache.getSpriteFrame("blackCogwheel_01_001.png");
                    const logoNode = frame ? new cc.Sprite(frame) : new cc.LabelTTF("GDRWeb Engine", "Arial", 36);
                    logoNode.setPosition(400, 350);
                    if (frame) logoNode.setScale(1.5);
                    this.addChild(logoNode);

                    // Play Button using confirmed asset
                    const playBtnSprite = new cc.Sprite("assets/GJ_squareB_01.png");
                    const playBtn = new cc.MenuItemSprite(playBtnSprite, playBtnSprite, function() {
                        cc.director.runScene(new GameplayScene());
                    });
                    const menu = new cc.Menu(playBtn);
                    menu.setPosition(400, 200);
                    this.addChild(menu);
                    
                    if (document.getElementById('status')) document.getElementById('status').style.display = 'none';
                }
            });

            const GameplayScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.addChild(new cc.LayerColor(cc.color(10, 40, 90)));
                    const player = new cc.Sprite("assets/icons/player_01.png");
                    player.setPosition(150, 150);
                    this.addChild(player);

                    this.scheduleUpdate();
                    let vY = 0;
                    this.update = function(dt) {
                        vY -= 35 * dt; player.y += vY;
                        if (player.y <= 115) { player.y = 115; vY = 0; }
                    };
                    cc.eventManager.addListener({ event: cc.EventListener.MOUSE, onMouseDown: () => vY = 13 }, this);
                }
            });

            cc.director.runScene(new MainMenuScene());
        });
    };

    // Use the engine bootstrap directly to avoid double-run threads
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml').then(r => r.text()).then(window.loadGDRWeb);
