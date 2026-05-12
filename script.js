// --- GDRWeb v1.0.16: STABLE RENDERER ---
console.log("System: Starting Engine v1.0.16...");

const ID_MAP = { "1": "gj_block_01.png", "8": "gj_spike_01.png", "default": "gj_block_01.png" };

window.decompressLevel = function(raw) {
    try {
        const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
        return pako.inflate(Uint8Array.from(bin, c => c.charCodeAt(0)), { to: 'string' });
    } catch (e) { return null; }
};

window.loadLevelLibrary = function(xmlData) {
    const status = document.getElementById('status-text');
    const pBar = document.getElementById('p-bar');

    // FIX: Stop the crash if the file is missing (404)
    if (!xmlData || typeof xmlData !== 'string' || xmlData.includes("404")) {
        if (status) status.innerHTML = "<span style='color:red'>Error: project_data.xml NOT FOUND</span>";
        console.error("Critical: Level data file is missing on GitHub.");
        return;
    }

    cc.game.onStart = function() {
        const scene = new cc.Scene();
        const layer = new cc.Layer();
        scene.addChild(layer);
        cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet.plist");

        try {
            if (pBar) pBar.style.width = "100%";
            const parts = xmlData.split("<k>k4</k><s>");
            if (parts.length < 2) throw "Invalid XML Format";
            
            const raw = parts[1].split("</s>")[0].trim();
            const decoded = window.decompressLevel(raw);
            const objects = decoded ? decoded.split(';') : [];

            console.log("Renderer: Drawing " + Math.min(objects.length, 5000) + " objects.");

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
            document.getElementById('loader-ui').style.display = 'none';
        } catch (e) {
            if (status) status.innerText = "Parse Error: " + e;
        }
        cc.director.runScene(scene);
    };
    cc.game.run("gameCanvas");
};

// Start Fetch
fetch('project_data.xml?v=' + Date.now())
    .then(r => r.text())
    .then(window.loadLevelLibrary)
    .catch(e => console.error("Fetch failed", e));
