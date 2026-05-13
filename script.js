// --- GDRWeb v1.0.60: MANUAL JSON SPRITE INJECTION ---
window.GDRWEB_VERSION = "1.0.60";

cc.game.onStart = function() {
    cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    // 1. Fetch your JSON-based plist manually
    cc.loader.loadTxt("assets/GJ_GameSheet.plist", function(err, textData) {
        if (err) return console.error("Could not find GJ_GameSheet.plist");

        try {
            const sheetData = JSON.parse(textData);
            // Manually inject into cache to bypass "Not a plist" XML check
            cc.spriteFrameCache._addSpriteFramesByObject("assets/GJ_GameSheet.plist", sheetData);
            console.log("System: JSON Sheet injected successfully.");
        } catch (e) {
            console.error("JSON Parse Error: Make sure your plist is valid JSON.", e);
        }

        // 2. Load the actual image texture
        cc.loader.load("assets/GJ_GameSheet.png", function() {
            
            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.removeAllChildren(true);
                    
                    // Background: Authentic Pink/Purple
                    this.addChild(new cc.LayerColor(cc.color(190, 0, 190))); 

                    // LOGO: High center
                    const logoFrame = cc.spriteFrameCache.getSpriteFrame("GJ_logo_001.png");
                    const logo = logoFrame ? new cc.Sprite(logoFrame) : new cc.LabelTTF("GEOMETRY DASH", "Arial", 50);
                    logo.setPosition(400, 350);
                    this.addChild(logo);

                    // MAIN PLAY BUTTON: Large center
                    const playFrame = cc.spriteFrameCache.getSpriteFrame("GJ_playBtn_001.png");
                    const playBtnSprite = playFrame ? new cc.Sprite(playFrame) : new cc.Sprite("assets/GJ_squareB_01.png");
                    const playBtn = new cc.MenuItemSprite(playBtnSprite, playBtnSprite, function() {
                        cc.director.runScene(new GameplayScene());
                    }, this);
                    playBtn.setScale(1.4);

                    const mainRow = new cc.Menu(playBtn);
                    mainRow.setPosition(400, 180);
                    this.addChild(mainRow);
                }
            });

            const GameplayScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.addChild(new cc.LayerColor(cc.color(0, 0, 0)));
                    this.addChild(new cc.LabelTTF("Level Loading...", "Arial", 30)).setPosition(400, 225);
                }
            });

            cc.director.runScene(new MainMenuScene());
        });
    });
};

if (!window.GDR_STARTED) {
    window.GDR_STARTED = true;
    cc.game.run("gameCanvas");
}
