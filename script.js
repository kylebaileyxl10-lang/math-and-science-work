// --- GDRWeb v1.0.19: SPRITESHEET DIAGNOSTIC ---
console.log("System: v1.0.19 - Starting Sprite Engine...");

const ID_MAP = { "1": "gj_block_01.png", "8": "gj_spike_01.png", "default": "gj_block_01.png" };

function showError(msg) {
    const errDiv = document.getElementById('error-display');
    if (errDiv) { errDiv.innerText = msg; errDiv.style.display = 'block'; }
}

window.loadLevelLibrary = function(xmlData) {
    cc.game.onStart = function() {
        const scene = new cc.Scene();
        const layer = new cc.Layer();
        scene.addChild(layer);
        
        // --- 1. PROPER ASSET LOADING ---
        const plist = "assets/GJ_GameSheet.plist";
        const png = "assets/GJ_GameSheet.png";

        cc.loader.load([plist, png], function() {
            try {
                cc.spriteFrameCache.addSpriteFrames(plist);
                
                // 2. DEBUG: LIST NAMES
                const frames = cc.spriteFrameCache._spriteFrames;
                console.log("Found " + Object.keys(frames).length + " sprites in plist.");
                console.log("First 5 names:", Object.keys(frames).slice(0, 5));

                const raw = xmlData.split("<k>k4</k><s>")[1].split("</s>")[0].trim();
                const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
                const data = pako.inflate(Uint8Array.from(bin, c => c.charCodeAt(0)), { to: 'string' });
                const objects = data.split(';');

                objects.slice(0, 5000).forEach(objStr => {
                    const p = objStr.split(',');
                    const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                    
                    if (id && x && y) {
                        const frameName = ID_MAP[id] || ID_MAP["default"];
                        // Only add if frame exists
                        if (cc.spriteFrameCache.getSpriteFrame(frameName)) {
                            const s = new cc.Sprite("#" + frameName);
                            s.setPosition(parseFloat(x)/4, parseFloat(y)/4);
                            s.setScale(0.4);
                            layer.addChild(s);
                        }
                    }
                });

                document.getElementById('overlay').style.display = 'none';
            } catch (e) {
                showError("RENDER ERROR: " + e);
            }
        });
        cc.director.runScene(scene);
    };
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml?v=' + Date.now())
    .then(r => r.text())
    .then(window.loadLevelLibrary)
    .catch(() => showError("FETCH FAILED: Check assets folder."));
