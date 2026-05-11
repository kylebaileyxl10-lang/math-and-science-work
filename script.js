// --- PART 1: THE COMPRESSION-AWARE RENDERER ---
window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Starting Compressed Data Recovery...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            this.addChild(new cc.LayerColor(cc.color(10, 10, 15))); 
            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            try {
                // 1. Find the compressed string inside the <k>k4</k> key
                const k4Start = xmlData.indexOf('<k>k4</k><s>') + 9;
                const k4End = xmlData.indexOf('</s>', k4Start);
                let compressedData = xmlData.substring(k4Start, k4End);

                if (compressedData.length > 100) {
                    console.log("Renderer: Compressed string found. Unzipping...");

                    // 2. Decompress Gzip/Base64 data
                    // Cocos2d-JS handles the Base64 conversion internally
                    const unzipped = cc.Codec.GZip.gunzip(compressedData);
                    const levelString = cc.Codec.Base64.decode(unzipped);
                    
                    const objects = levelString.split(';');
                    console.log("Renderer: SUCCESS! Unzipped " + objects.length + " objects.");

                    // 3. Draw a test batch
                    objects.slice(0, 200).forEach(objStr => {
                        const p = objStr.split(',');
                        const x = parseFloat(p[p.indexOf('2') + 1]);
                        const y = parseFloat(p[p.indexOf('3') + 1]);

                        if (!isNaN(x) && !isNaN(y)) {
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            sprite.setPosition(x / 5, y / 5);
                            sprite.setScale(0.2);
                            gameLayer.addChild(sprite);
                        }
                    });
                }
            } catch (e) {
                console.error("Renderer: Failed to decompress data. Format mismatch.", e);
            }

            const label = new cc.LabelTTF("Lab Status: Data Decoded", "Arial", 16);
            label.setPosition(cc.winSize.width / 2, 30);
            this.addChild(label);
        }
    });
    cc.director.runScene(new MathLabScene());
};

// --- PART 2: THE BOOTLOADER (V1.0.3) ---
async function initGame() {
    const loaderUI = document.getElementById('loader-ui');
    try {
        console.log("Boot: Fetching Data...");
        const res = await fetch('assets/project_data.xml');
        const xml = await res.text();
        
        let check = setInterval(() => {
            if (typeof cc !== 'undefined' && cc.game) {
                clearInterval(check);
                cc.game.onStart = function() {
                    cc.view.enableRetina(false);
                    cc.director.setContentScaleFactor(1.0);
                    cc.loader.register(["plist"], cc._txtLoader); 
                    
                    cc.loader.load(["assets/GJ_GameSheet.plist", "assets/GJ_GameSheet.png"], function() {
                        resources.forEach(file => {
                            if (file.endsWith(".plist")) {
                                cc.spriteFrameCache.addSpriteFrames(file, file.replace(".plist", ".png"));
                            }
                        });
                        window.loadLevelLibrary(xml);
                        if (loaderUI) loaderUI.style.display = 'none';
                    });
                };
                if (!cc.game._prepared) cc.game.run({"id": "gameCanvas", "renderMode": 1}); 
            }
        }, 500);
    } catch (e) { console.error(e); }
}
initGame();
