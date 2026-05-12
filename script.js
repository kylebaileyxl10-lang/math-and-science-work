// --- GDRWeb v1.0.30: ASSET RECOVERY MODE ---
console.log("System: v1.0.30 - Finalizing Menu & Assets");

window.GDR = {
    selectedIcon: "assets/player_01.png",
    allLevels: [],
    currentLevelIndex: 0
};

window.loadGDRWeb = function(xmlData) {
    // Parsing 9.6MB of Level Data
    const levelMatches = xmlData.split("<k>k4</k>");
    levelMatches.shift(); 
    window.GDR.allLevels = levelMatches.map(s => s.split("</s>")[0].replace("<s>", "").trim());
    console.log("SUCCESS: Synchronized " + window.GDR.allLevels.length + " levels.");

    cc.game.onStart = function() {
        // --- THE ROBTOP MENU SCENE ---
        const MainMenuScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                // Background Gradient
                this.addChild(new cc.LayerColor(cc.color(125, 0, 255))); 

                // Title Logo
                const logo = new cc.Sprite("assets/GJ_logo_001.png");
                logo.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
                logo.setScale(0.8);
                this.addChild(logo);

                // Main Play Button
                const playBtn = new cc.MenuItemImage("assets/GJ_playBtn_001.png", "assets/GJ_playBtn_001.png", function() {
                    cc.director.runScene(new LevelSelectScene());
                });

                // Garage/Icon Button
                const garageBtn = new cc.MenuItemImage("assets/GJ_garageBtn_001.png", "assets/GJ_garageBtn_001.png", function() {
                    cc.director.runScene(new IconKitScene());
                });
                garageBtn.setScale(0.7);
                garageBtn.setPosition(-150, 0);

                const menu = new cc.Menu(playBtn, garageBtn);
                this.addChild(menu);
            }
        });

        // Initialize with Menu
        cc.director.runScene(new MainMenuScene());
    };
    cc.game.run("gameCanvas");
};

// Fetching your 9.6MB XML file
fetch('assets/project_data.xml?v=' + Date.now()).then(r => r.text()).then(window.loadGDRWeb);
