// --- GDRWeb v1.0.54: CLEAN ROOT DEPLOYMENT ---
console.log("System: v1.0.54 - Single File Initialization");

window.loadGDRWeb = function(xmlData) {
    cc.game.onStart = function() {
        if (cc.view) {
            cc.view.enableRetina(false);
            cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
        }

        // Wipe any residual cache from the ghost files
        cc.spriteFrameCache.removeSpriteFrames();

        // Load your assets text-style to avoid syntax errors
        cc.loader.loadTxt("assets/GJ_GameSheet.plist", function(err, textData) {
            if (!err && textData) {
                try {
                    cc.spriteFrameCache._addSpriteFramesByObject("assets/GJ_GameSheet.plist", JSON.parse(textData));
                } catch (e) { console.warn("Sheet mapping skipped."); }
            }

            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    
                    // Prevent duplicate rendering
                    this.removeAllChildren(true);
                    
                    this.addChild(new cc.LayerColor(cc.color(20, 80, 180))); 

                    // Check for Black Cogwheel
                    const frame = cc.spriteFrameCache.getSpriteFrame("blackCogwheel_01_001.png");
                    const logo = frame ? new cc.Sprite(frame) : new cc.LabelTTF("GDRWeb Engine", "Arial", 36);
                    logo.setPosition(400, 350);
                    if (frame) logo.setScale(1.5);
                    this.addChild(logo);

                    // Play Button 
                    const playBtnSprite = new cc.Sprite("assets/GJ_squareB_01.png");
                    const playBtn = new cc.MenuItemSprite(playBtnSprite, playBtnSprite, function() {
                        cc.director.runScene(new GameplayScene());
                    });
                    const menu = new cc.Menu(playBtn);
                    menu.setPosition(400, 200);
                    this.addChild(menu);
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
    
    // The "Force Start" command: Tells the engine to ignore project.json and run immediately
    cc.game.run("gameCanvas");
};

// Start the engine sequence
fetch('assets/project_data.xml').then(r => r.text()).then(window.loadGDRWeb);
