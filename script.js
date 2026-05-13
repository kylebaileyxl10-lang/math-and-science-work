// --- GDRWeb v1.0.63: VERIFIED FRAME SYNC ---
window.GDRWEB_VERSION = "1.0.63";

cc.game.onStart = function() {
    cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    cc.loader.loadTxt("assets/GJ_GameSheet.plist", function(err, textData) {
        if (!err && textData) {
            try {
                const sheetData = JSON.parse(textData);
                cc.spriteFrameCache._addSpriteFramesByObject("assets/GJ_GameSheet.plist", sheetData);
                console.log("System: JSON Sheet Injected. Found " + Object.keys(sheetData.frames).length + " frames.");
            } catch (e) { console.error("JSON Error"); }
        }

        cc.loader.load(["assets/GJ_GameSheet.png", "assets/GJ_squareB_01.png"], function() {
            
            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.removeAllChildren(true);
                    
                    // Background: Pink
                    this.addChild(new cc.LayerColor(cc.color(190, 0, 190))); 

                    // --- LOGO BLOCK (Using verified name from your console) ---
                    const logoFrame = cc.spriteFrameCache.getSpriteFrame("blackCogwheel_01_001.png");
                    
                    let logoNode;
                    if (logoFrame) {
                        logoNode = new cc.Sprite(logoFrame);
                        logoNode.setScale(2.0); // Make it big like a logo
                    } else {
                        logoNode = new cc.LabelTTF("GDRWeb Engine", "Arial", 40);
                    }
                    
                    logoNode.setPosition(400, 320);
                    this.addChild(logoNode);

                    // --- MAIN PLAY BUTTON ---
                    // Using your confirmed squareB asset as a placeholder
                    const playBtn = new cc.MenuItemSprite(
                        new cc.Sprite("assets/GJ_squareB_01.png"), 
                        new cc.Sprite("assets/GJ_squareB_01.png"), 
                        function() {
                            cc.director.runScene(new GameplayScene());
                        }, this);
                    playBtn.setScale(1.5);

                    const menu = new cc.Menu(playBtn);
                    menu.setPosition(400, 150);
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

            // Start on the MENU, not the loading screen
            cc.director.runScene(new MainMenuScene());
        });
    });
};

if (!window.GDR_STARTED) {
    window.GDR_STARTED = true;
    cc.game.run("gameCanvas");
}
