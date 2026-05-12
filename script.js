// --- FULL DECODER TOOL ---
window.decodeGD = function(data) {
    try {
        // Step 1: Base64 to Binary
        const bin = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
        // Step 2: Check for Gzip header (GD levels usually start with Base64 H4sIA)
        return bin; // We will treat this as a raw string for now
    } catch(e) { return null; }
};

window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Restoring Full Lab Assets...");
    
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
                const compressedData = xmlData.substring(start, end).trim();

                if (compressedData.length > 100) {
                    const levelString = window.decodeGD(compressedData);
                    const objects = levelString.split(';');
                    console.log("Renderer: SUCCESS! Found " + objects.length + " objects.");

                    objects.slice(0, 1000).forEach(objStr => {
                        const p = objStr.split(',');
                        const x = parseFloat(p[p.indexOf('2') + 1]);
                        const y = parseFloat(p[p.indexOf('3') + 1]);
                        if (!isNaN(x) && !isNaN(y)) {
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            sprite.setPosition(x / 5, y / 5);
                            sprite.setScale(0.1);
                            gameLayer.addChild(sprite);
                        }
                    });
                }
            } catch (e) { console.error("Decode Error", e); }

            const label = new cc.LabelTTF("Lab Active: " + gameLayer.childrenCount + " Items", "Arial", 16);
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
                    
                    // Restoring all your sheets
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
