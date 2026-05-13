// --- GDRWeb v1.0.55: THE DEFINITIVE SYNC ---
if (window.GDRWEB_INITIALIZED) {
    console.warn("System: Blocked cached duplicate execution.");
} else {
    window.GDRWEB_INITIALIZED = true;
    console.log("System: v1.0.55 - Loading GDRWeb Engine...");

    window.loadGDRWeb = function(xmlData) {
        cc.game.onStart = function() {
            cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
            cc.spriteFrameCache.removeSpriteFrames();

            cc.loader.loadTxt("assets/GJ_GameSheet.plist", function(err, textData) {
                const MainMenuScene = cc.Scene.extend({
                    onEnter: function() {
                        this._super();
                        this.removeAllChildren(true);
                        this.addChild(new cc.LayerColor(cc.color(20, 80, 180))); 

                        // Use verified cogwheel name
                        const frame = cc.spriteFrameCache.getSpriteFrame("blackCogwheel_01_001.png");
                        const logo = frame ? new cc.Sprite(frame) : new cc.LabelTTF("GDRWeb", "Arial", 36);
                        logo.setPosition(400, 350);
                        this.addChild(logo);

                        const playBtn = new cc.MenuItemSprite(new cc.Sprite("assets/GJ_squareB_01.png"), new cc.Sprite("assets/GJ_squareB_01.png"), function() {
                            cc.director.runScene(new GameplayScene());
                        });
                        const menu = new cc.Menu(playBtn);
                        menu.setPosition(400, 200);
                        this.addChild(menu);
                    }
                });

                const GameplayScene = cc.Scene.extend({
                    onEnter: function() {
                        this._super();
                        this.removeAllChildren(true);
                        this.addChild(new cc.LayerColor(cc.color(10, 40, 90)));
                        const p = new cc.Sprite("assets/icons/player_01.png");
                        p.setPosition(150, 150);
                        this.addChild(p);
                    }
                });
                cc.director.runScene(new MainMenuScene());
            });
        };
        cc.game.run("gameCanvas");
    };

    fetch('assets/project_data.xml').then(r => r.text()).then(window.loadGDRWeb);
}
