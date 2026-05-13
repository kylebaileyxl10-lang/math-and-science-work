// --- GDRWeb v1.0.68: FULL UI RECONSTRUCTION ---
window.GDRWEB_VERSION = "1.0.68";

cc.game.onStart = function() {
    cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    // List of assets found in your folder
    const assets = [
        "assets/GJ_GameSheet.plist", 
        "assets/GJ_GameSheet.png",
        "assets/GJ_squareB_01.png"
    ];

    cc.loader.load(assets, function(err) {
        if (err) return console.error("Asset Load Failed");

        // Prepare the Sprite Cache
        const plistData = cc.loader.getRes("assets/GJ_GameSheet.plist");
        cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet.plist");

        const MainMenuScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                
                // 1. BACKGROUND: Authentic Purple
                const bg = new cc.LayerColor(cc.color(175, 0, 175));
                this.addChild(bg);

                // HELPER: Grabs sprite from your map or uses square if missing
                const getSprite = (name) => {
                    const frame = cc.spriteFrameCache.getSpriteFrame(name);
                    return frame ? new cc.Sprite("#" + name) : new cc.Sprite("assets/GJ_squareB_01.png");
                };

                // 2. MAIN LOGO
                const logo = getSprite("GJ_logo_001.png");
                logo.setPosition(640, 550);
                logo.setScale(1.1);
                this.addChild(logo);

                // 3. CENTER BUTTONS
                const playBtn = new cc.MenuItemSprite(getSprite("GJ_playBtn_001.png"), getSprite("GJ_playBtn_001.png"), function(){}, this);
                const iconBtn = new cc.MenuItemSprite(getSprite("GJ_iconBtn_001.png"), getSprite("GJ_iconBtn_001.png"), function(){}, this);
                const editBtn = new cc.MenuItemSprite(getSprite("GJ_editBtn_001.png"), getSprite("GJ_editBtn_001.png"), function(){}, this);

                const centerMenu = new cc.Menu(iconBtn, playBtn, editBtn);
                centerMenu.alignItemsHorizontallyWithPadding(50);
                centerMenu.setPosition(640, 320);
                this.addChild(centerMenu);

                // 4. BOTTOM BAR
                const statsBtn = new cc.MenuItemSprite(getSprite("GJ_statsBtn_001.png"), getSprite("GJ_statsBtn_001.png"));
                const settBtn = new cc.MenuItemSprite(getSprite("GJ_settingsBtn_001.png"), getSprite("GJ_settingsBtn_001.png"));
                const scoreBtn = new cc.MenuItemSprite(getSprite("GJ_scoreBtn_001.png"), getSprite("GJ_scoreBtn_001.png"));
                
                const bottomMenu = new cc.Menu(statsBtn, settBtn, scoreBtn);
                bottomMenu.alignItemsHorizontallyWithPadding(30);
                bottomMenu.setPosition(640, 100);
                bottomMenu.setScale(0.8);
                this.addChild(bottomMenu);

                // 5. SIDE REWARDS
                const dailyBtn = new cc.MenuItemSprite(getSprite("GJ_dailyBtn_001.png"), getSprite("GJ_dailyBtn_001.png"));
                const dailyMenu = new cc.Menu(dailyBtn);
                dailyMenu.setPosition(1150, 350);
                this.addChild(dailyMenu);
            }
        });

        cc.director.runScene(new MainMenuScene());
    });
};

if (!window.GDR_STARTED) {
    window.GDR_STARTED = true;
    cc.game.run("gameCanvas");
}
