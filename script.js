// --- GDRWeb v1.0.70: UI ROUTING & SCENE TRANSITIONS ---
window.GDRWEB_VERSION = "1.0.70";

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
            } catch (e) { console.error("JSON Error"); }
        }

        cc.loader.load([imagePath, "assets/GJ_squareB_01.png"], function() {
            
            // --- HELPER: Generates a blank room to travel to ---
            const createSubScene = function(roomName) {
                const Scene = cc.Scene.extend({
                    onEnter: function() {
                        this._super();
                        this.addChild(new cc.LayerColor(cc.color(15, 15, 25))); // Dark background

                        // Room Title
                        const title = new cc.LabelTTF(roomName, "Arial", 45);
                        title.setPosition(640, 360);
                        this.addChild(title);

                        // Back Button (Returns to Main Menu)
                        const backBtn = new cc.MenuItemSprite(
                            new cc.Sprite("assets/GJ_squareB_01.png"), 
                            new cc.Sprite("assets/GJ_squareB_01.png"), 
                            function() { cc.director.runScene(new MainMenuScene()); }, this
                        );
                        
                        const menu = new cc.Menu(backBtn);
                        menu.setPosition(80, 640); // Top left corner
                        this.addChild(menu);
                    }
                });
                return new Scene();
            };

            // --- MAIN MENU SCENE ---
            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.removeAllChildren(true);
                    this.addChild(new cc.LayerColor(cc.color(175, 0, 175))); 

                    const getSprite = (name) => {
                        const frame = cc.spriteFrameCache.getSpriteFrame(name);
                        return frame ? new cc.Sprite("#" + name) : new cc.Sprite("assets/GJ_squareB_01.png");
                    };

                    const logo = getSprite("GJ_logo_001.png");
                    logo.setPosition(640, 550);
                    this.addChild(logo);

                    // --- BUTTON WIRING ---
                    // 1. Icon Kit
                    const iconBtn = new cc.MenuItemSprite(getSprite("GJ_iconBtn_001.png"), getSprite("GJ_iconBtn_001.png"), function() {
                        cc.director.runScene(createSubScene("ICON KIT ROUTE\n(Select your cube here later)"));
                    }, this);

                    // 2. Play Main Levels
                    const playBtn = new cc.MenuItemSprite(getSprite("GJ_playBtn_001.png"), getSprite("GJ_playBtn_001.png"), function() {
                        cc.director.runScene(createSubScene("LEVEL SELECT ROUTE\n(Stereo Madness, Back on Track, etc)"));
                    }, this);

                    // 3. Creator Menu
                    const editBtn = new cc.MenuItemSprite(getSprite("GJ_editBtn_001.png"), getSprite("GJ_editBtn_001.png"), function() {
                        cc.director.runScene(createSubScene("CREATOR ROUTE\n(Create, Saved, My Levels)"));
                    }, this);

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

            // Boot up the engine into the Main Menu
            cc.director.runScene(new MainMenuScene());
        });
    });
};

if (!window.GDR_STARTED) {
    window.GDR_STARTED = true;
    cc.game.run("gameCanvas");
}
