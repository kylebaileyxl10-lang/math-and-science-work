// --- GDRWeb v1.0.29: THE ULTIMATE GD ENGINE ---
console.log("System: v1.0.29 - Multi-Level & Full UI Engaged");

window.GDR = {
    selectedIcon: "assets/player_01.png", // Adjust based on your folder names
    allLevels: [],
    currentLevelIndex: 0
};

window.loadGDRWeb = function(xmlData) {
    // 1. EXTRACT ALL LEVELS FROM XML
    const levelMatches = xmlData.split("<k>k4</k><s>");
    levelMatches.shift(); // Remove the first split
    window.GDR.allLevels = levelMatches.map(s => s.split("</s>")[0].trim());
    console.log("Found " + window.GDR.allLevels.length + " levels in your save file!");

    cc.game.onStart = function() {
        
        // --- SCENE 1: AUTHENTIC MAIN MENU ---
        const MainMenuScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(40, 125, 255))); // GD Blue

                // Big Play Button
                const playBtn = new cc.MenuItemImage("assets/GJ_playBtn_001.png", "assets/GJ_playBtn_001.png", function() {
                    cc.director.runScene(new LevelSelectScene());
                });

                // Icon Kit Button (Bottom Left)
                const iconBtn = new cc.MenuItemImage("assets/GJ_garageBtn_001.png", "assets/GJ_garageBtn_001.png", function() {
                    cc.director.runScene(new IconKitScene());
                });
                iconBtn.setScale(0.7);

                const menu = new cc.Menu(playBtn);
                const sideMenu = new cc.Menu(iconBtn);
                sideMenu.setPosition(80, 80);
                this.addChild(menu);
                this.addChild(sideMenu);
            }
        });

        // --- SCENE 2: LEVEL SELECT (RobTop Style) ---
        const LevelSelectScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(40, 125, 255)));

                const levelText = new cc.LabelTTF("Level " + (window.GDR.currentLevelIndex + 1), "Arial", 32);
                levelText.setPosition(cc.winSize.width/2, cc.winSize.height/2 + 100);
                this.addChild(levelText);

                const startBtn = new cc.MenuItemImage("assets/GJ_playBtn2_001.png", "assets/GJ_playBtn2_001.png", function() {
                    cc.director.runScene(new GameplayScene());
                });
                startBtn.setScale(0.6);

                const nextBtn = new cc.MenuItemFont(">", function() {
                    window.GDR.currentLevelIndex = (window.GDR.currentLevelIndex + 1) % window.GDR.allLevels.length;
                    cc.director.runScene(new LevelSelectScene());
                });

                const menu = new cc.Menu(startBtn, nextBtn);
                menu.alignItemsHorizontallyWithPadding(50);
                this.addChild(menu);
            }
        });

        // --- SCENE 3: THE ICON KIT ---
        const IconKitScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(30, 30, 30)));
                
                // Add a grid of icons (using the files found in your assets folder)
                const icons = [];
                for(let i=1; i<=12; i++) {
                    const name = "assets/player_" + (i < 10 ? "0"+i : i) + ".png";
                    const item = new cc.MenuItemImage(name, name, function() {
                        window.GDR.selectedIcon = name;
                    });
                    item.setScale(0.8);
                    icons.push(item);
                }

                const grid = new cc.Menu(...icons);
                grid.alignItemsInColumns(4, 4, 4);
                this.addChild(grid);

                const back = new cc.MenuItemFont("BACK", function() { cc.director.runScene(new MainMenuScene()); });
                const bMenu = new cc.Menu(back);
                bMenu.setPosition(60, 400);
                this.addChild(bMenu);
            }
        });

        // --- SCENE 4: GAMEPLAY ---
        const GameplayScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                const world = new cc.Layer();
                this.addChild(new cc.LayerColor(cc.color(0, 102, 255)));
                this.addChild(world);

                const player = new cc.Sprite(window.GDR.selectedIcon);
                player.setPosition(150, 115);
                player.setColor(cc.color(0, 255, 0));
                world.addChild(player);

                // Parse the SPECIFIC level selected
                const raw = window.GDR.allLevels[window.GDR.currentLevelIndex];
                const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
                const data = pako.inflate(Uint8Array.from(bin, c => c.charCodeAt(0)), { to: 'string' });
                
                data.split(';').slice(0, 4000).forEach(objStr => {
                    const p = objStr.split(',');
                    const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                    if (id && x && y) {
                        const s = new cc.Sprite("assets/GJ_square01.png");
                        s.setPosition(parseFloat(x)/4, (parseFloat(y)/4) + 100);
                        s.setScale(0.35);
                        world.addChild(s);
                    }
                });

                this.scheduleUpdate();
                let velY = 0;
                this.update = function(dt) {
                    world.x -= 340 * dt; player.x += 340 * dt; velY -= 38 * dt; player.y += velY;
                    if (player.y <= 115) { player.y = 115; velY = 0; player.rotation = 0; }
                    else { player.rotation += 320 * dt; }
                };
                cc.eventManager.addListener({ event: cc.EventListener.MOUSE, onMouseDown: function() { velY = 14; }}, this);
            }
        });

        cc.director.runScene(new MainMenuScene());
    };
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml?v=' + Date.now()).then(r => r.text()).then(window.loadGDRWeb);
