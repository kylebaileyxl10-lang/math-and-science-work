// --- GDRWeb v1.0.73: NESTED JSON COMPATIBILITY ---
window.GDRWEB_VERSION = "1.0.73";

cc.game.onStart = function() {
    cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    const assetList = [
        "assets/GJ_GameSheet.json", "assets/GJ_GameSheet.png",
        "assets/GJ_GameSheet04.json", "assets/GJ_GameSheet04.png",
        "assets/GJ_squareB_01.png"
    ];

    cc.loader.load(assetList, function() {
        // --- SMART SPLICER: Handles both Standard and Nested JSON ---
        const spliceSheet = (jsonPath) => {
            const data = cc.loader.getRes(jsonPath);
            if (!data) return;
            
            // Check if it's the Nested Plist format (like your GameSheet04)
            if (data.plist && data.plist.dict) {
                const frames = data.plist.dict[0].dict;
                const keys = data.plist.dict[0].key;
                let converted = { frames: {}, metadata: {} };
                
                // Maps the nested arrays into a format Cocos understands
                keys.forEach((key, i) => {
                    if (frames[i]) converted.frames[key] = frames[i];
                });
                cc.spriteFrameCache._addSpriteFramesByObject(jsonPath, converted);
            } else {
                // Standard format (like your GameSheet01)
                cc.spriteFrameCache._addSpriteFramesByObject(jsonPath, data);
            }
        };

        spliceSheet("assets/GJ_GameSheet.json");
        spliceSheet("assets/GJ_GameSheet04.json");

        const getSprite = (name) => {
            const frame = cc.spriteFrameCache.getSpriteFrame(name);
            if (frame) return new cc.Sprite("#" + name);
            console.warn("Resource Missing:", name);
            return new cc.Sprite("assets/GJ_squareB_01.png");
        };

        const MainMenuScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(175, 0, 175))); // GD Purple

                // LOGO (Found in GJ_GameSheet.json)
                const logo = getSprite("GJ_logo_001.png");
                logo.setPosition(640, 550);
                this.addChild(logo);

                // PLAY BUTTON (Found in GJ_GameSheet04.json)
                const playBtn = new cc.MenuItemSprite(
                    getSprite("GJ_playBtn_001.png"), 
                    getSprite("GJ_playBtn_001.png"), 
                    function() { cc.director.runScene(new LevelSelectScene()); }, this);
                
                const menu = new cc.Menu(playBtn);
                menu.setPosition(640, 320);
                this.addChild(menu);
            }
        });

        const LevelSelectScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(0, 100, 255))); // Stereo Madness Blue
                const label = new cc.LabelTTF("Stereo Madness", "Arial", 60);
                label.setPosition(640, 500);
                this.addChild(label);

                // BACK BUTTON
                const backBtn = new cc.MenuItemSprite(
                    getSprite("GJ_arrow_01_001.png"), 
                    getSprite("GJ_arrow_01_001.png"), 
                    function() { cc.director.runScene(new MainMenuScene()); }, this);
                const backMenu = new cc.Menu(backBtn);
                backMenu.setPosition(80, 640);
                this.addChild(backMenu);
            }
        });

        cc.director.runScene(new MainMenuScene());
    });
};

if (!window.GDR_STARTED) {
    window.GDR_STARTED = true;
    cc.game.run("gameCanvas");
}
