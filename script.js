// --- GDRWeb v1.0.18: ASSETS FOLDER FIX ---
console.log("System: Pointing to assets/project_data.xml...");

const ID_MAP = { "1": "gj_block_01.png", "8": "gj_spike_01.png", "default": "gj_block_01.png" };

function showError(msg) {
    const errDiv = document.getElementById('error-display');
    if (errDiv) {
        errDiv.innerText = msg;
        errDiv.style.display = 'block';
    }
}

window.loadLevelLibrary = function(xmlData) {
    if (!xmlData || xmlData.includes("<!DOCTYPE html>")) {
        showError("ERROR: Could not read file from assets folder.");
        return;
    }

    cc.game.onStart = function() {
        const scene = new cc.Scene();
        const layer = new cc.Layer();
        scene.addChild(layer);
        
        try {
            // Load the spritesheet from the same assets folder
            cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet.plist");

            const raw = xmlData.split("<k>k4</k><s>")[1].split("</s>")[0].trim();
            const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
            const data = pako.inflate(Uint8Array.from(bin, c => c.charCodeAt(0)), { to: 'string' });
            const objects = data.split(';');

            objects.slice(0, 5000).forEach(objStr => {
                const p = objStr.split(',');
                const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                if (id && x && y) {
                    const s = new cc.Sprite("#" + (ID_MAP[id] || ID_MAP["default"]));
                    s.setPosition(parseFloat(x)/4, parseFloat(y)/4);
                    s.setScale(0.4);
                    layer.addChild(s);
                }
            });

            document.getElementById('overlay').style.display = 'none';
        } catch (e) {
            showError("RENDER ERROR: Check if GJ_GameSheet.plist is in assets/");
        }
        cc.director.runScene(scene);
    };
    cc.game.run("gameCanvas");
};

// --- THE FIX: Pointing to the assets folder ---
fetch('assets/project_data.xml?v=' + Date.now())
    .then(r => {
        if (!r.ok) throw new Error();
        return r.text();
    })
    .then(window.loadLevelLibrary)
    .catch(() => showError("FETCH FAILED: assets/project_data.xml not found!"));
