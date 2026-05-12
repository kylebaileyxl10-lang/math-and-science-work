// --- GDRWeb v1.0.23: ENGINE STABILITY FIX ---
console.log("System: v1.0.23 - Menu Engine Initializing...");

const ID_MAP = { "1": "assets/GJ_square01.png", "default": "assets/GJ_square01.png" };

window.loadGDRWeb = function(xmlData) {
    // This is the important part: Wait for Cocos2d to be ready
    cc.game.onStart = function() {
        
        // --- 1. THE MAIN MENU ---
        const MainMenuScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(10, 15, 30)));

                const title = new cc.LabelTTF("GDRWeb", "Arial", 40);
                title.setPosition(cc.winSize.width / 2, cc.winSize.height - 100);
                title.setColor(cc.color(0, 200, 255));
                this.addChild(title);

                const playBtn = new cc.MenuItemImage(
                    "assets/GJ_button_01.png", 
                    "assets/GJ_button_01.png",
                    function () { cc.director.runScene(new LevelScene()); }
                );
                playBtn.setScale(1.5);
                
                const menu = new cc.Menu(playBtn);
                menu.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
                this.addChild(menu);
            }
        });

        // --- 2. THE LEVEL RENDERER ---
        const LevelScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                const layer = new cc.Layer();
                this.addChild(layer);
                
                try {
                    const parts = xmlData.split("<k>k4</k><s>");
                    const raw = parts[1].split("</s>")[0].trim();
                    const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
                    const data = pako.inflate(Uint8Array.from(bin, c => c.charCodeAt(0)), { to: 'string' });
                    const objects = data.split(';');

                    console.log("Renderer: Drawing " + objects.length + " objects.");

                    objects.slice(0, 5000).forEach(objStr => {
                        const p = objStr.split(',');
                        const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                        if (id && x && y) {
                            const s = new cc.Sprite(ID_MAP[id] || ID_MAP["default"]);
                            s.setPosition(parseFloat(x)/4, (parseFloat(y)/4) - 200);
                            s.setScale(0.3);
                            layer.addChild(s);
                        }
                    });
                } catch(e) { console.error("Scene Error:", e); }
            }
        });

        // FINALLY: Run the menu
        cc.director.runScene(new MainMenuScene());
    };

    // Tell Cocos2d which canvas to use
    cc.game.run("gameCanvas");
};

// Fetch Level Data
fetch('assets/project_data.xml?v=' + Date.now())
    .then(r => r.text())
    .then(window.loadGDRWeb)
    .catch(e => console.error("Data Fetch Failed", e));
