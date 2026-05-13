// --- GDRWeb v1.0.62: JSON MAP LOGGER & SAFETY SYNC ---
window.GDRWEB_VERSION = "1.0.62";

cc.game.onStart = function() {
    cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    // 1. Fetch JSON Plist
    cc.loader.loadTxt("assets/GJ_GameSheet.plist", function(err, textData) {
        if (!err && textData) {
            try {
                const sheetData = JSON.parse(textData);
                
                // LOGGING: Check frames to find the real Logo Name
                const frameNames = Object.keys(sheetData.frames || {});
                console.log("System: Found " + frameNames.length + " frames in JSON.");
                console.log("First 5 Frame Names:", frameNames.slice(0, 5));

                cc.spriteFrameCache._addSpriteFramesByObject("assets/GJ_GameSheet.plist", sheetData);
            } catch (e) { console.error("JSON Error:", e); }
        }

        // 2. Load Texture & Icons
        cc.loader.load(["assets/GJ_GameSheet.png", "assets/GJ_squareB_01.png"], function() {
            
            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.removeAllChildren(true);
                    
                    // Background: Authentic GD Pink
                    this.addChild(new cc.LayerColor(cc.color(190, 0, 190))); 

                    // --- LOGO BLOCK ---
                    // Tries common names. If it fails, uses text to prevent crash
                    const logoFrame = cc.spriteFrameCache.getSpriteFrame("GJ_logo_001.png") || 
                                    cc.spriteFrameCache.getSpriteFrame("logo.png");
                    
                    let logoNode;
                    if (logoFrame) {
                        logoNode = new cc.Sprite(logoFrame);
                        logoNode.setScale(1.2);
                    } else {
                        logoNode = new cc.LabelTTF("GEOMETRY DASH", "Arial", 50);
                    }
                    
                    logoNode.setPosition(400, 350);
                    this.addChild(logoNode);

                    // --- MAIN PLAY BUTTON ---
                    const playFrame = cc.spriteFrameCache.getSpriteFrame("GJ_playBtn_001.png") ||
                                     cc.spriteFrameCache.getSpriteFrame("playBtn.png");
                    
                    const btnSprite = playFrame ? new cc.Sprite(playFrame) : new cc.Sprite("assets/GJ_squareB_01.png");
                    
                    const playBtn = new cc.MenuItemSprite(btnSprite, btnSprite, function() {
                        cc.director.runScene(new GameplayScene());
                    }, this);
                    playBtn.setScale(1.4);

                    const menu = new cc.Menu(playBtn);
                    menu.setPosition(400, 180);
                    this.addChild(menu);
                }
            });

            const GameplayScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.addChild(new cc.LayerColor(cc.color(10, 20, 40)));
                    const label = new cc.LabelTTF("LEVEL LOADING...", "Arial", 32);
                    label.setPosition(400, 225);
                    this.addChild(label);
                }
            });

            cc.director.runScene(new MainMenuScene());
        });
    });
};

// Start Execution Guard
if (!window.GDR_STARTED) {
    window.GDR_STARTED = true;
    cc.game.run("gameCanvas");
}
