// --- GDRWeb v1.0.27: THE FULL GAME SYSTEM ---
console.log("System: v1.0.27 - Full Menu & Icons Engaged");

// GLOBAL SETTINGS
window.GDR = {
    selectedIcon: "assets/GJ_square01.png",
    currentLevel: "assets/project_data.xml",
    levelData: null
};

window.loadGDRWeb = function(xmlData) {
    window.GDR.levelData = xmlData;
    
    cc.game.onStart = function() {
        
        // --- SCENE 1: MAIN MENU ---
        const MainMenuScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(10, 15, 30)));
                
                const title = new cc.LabelTTF("GDRWeb", "Arial", 48);
                title.setPosition(cc.winSize.width/2, cc.winSize.height - 80);
                this.addChild(title);

                const playBtn = new cc.MenuItemImage("assets/GJ_button_01.png", "assets/GJ_button_01.png", function() {
                    cc.director.runScene(new LevelScene());
                });
                
                const iconBtn = new cc.MenuItemImage(window.GDR.selectedIcon, window.GDR.selectedIcon, function() {
                    cc.director.runScene(new IconKitScene());
                });
                iconBtn.setScale(1.5);

                const menu = new cc.Menu(playBtn, iconBtn);
                menu.alignItemsVerticallyWithPadding(50);
                this.addChild(menu);
            }
        });

        // --- SCENE 2: ICON KIT ---
        const IconKitScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(20, 20, 40)));
                
                const backBtn = new cc.MenuItemFont("< BACK", function() {
                    cc.director.runScene(new MainMenuScene());
                });

                // Display your actual files from the assets folder
                const icon1 = new cc.MenuItemImage("assets/GJ_square01.png", "assets/GJ_square01.png", function() {
                    window.GDR.selectedIcon = "assets/GJ_square01.png";
                });
                
                const icon2 = new cc.MenuItemImage("assets/GJ_square02.png", "assets/GJ_square02.png", function() {
                    window.GDR.selectedIcon = "assets/GJ_square02.png";
                });

                const menu = new cc.Menu(icon1, icon2, backBtn);
                menu.alignItemsHorizontallyWithPadding(40);
                this.addChild(menu);
            }
        });

        // --- SCENE 3: THE GAMEPLAY ---
        const LevelScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                if (document.getElementById('loader-ui')) document.getElementById('loader-ui').style.display = 'none';

                const bg = new cc.LayerColor(cc.color(0, 102, 255)); 
                this.addChild(bg);
                const world = new cc.Layer();
                this.addChild(world);

                // USE THE SELECTED ICON
                const player = new cc.Sprite(window.GDR.selectedIcon);
                player.setPosition(150, 200);
                player.setColor(cc.color(0, 255, 0));
                world.addChild(player);

                // Level Parsing Logic (same as v1.0.26)
                try {
                    const raw = window.GDR.levelData.split("<k>k4</k><s>")[1].split("</s>")[0].trim();
                    const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
                    const data = pako.inflate(Uint8Array.from(bin, c => c.charCodeAt(0)), { to: 'string' });
                    const objects = data.split(';');

                    objects.slice(0, 3000).forEach(objStr => {
                        const p = objStr.split(',');
                        const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                        if (id && x && y) {
                            const s = new cc.Sprite("assets/GJ_square01.png");
                            s.setPosition(parseFloat(x)/4, (parseFloat(y)/4) + 100);
                            s.setScale(0.35);
                            world.addChild(s);
                        }
                    });
                } catch(e) { console.error(e); }

                // Physics update loop...
                this.scheduleUpdate();
                let velY = 0;
                this.update = function(dt) {
                    world.x -= 320 * dt;
                    player.x += 320 * dt;
                    velY -= 35 * dt;
                    player.y += velY;
                    if (player.y <= 115) { player.y = 115; velY = 0; player.rotation = 0; }
                    else { player.rotation += 300 * dt; }
                };

                cc.eventManager.addListener({
                    event: cc.EventListener.MOUSE,
                    onMouseDown: function() { velY = 13; }
                }, this);
            }
        });

        cc.director.runScene(new MainMenuScene());
    };
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml?v=' + Date.now()).then(r => r.text()).then(window.loadGDRWeb);
