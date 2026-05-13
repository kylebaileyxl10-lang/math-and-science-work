// --- GDRWeb v1.0.58: GD AUTHENTIC MENU LAYOUT ---
window.GDRWEB_VERSION = "1.0.58";

const g_resources = [
    "assets/GJ_GameSheet.plist",
    "assets/GJ_GameSheet.png",
    "assets/GJ_squareB_01.png"
];

cc.game.onStart = function() {
    cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    cc.loader.load(g_resources, function() {
        cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet.plist");
        
        const MainMenuScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.removeAllChildren(true);
                
                // 1. BACKGROUND: Dark Blue Gradient
                const bg = new cc.LayerGradient(cc.color(20, 100, 200), cc.color(10, 40, 90));
                this.addChild(bg); 

                // 2. LOGO: Centered at the top
                const logoFrame = cc.spriteFrameCache.getSpriteFrame("GJ_logo_001.png");
                const logo = logoFrame ? new cc.Sprite(logoFrame) : new cc.LabelTTF("GEOMETRY DASH", "Arial", 48);
                logo.setPosition(400, 340);
                logo.setScale(1.1);
                this.addChild(logo);

                // 3. MAIN PLAY BUTTON (Center)
                const playFrame = cc.spriteFrameCache.getSpriteFrame("GJ_playBtn_001.png");
                const playBtnSprite = playFrame ? new cc.Sprite(playFrame) : new cc.Sprite("assets/GJ_squareB_01.png");
                const playBtn = new cc.MenuItemSprite(playBtnSprite, playBtnSprite, function() {
                    cc.director.runScene(new GameplayScene());
                }, this);
                playBtn.setScale(1.3);

                // 4. SUB-BUTTONS (Left and Right of Play)
                const iconBtnSprite = new cc.Sprite("assets/GJ_squareB_01.png"); // Replace with GJ_iconBtn_001.png if you have it
                const iconBtn = new cc.MenuItemSprite(iconBtnSprite, iconBtnSprite, function() {
                    console.log("Icon Kit clicked");
                }, this);

                const editorBtnSprite = new cc.Sprite("assets/GJ_squareB_01.png"); // Replace with GJ_editBtn_001.png
                const editorBtn = new cc.MenuItemSprite(editorBtnSprite, editorBtnSprite, function() {
                    console.log("Editor clicked");
                }, this);

                // Main Menu Row (Play in center, others side-by-side)
                const centerMenu = new cc.Menu(iconBtn, playBtn, editorBtn);
                centerMenu.alignItemsHorizontallyWithPadding(40);
                centerMenu.setPosition(400, 180);
                this.addChild(centerMenu);

                // 5. BOTTOM ROW (Settings, Info, etc.)
                const createBottomBtn = (label) => {
                    const btn = new cc.MenuItemSprite(new cc.Sprite("assets/GJ_squareB_01.png"), new cc.Sprite("assets/GJ_squareB_01.png"), function(){});
                    btn.setScale(0.7);
                    return btn;
                };

                const bottomMenu = new cc.Menu(createBottomBtn(), createBottomBtn(), createBottomBtn(), createBottomBtn());
                bottomMenu.alignItemsHorizontallyWithPadding(20);
                bottomMenu.setPosition(400, 60);
                this.addChild(bottomMenu);
            }
        });

        const GameplayScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(0, 0, 0)));
                const label = new cc.LabelTTF("Level Loading...", "Arial", 30);
                label.setPosition(400, 225);
                this.addChild(label);
            }
        });

        cc.director.runScene(new MainMenuScene());
    });
};

// Start logic
if (!window.GDR_STARTED) {
    window.GDR_STARTED = true;
    cc.game.run("gameCanvas");
}
