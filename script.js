// --- GDRWeb v1.0.22: MAIN MENU & UI ---
console.log("System: v1.0.22 - UI & Menu Engine Loaded");

const ID_MAP = { "1": "assets/GJ_square01.png", "default": "assets/GJ_square01.png" };

window.loadGDRWeb = function(xmlData) {
    
    // --- SCENE 1: THE MAIN MENU ---
    const MainMenuScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            this.addChild(new cc.LayerColor(cc.color(10, 10, 25)));

            // 1. Title
            const title = new cc.LabelTTF("GDRWeb", "Arial", 42);
            title.setPosition(cc.winSize.width / 2, cc.winSize.height - 80);
            title.setColor(cc.color(0, 255, 0));
            this.addChild(title);

            // 2. Play Button (Using GJ_button_01 from your assets)
            const playBtn = new cc.MenuItemImage(
                "assets/GJ_button_01.png", 
                "assets/GJ_button_01.png",
                function () { cc.director.runScene(new LevelScene()); }
            );
            playBtn.setScale(2.0);
            
            // 3. Icon Kit Button
            const iconBtn = new cc.MenuItemImage(
                "assets/GJ_square01.png",
                "assets/GJ_square01.png",
                function () { console.log("Icon Picker coming soon!"); }
            );
            iconBtn.setScale(1.2);

            const menu = new cc.Menu(playBtn, iconBtn);
            menu.alignItemsVerticallyWithPadding(40);
            this.addChild(menu);
        }
    });

    // --- SCENE 2: THE LEVEL RENDERER ---
    const LevelScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            const layer = new cc.Layer();
            this.addChild(layer);
            
            // Parsing Logic (The 236k objects)
            try {
                const parts = xmlData.split("<k>k4</k><s>");
                const raw = parts[1].split("</s>")[0].trim();
                const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
                const data = pako.inflate(Uint8Array.from(bin, c => c.charCodeAt(0)), { to: 'string' });
                const objects = data.split(';');

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
            } catch(e) { console.error(e); }
        }
    });

    cc.director.runScene(new MainMenuScene());
};

fetch('assets/project_data.xml?v=' + Date.now())
    .then(r => r.text())
    .then(window.loadGDRWeb);
