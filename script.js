// --- GDRWeb v1.0.17: SELF-DIAGNOSTIC EDITION ---
console.log("Engine: v1.0.17 Booting...");

const ID_MAP = { "1": "gj_block_01.png", "8": "gj_spike_01.png", "default": "gj_block_01.png" };

function showError(msg) {
    const errDiv = document.getElementById('error-display');
    const status = document.getElementById('status');
    if (errDiv) {
        errDiv.innerText = msg;
        errDiv.style.display = 'block';
    }
    if (status) status.style.display = 'none';
}

window.loadLevelLibrary = function(xmlData) {
    // 1. DATA VALIDATION
    if (!xmlData || xmlData.includes("<!DOCTYPE html>") || xmlData.length < 100) {
        showError("CRITICAL ERROR: project_data.xml is missing or empty on GitHub.");
        return;
    }

    cc.game.onStart = function() {
        const scene = new cc.Scene();
        const layer = new cc.Layer();
        scene.addChild(layer);
        
        try {
            // Load Spritesheet
            cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet.plist");

            // 2. PARSING
            const parts = xmlData.split("<k>k4</k><s>");
            if (parts.length < 2) throw "XML does not contain level data (<k>k4</k>)";

            const raw = parts[1].split("</s>")[0].trim();
            const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
            const data = pako.inflate(Uint8Array.from(bin, c => c.charCodeAt(0)), { to: 'string' });
            const objects = data.split(';');

            console.log("Renderer: Parsing " + objects.length + " objects...");

            // Render first 5k for stability
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
            showError("RENDER ERROR: " + e);
            console.error(e);
        }
        cc.director.runScene(scene);
    };
    cc.game.run("gameCanvas");
};

// 3. SECURE FETCH
fetch('project_data.xml?v=' + Date.now())
    .then(r => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
    })
    .then(window.loadLevelLibrary)
    .catch(e => {
        showError("FETCH FAILED: Cannot find project_data.xml in your GitHub repo.");
    });
