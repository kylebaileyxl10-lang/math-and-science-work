// --- GDRWeb v1.0.71: LEVEL SELECTION RECONSTRUCTION ---
window.GDRWEB_VERSION = "1.0.71";

cc.game.onStart = function() {
    cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    const jsonPath = "assets/GJ_GameSheet.json";
    const imagePath = "assets/GJ_GameSheet.png";

    cc.loader.loadTxt(jsonPath, function(err, textData) {
        if (!err && textData) {
            try {
                const sheetData = JSON.parse(textData);
                cc.spriteFrameCache._addSpriteFramesByObject(jsonPath, sheetData);
            } catch (e) { console.error("JSON Map Error"); }
        }

        cc.loader.load([imagePath, "assets/GJ_squareB_01.png"], function() {
            
            const getSprite = (name) => {
                const frame = cc.spriteFrameCache.getSpriteFrame(name);
                return frame ? new cc.Sprite("#" + name) : new cc.Sprite("assets/GJ_squareB_01.png");
            };

            // --- NEW: LEVEL SELECTION SCENE ---
            const LevelSelectScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    
                    // 1. BG Color (Stereo Madness Blue)
                    this.addChild(new cc.LayerColor(cc.color(0, 100, 255)));

                    // 2. SCROLLING GROUND
                    const ground = getSprite("GJ_ground_01_001.png");
                    ground.setAnchorPoint(0, 0);
                    ground.setPosition(0, 0);
                    ground.setScaleX(2.5); // Make it wide
                    this.addChild(ground);

                    // 3. LEVEL CARD UI
                    const levelTitle = new cc.LabelTTF("Stereo Madness", "Arial", 60);
                    levelTitle.setPosition(640, 500);
                    this.addChild(levelTitle);

                    const difficulty = getSprite("difficulty_01_btn_001.png");
                    difficulty.setPosition(640, 350);
                    difficulty.setScale(1.2);
                    this.addChild(difficulty);

                    // 4. NAVIGATION ARROWS
                    const leftArrow = new cc.MenuItemSprite(getSprite("navArrowBtn_001.png"), getSprite("navArrowBtn_001.png"));
                    leftArrow.setRotation(180);
                    
                    const rightArrow = new cc.MenuItemSprite(getSprite("navArrowBtn_001.png"), getSprite("navArrowBtn_001.png"));

                    const navMenu = new cc.Menu(leftArrow, rightArrow);
                    navMenu.alignItemsHorizontallyWithPadding(900);
                    navMenu.setPosition(640, 360);
                    this.addChild(navMenu);

                    // 5. BACK BUTTON
                    const backBtn = new cc.MenuItemSprite(getSprite("GJ_arrow_01_001.png"), getSprite("GJ_arrow_01_001.png"), function() {
                        cc.director.runScene(new MainMenuScene());
                    }, this);
                    
                    const backMenu = new cc.Menu(backBtn);
                    backMenu.setPosition(80, 640);
                    this.addChild(backMenu);
                }
            });

            // --- MAIN MENU SCENE ---
            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.addChild(new cc.LayerColor(cc.color(175, 0, 175))); 

                    const logo = getSprite("GJ_logo_001.png");
                    logo.setPosition(640, 550);
                    this.addChild(logo);

                    const playBtn = new cc.MenuItemSprite(getSprite("GJ_playBtn_001.png"), getSprite("GJ_playBtn_001.png"), function() {
                        cc.director.runScene(new LevelSelectScene()); // Transitions to Level Select
                    }, this);

                    const menu = new cc.Menu(playBtn);
                    menu.setPosition(640, 320);
                    this.addChild(menu);
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
