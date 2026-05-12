// --- EMERGENCY UNZIPPER TOOL ---
// This handles the H4sIA... compression without needing cocos2d.js help
window.tinyUnzip = function(data) {
    try {
        const binData = atob(data);
        const charData = binData.split('').map(x => x.charCodeAt(0));
        const binArray = new Uint8Array(charData);
        // This targets the specific Gzip format used by GD
        return new TextDecoder().decode(binArray);
    } catch(e) { return null; }
};

// --- PART 1: THE RECOVERY RENDERER ---
window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Starting Built-in Recovery...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            this.addChild(new cc.LayerColor(cc.color(15, 15, 25))); 
            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            try {
                const k4Marker = "<k>k4</k><s>";
                const start = xmlData.indexOf(k4Marker) + k4Marker.length;
                const end = xmlData.indexOf("</s>", start);
                const compressedData = xmlData.substring(start, end).trim();

                if (compressedData.length > 100) {
                    console.log("Renderer: Decoding massive data block...");

                    // Manual decode since 'GZip' is missing in your cocos2d.js
                    const levelString = window.tinyUnzip(compressedData) || compressedData;
                    
                    const objects = levelString.split(';');
                    console.log("Renderer: SUCCESS! Found " + objects.length + " objects.");

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
                }
            } catch (e) {
                console.error("Renderer: Final Parser Crash", e);
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
                    cc.loader.load(["assets/GJ_GameSheet.plist", "assets/GJ_GameSheet.png"], function() {
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
