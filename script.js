// --- GDRWeb v1.0.65: FULL AUTHENTIC MENU ---
window.GDRWEB_VERSION = "1.0.65";

cc.game.onStart = function() {
    cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    // Load the JSON Map first
    cc.loader.loadTxt("assets/GJ_GameSheet.plist", function(err, textData) {
        if (!err && textData) {
            try {
                const sheetData = JSON.parse(textData);
                cc.spriteFrameCache._addSpriteFramesByObject("assets/GJ_GameSheet.plist", sheetData);
            } catch (e) { console.error("JSON Error:", e); }
        }

        // Load all required textures
        const assets = ["assets/GJ_GameSheet.png", "assets/GJ_squareB_01.png"];
        cc.loader.load(assets, function() {
            
            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.removeAllChildren(true);
                    
                    // 1. BACKGROUND: The Purple/Pink GD Gradient
                    const bg = new cc.LayerGradient(cc.color(190, 0, 190), cc.color(80, 0, 80));
                    this.addChild(bg); 

                    // 2. THE LOGO
                    const logo = new cc.Sprite("#GJ_logo_001.png");
                    logo.setPosition(400, 340);
                    logo.setScale(1.1);
                    this.addChild(logo);

                    // 3. MAIN CENTER BUTTONS (Icon Kit, Play, Editor)
                    const playBtn = new cc.MenuItemSprite(
                        new cc.Sprite("#GJ_playBtn_001.png"), 
                        new cc.Sprite("#GJ_playBtn_001.png"), 
                        function() { cc.director.runScene(new GameplayScene()); }, this);
                    playBtn.setScale(1.3);

                    const iconBtn = new cc.MenuItemSprite(
                        new cc.Sprite("#GJ_iconBtn_001.png"), 
                        new cc.Sprite("#GJ_iconBtn_001.png"), 
                        function(){}, this);

                    const editBtn = new cc.MenuItemSprite(
                        new cc.Sprite("#GJ_editBtn_001.png"), 
                        new cc.Sprite("#GJ_editBtn_001.png"), 
                        function(){}, this);

                    const centerMenu = new cc.Menu(iconBtn, playBtn, editBtn);
                    centerMenu.alignItemsHorizontallyWithPadding(40);
                    centerMenu.setPosition(400, 180);
                    this.addChild(centerMenu);

                    // 4. BOTTOM BUTTON ROW (Stats, Settings, etc.)
                    const statsBtn = new cc.MenuItemSprite(new cc.Sprite("#GJ_statsBtn_001.png"), new cc.Sprite("#GJ_statsBtn_001.png"));
                    const settBtn = new cc.MenuItemSprite(new cc.Sprite("#GJ_settingsBtn_001.png"), new cc.Sprite("#GJ_settingsBtn_001.png"));
                    
                    const bottomMenu = new cc.Menu(statsBtn, settBtn);
                    bottomMenu.alignItemsHorizontallyWithPadding(20);
                    bottomMenu.setPosition(400, 60);
                    bottomMenu.setScale(0.8);
                    this.addChild(bottomMenu);
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
