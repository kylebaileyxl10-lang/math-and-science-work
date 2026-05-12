// --- GDRWeb v1.0.48: ISOLATED SETUP LOGIC ---
console.log("System: v1.0.48 - Externalizing UI Construction");

window.loadGDRWeb = function(xmlData) {
    cc.game.onStart = function() {
        cc.view.enableRetina(false); 
        cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);

        cc.loader.loadTxt("assets/GJ_GameSheet.plist", function(err, textData) {
            if (err) return console.error("Assets folder missing or inaccessible.");
            
            try {
                // Parse your JS-based JSON sheet
                cc.spriteFrameCache._addSpriteFramesByObject("assets/GJ_GameSheet.plist", JSON.parse(textData));
                console.log("System: Sheet Map Successfully Loaded");
            } catch (e) { console.warn("Notice: Continuing without sheet mapping."); }

            // PRE-BUILD OBJECTS (Ensures they only exist once in memory)
            const bgLayer = new cc.LayerColor(cc.color(20, 80, 180));
            
            const frame = cc.spriteFrameCache.getSpriteFrame("blackCogwheel_01_001.png");
            const logoNode = frame ? new cc.Sprite(frame) : new cc.LabelTTF("GDRWeb Engine", "Arial", 40);
            logoNode.setPosition(400, 350);
            if (frame) logoNode.setScale(1.5);

            // Play Button using confirmed squareB_01
            const playBtnSprite = new cc.Sprite("assets/GJ_squareB_01.png");
            const playBtn = new cc.MenuItemSprite(playBtnSprite, playBtnSprite, function() {
                cc.director.runScene(new cc.Scene()); // Simple reset for now
                console.log("Gameplay clicked");
            });
            const mainMenu = new cc.Menu(playBtn);
            mainMenu.setPosition(400, 225);

            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    
                    // THE CRITICAL GUARD: Only add if current child count is ZERO
                    const currentChildren = this.getChildrenCount();
                    if (currentChildren === 0) {
                        console.log("System: Building Menu (Initial Run)");
                        this.addChild(bgLayer);
                        this.addChild(logoNode);
                        this.addChild(mainMenu);
                    } else {
                        console.log("System: Blocked duplicate child injection. Count: " + currentChildren);
                    }
                    
                    if (document.getElementById('status')) document.getElementById('status').style.display = 'none';
                }
            });

            cc.director.runScene(new MainMenuScene());
        });
    };
    cc.game.run("gameCanvas");
};

// Fetch your large project XML
fetch('assets/project_data.xml').then(r => r.text()).then(window.loadGDRWeb);
