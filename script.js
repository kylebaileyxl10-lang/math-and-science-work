// --- GDRWeb v1.0.52: MULTI-JSON BYPASS ---
console.log("System: v1.0.52 - Executing Forced Scene Reset");

window.loadGDRWeb = function(xmlData) {
    cc.game.onStart = function() {
        if (cc.view) {
            cc.view.enableRetina(false);
            cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
        }

        // Wipe any accidental pre-loads from other project.json files
        cc.spriteFrameCache.removeSpriteFrames();

        cc.loader.loadTxt("assets/GJ_GameSheet.plist", function(err, textData) {
            if (!err && textData) {
                try {
                    cc.spriteFrameCache._addSpriteFramesByObject("assets/GJ_GameSheet.plist", JSON.parse(textData));
                } catch (e) { console.warn("JSON error"); }
            }

            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    
                    // Kill the "Child already added" error by wiping this specific instance
                    this.removeAllChildren(true);
                    
                    this.addChild(new cc.LayerColor(cc.color(20, 80, 180))); 

                    // Check for Black Cogwheel
                    const frame = cc.spriteFrameCache.getSpriteFrame("blackCogwheel_01_001.png");
                    const logoNode = frame ? new cc.Sprite(frame) : new cc.LabelTTF("GDRWeb Engine", "Arial", 36);
                    logoNode.setPosition(400, 350);
                    if (frame) logoNode.setScale(1.5);
                    this.addChild(logoNode);

                    // Play Button using verified blue square
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
                    this.removeAllChildren(true);
                    this.addChild(new cc.LayerColor(cc.color(10, 40, 90)));
                    const player = new cc.Sprite("assets/icons/player_01.png");
                    player.setPosition(150, 150);
                    this.addChild(player);
                }
            });

            cc.director.runScene(new MainMenuScene());
        });
    };

    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml').then(r => r.text()).then(window.loadGDRWeb);
