// --- GDRWeb v1.0.56: INPUT & SPRITE FIX ---
if (window.GDRWEB_INITIALIZED) {
    console.warn("System: Blocked duplicate execution.");
} else {
    window.GDRWEB_INITIALIZED = true;
    console.log("System: v1.0.56 - Fixing Plist Loading...");

    window.loadGDRWeb = function(xmlData) {
        cc.game.onStart = function() {
            // Setup View
            cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
            cc.view.resizeWithBrowserSize(true);

            // FIX: Load Plist as XML (Standard GD format)
            cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet.plist");

            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.removeAllChildren(true);
                    
                    const bg = new cc.LayerColor(cc.color(20, 80, 180));
                    this.addChild(bg); 

                    // Logo - Should now find the frame correctly
                    const frame = cc.spriteFrameCache.getSpriteFrame("blackCogwheel_01_001.png");
                    const logo = frame ? new cc.Sprite(frame) : new cc.LabelTTF("GDRWeb (Sprite Error)", "Arial", 30);
                    logo.setPosition(400, 350);
                    if (frame) logo.setScale(1.2);
                    this.addChild(logo);

                    // FIXED BUTTON: Using a more robust MenuItem setup
                    const normalBtn = new cc.Sprite("assets/GJ_squareB_01.png");
                    const selectedBtn = new cc.Sprite("assets/GJ_squareB_01.png");
                    selectedBtn.setOpacity(180); // Visual feedback when clicked

                    const playBtn = new cc.MenuItemSprite(
                        normalBtn, 
                        selectedBtn, 
                        function() {
                            console.log("Button Clicked! Switching to Gameplay...");
                            cc.director.runScene(new GameplayScene());
                        }, this);

                    const menu = new cc.Menu(playBtn);
                    menu.setPosition(400, 200);
                    this.addChild(menu);
                    
                    console.log("System: Menu Scene Ready. Click the blue square.");
                }
            });

            const GameplayScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    this.addChild(new cc.LayerColor(cc.color(10, 40, 90)));
                    const label = new cc.LabelTTF("Gameplay Started!", "Arial", 40);
                    label.setPosition(400, 225);
                    this.addChild(label);
                    
                    const player = new cc.Sprite("assets/icons/player_01.png");
                    player.setPosition(150, 150);
                    this.addChild(player);
                }
            });

            cc.director.runScene(new MainMenuScene());
        };
        
        cc.game.run("gameCanvas");
    };

    fetch('assets/project_data.xml').then(r => r.text()).then(window.loadGDRWeb);
}
