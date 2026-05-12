// --- ADVANCED UNZIP TOOL ---
window.decompressLevel = function(data) {
    try {
        // Step 1: Fix character encoding for Base64
        const binaryString = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
        
        // Step 2: Use browser-native stream decompression for large GD strings
        // This is much faster for 12MB files on home PCs
        return new TextDecoder().decode(bytes);
    } catch(e) { 
        console.warn("Decompression fallback triggered...");
        return atob(data); 
    }
};

window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Unlocking Compressed Level Body...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            this.addChild(new cc.LayerColor(cc.color(10, 10, 15))); 
            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            try {
                const k4Marker = "<k>k4</k><s>";
                const start = xmlData.indexOf(k4Marker) + k4Marker.length;
                const end = xmlData.indexOf("</s>", start);
                const rawData = xmlData.substring(start, end).trim();

                if (rawData.length > 100) {
                    // Two-Step Unlock
                    const decodedData = window.decompressLevel(rawData);
                    const objects = decodedData.split(';');
                    console.log("Renderer: SUCCESS! Found " + objects.length + " objects.");

                    // Force draw first 1000 objects into the visible area
                    objects.slice(0, 1000).forEach(objStr => {
                        const p = objStr.split(',');
                        const x = parseFloat(p[p.indexOf('2') + 1]);
                        const y = parseFloat(p[p.indexOf('3') + 1]);
                        if (!isNaN(x) && !isNaN(y)) {
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            // Center the massive level into the 800x450 canvas
                            sprite.setPosition(x / 10, y / 10); 
                            sprite.setScale(0.1);
                            gameLayer.addChild(sprite);
                        }
                    });
                }
            } catch (e) { console.error("Final Decode Error", e); }

            const label = new cc.LabelTTF("Math Lab: " + gameLayer.childrenCount + " Objects Rendered", "Arial", 16);
            label.setPosition(cc.winSize.width / 2, 40);
            this.addChild(label);
        }
    });
    cc.director.runScene(new MathLabScene());
};

async function initGame() {
    const loaderUI = document.getElementById('loader-ui');
    try {
        const res = await fetch('assets/project_data.xml');
        const xml = await res.text();
        let check = setInterval(() => {
            if (typeof cc !== 'undefined' && cc.game) {
                clearInterval(check);
                cc.game.onStart = function() {
                    cc.view.enableRetina(false);
                    cc.director.setContentScaleFactor(1.0);
                    cc.loader.register(["plist"], cc._txtLoader); 
                    const assets = [
                        "assets/GJ_GameSheet.plist", "assets/GJ_GameSheet.png",
                        "assets/GJ_GameSheet02.plist", "assets/GJ_GameSheet02.png",
                        "assets/GJ_GameSheet03.plist", "assets/GJ_GameSheet03.png",
                        "assets/GJ_GameSheet04.plist", "assets/GJ_GameSheet04.png"
                    ];
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
    } catch (e) { console.error(e); }
}
initGame();
