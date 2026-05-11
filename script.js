// --- PART 1: THE DEEP RENDERER ---
window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Starting Deep Scan...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            const winSize = cc.director.getWinSize();
            const bg = new cc.LayerColor(cc.color(10, 10, 15)); 
            this.addChild(bg);

            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            try {
                // 1. Find the start of the object string (kS38)
                const s38Index = xmlData.indexOf('kS38');
                if (s38Index !== -1) {
                    const startTag = xmlData.indexOf('>', s38Index) + 1;
                    const endTag = xmlData.indexOf('</string>', startTag);
                    const objectString = xmlData.substring(startTag, endTag);
                    
                    // 2. Split into individual blocks/spikes
                    const objects = objectString.split(';');
                    console.log("Renderer: Found " + (objects.length - 1) + " total objects!");

                    // 3. Draw the first 200 objects
                    let drawnCount = 0;
                    objects.slice(0, 200).forEach(objStr => {
                        if (!objStr) return;
                        const p = objStr.split(',');
                        
                        const objID = p[1];
                        const x = parseFloat(p[3]); 
                        const y = parseFloat(p[5]); 

                        if (objID && !isNaN(x) && !isNaN(y)) {
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            sprite.setPosition(x, y);
                            sprite.setScale(0.5);
                            gameLayer.addChild(sprite);
                            drawnCount++;
                        }
                    });
                    console.log("Renderer: Successfully drew " + drawnCount + " test sprites.");
                    
                } else {
                    console.error("Renderer Error: kS38 key not found in XML!");
                }
            } catch (e) {
                console.error("Parser Crash:", e);
            }

            const label = new cc.LabelTTF("Math Lab: Objects Found", "Arial", 18);
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

// THIS IS THE TRIGGER THAT WAS LIKELY MISSING
initGame();
