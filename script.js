// --- PART 1: THE DECOMPRESSION RENDERER ---
window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Starting Gzip/Base64 Data Recovery...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            this.addChild(new cc.LayerColor(cc.color(15, 15, 25))); 
            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            try {
                // 1. Extract the H4sIA block from the <k>k4</k> section
                const k4Marker = "<k>k4</k><s>";
                const start = xmlData.indexOf(k4Marker) + k4Marker.length;
                const end = xmlData.indexOf("</s>", start);
                const compressedData = xmlData.substring(start, end).trim();

                if (compressedData.length > 100) {
                    console.log("Renderer: Compressed string found. unzipping...");

                    // 2. Use Cocos2d's internal codec to unzip the level
                    const levelString = cc.Codec.GZip.gunzip(compressedData);
                    const objects = levelString.split(';');
                    console.log("Renderer: SUCCESS! Decoded " + objects.length + " objects.");

                    // 3. Draw a testing batch
                    objects.slice(0, 500).forEach(objStr => {
                        const p = objStr.split(',');
                        const xIdx = p.indexOf('2');
                        const yIdx = p.indexOf('3');
                        
                        if (xIdx !== -1 && yIdx !== -1) {
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            sprite.setPosition(parseFloat(p[xIdx+1]) / 5, parseFloat(p[yIdx+1]) / 5);
                            sprite.setScale(0.15);
                            gameLayer.addChild(sprite);
                        }
                    });
                } else {
                    console.error("Renderer: Data block is empty or malformed.");
                }
            } catch (e) {
                console.error("Renderer: Failed to decode compressed data.", e);
            }

            const label = new cc.LabelTTF("Lab Ready: Data Decoded", "Arial", 16);
            label.setPosition(cc.winSize.width / 2, 40);
            this.addChild(label);
        }
    });
    cc.director.runScene(new MathLabScene());
};

// --- PART 2: THE BOOTLOADER ---
async function initGame() {
    console.log("Boot: Home PC Init Started...");
    const bar = document.getElementById('bar');
    const loaderUI = document.getElementById('loader-ui');

    try {
        const res = await fetch('assets/project_data.xml');
        const xml = await res.text();
        console.log("Boot: XML Fetched (" + xml.length + " bytes)");
        
        if (bar) bar.style.width = '100%';

        let check = setInterval(() => {
            if (typeof cc !== 'undefined' && cc.game) {
                clearInterval(check);
                cc.game.onStart = function() {
                    cc.view.enableRetina(false);
                    cc.director.setContentScaleFactor(1.0);
                    cc.loader.register(["plist"], cc._txtLoader); 
                    
                    const assets = ["assets/GJ_GameSheet.plist", "assets/GJ_GameSheet.png"];
                    cc.loader.load(assets, function() {
                        assets.forEach(file => {
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
    } catch (e) { console.error("Boot Error:", e); }
}
initGame();
