// --- PART 1: THE RENDERER ---
window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Parsing Level String...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            const winSize = cc.director.getWinSize();
            const bg = new cc.LayerColor(cc.color(15, 15, 20)); 
            this.addChild(bg);

            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            try {
                // Find the object string in your 12MB file
                const parts = xmlData.split('kS38');
                if (parts.length > 1) {
                    const objectString = parts[1].split('</string>')[0].split('>').pop();
                    const objects = objectString.split(';');
                    console.log("Renderer: Found " + objects.length + " objects.");

                    // Test draw: 50 objects
                    objects.slice(0, 50).forEach(objStr => {
                        const p = objStr.split(',');
                        // Props: 1=ID, 3=X, 5=Y
                        if (p[1] && p[3] && p[5]) {
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            sprite.setPosition(parseFloat(p[3]), parseFloat(p[5]));
                            sprite.setScale(0.5);
                            gameLayer.addChild(sprite);
                        }
                    });
                }
            } catch (e) {
                console.error("Parser Error:", e);
            }

            const label = new cc.LabelTTF("Math Lab Active", "Arial", 18);
            label.setPosition(winSize.width / 2, 30);
            this.addChild(label);
        }
    });

    cc.director.runScene(new MathLabScene());
};

// --- PART 2: THE BOOTLOADER ---
async function initGame() {
    const bar = document.getElementById('bar');
    const status = document.getElementById('status');
    const loaderUI = document.getElementById('loader-ui');

    try {
        console.log("Boot: Fetching XML...");
        const res = await fetch('assets/project_data.xml');
        const xml = await res.text();
        console.log("Boot: XML Loaded (" + xml.length + " bytes)");
        
        if (bar) bar.style.width = '100%';

        let check = setInterval(() => {
            if (typeof cc !== 'undefined' && cc.game) {
                clearInterval(check);
                console.log("Boot: Engine found. Starting...");

                cc.game.onStart = function() {
                    cc.view.enableRetina(false);
                    cc.director.setContentScaleFactor(1.0);
                    cc.loader.register(["plist"], cc._txtLoader); 
                    
                    // Reduced resource list to speed up loading
                    const resources = [
                        "assets/GJ_GameSheet.plist", "assets/GJ_GameSheet.png",
                        "assets/GJ_GameSheet02.plist", "assets/GJ_GameSheet02.png"
                    ];
                    
                    cc.loader.load(resources, function() {
                        console.log("Boot: Assets Synced.");
                        
                        resources.forEach(file => {
                            if (file.endsWith(".plist")) {
                                cc.spriteFrameCache.addSpriteFrames(file, file.replace(".plist", ".png"));
                            }
                        });

                        if (window.loadLevelLibrary) window.loadLevelLibrary(xml);
                        if (loaderUI) loaderUI.style.display = 'none';
                    });
                };

                if (!cc.game._prepared) {
                    cc.game.run({"project_type": "javascript", "id": "gameCanvas", "renderMode": 1}); 
                }
            }
        }, 500);

    } catch (e) {
        console.error("Boot Critical Error:", e);
        if (status) status.innerHTML = "Sync Error. Check Assets.";
    }
}

initGame();
