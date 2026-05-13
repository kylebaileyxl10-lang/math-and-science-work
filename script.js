// --- GDRWeb v1.0.64: VERIFIED LOGO SYNC ---
window.GDRWEB_VERSION = "1.0.64";

cc.game.onStart = function() {
    cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    // 1. Load the JSON Plist first
    cc.loader.loadTxt("assets/GJ_GameSheet.plist", function(err, textData) {
        if (!err && textData) {
            try {
                const sheetData = JSON.parse(textData);
                // Injects the frames we saw in your photo
                cc.spriteFrameCache._addSpriteFramesByObject("assets/GJ_GameSheet.plist", sheetData);
                console.log("System: Sprite frames injected successfully.");
            } catch (e) {
                console.error("System: Failed to parse GJ_GameSheet.plist as JSON.");
            }
        }

        // 2. Load the actual image file
        cc.loader.load(["assets/GJ_GameSheet.png", "assets/GJ_squareB_01.png"], function() {
            
            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.removeAllChildren(true);
                    
                    // The classic pink background
                    this.addChild(new cc.LayerColor(cc.color(190, 0, 190))); 

                    // --- LOGO (Verified from your image_4765b8.png) ---
                    const logoFrame = cc.spriteFrameCache.getSpriteFrame("GJ_logo_001.png");
                    if (logoFrame) {
                        const logo = new cc.Sprite(logoFrame);
                        logo.setPosition(400, 350);
                        logo.setScale(1.1);
                        this.addChild(logo);
                        console.log("System: Logo rendered successfully.");
                    } else {
                        // Fallback text so the game doesn't crash if the name is wrong
                        const errorLabel = new cc.LabelTTF("GEOMETRY DASH", "Arial", 40);
                        errorLabel.setPosition(400, 350);
                        this.addChild(errorLabel);
                        console.warn("System: GJ_logo_001.png not found in cache.");
                    }

                    // --- PLAY BUTTON ---
                    const playFrame = cc.spriteFrameCache.getSpriteFrame("GJ_playBtn_001.png");
                    const btnTex = playFrame ? new cc.Sprite(playFrame) : new cc.Sprite("assets/GJ_squareB_01.png");
                    
                    const playBtn = new cc.MenuItemSprite(btnTex, btnTex, function() {
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
                    this.addChild(new cc.LayerColor(cc.color(20, 20, 20)));
                    const label = new cc.LabelTTF("Level Loading...", "Arial", 30);
                    label.setPosition(400, 225);
                    this.addChild(label);
                }
            });

            cc.director.runScene(new MainMenuScene());
        });
    });
};

// Prevent the "child already added" error
if (!window.GDR_STARTED) {
    window.GDR_STARTED = true;
    cc.game.run("gameCanvas");
}
