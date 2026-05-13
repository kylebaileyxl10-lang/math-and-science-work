// --- GDRWeb v1.0.69: THE JSON TRANSITION ---
window.GDRWEB_VERSION = "1.0.69";

cc.game.onStart = function() {
    cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    // 1. Updated path to .json
    const jsonPath = "assets/GJ_GameSheet.json";
    const imagePath = "assets/GJ_GameSheet.png";

    cc.loader.loadTxt(jsonPath, function(err, textData) {
        if (!err && textData) {
            try {
                const sheetData = JSON.parse(textData);
                // Force inject the JSON object directly
                cc.spriteFrameCache._addSpriteFramesByObject(jsonPath, sheetData);
                console.log("System: JSON Map Linked Successfully.");
            } catch (e) { console.error("System: JSON Parse Error. Check your file content."); }
        }

        cc.loader.load([imagePath, "assets/GJ_squareB_01.png"], function() {
            
            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.removeAllChildren(true);
                    this.addChild(new cc.LayerColor(cc.color(175, 0, 175))); // GD Pink

                    const getSprite = (name) => {
                        const frame = cc.spriteFrameCache.getSpriteFrame(name);
                        return frame ? new cc.Sprite("#" + name) : new cc.Sprite("assets/GJ_squareB_01.png");
                    };

                    // Logo
                    const logo = getSprite("GJ_logo_001.png");
                    logo.setPosition(640, 550);
                    this.addChild(logo);

                    // Main Row
                    const playBtn = new cc.MenuItemSprite(getSprite("GJ_playBtn_001.png"), getSprite("GJ_playBtn_001.png"), function(){});
                    const iconBtn = new cc.MenuItemSprite(getSprite("GJ_iconBtn_001.png"), getSprite("GJ_iconBtn_001.png"));
                    const editBtn = new cc.MenuItemSprite(getSprite("GJ_editBtn_001.png"), getSprite("GJ_editBtn_001.png"));

                    const centerMenu = new cc.Menu(iconBtn, playBtn, editBtn);
                    centerMenu.alignItemsHorizontallyWithPadding(50);
                    centerMenu.setPosition(640, 320);
                    this.addChild(centerMenu);

                    // Bottom Row
                    const statsBtn = new cc.MenuItemSprite(getSprite("GJ_statsBtn_001.png"), getSprite("GJ_statsBtn_001.png"));
                    const settBtn = new cc.MenuItemSprite(getSprite("GJ_settingsBtn_001.png"), getSprite("GJ_settingsBtn_001.png"));
                    
                    const bottomMenu = new cc.Menu(statsBtn, settBtn);
                    bottomMenu.alignItemsHorizontallyWithPadding(30);
                    bottomMenu.setPosition(640, 100);
                    bottomMenu.setScale(0.8);
                    this.addChild(bottomMenu);
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
