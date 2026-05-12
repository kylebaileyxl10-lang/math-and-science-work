// --- GDRWeb v1.0.21: FULL LEVEL RENDER ---
console.log("System: v1.0.21 - Rendering Full Level...");

const ID_MAP = {
    "1": "assets/GJ_square01.png", // Block
    "2": "assets/GJ_square02.png", // Block 2
    "8": "assets/GJ_button_01.png", // Placeholder Spike
    "default": "assets/GJ_square01.png"
};

window.loadLevelLibrary = function(xmlData) {
    cc.game.onStart = function() {
        const scene = new cc.Scene();
        const layer = new cc.Layer();
        scene.addChild(layer);

        try {
            // 1. DEEP SCAN for the biggest level
            const parts = xmlData.split("<k>k4</k><s>");
            let bestRaw = "";
            for (let i = 1; i < parts.length; i++) {
                const segment = parts[i].split("</s>")[0].trim();
                if (segment.length > bestRaw.length) bestRaw = segment;
            }

            const bin = atob(bestRaw.replace(/-/g, '+').replace(/_/g, '/'));
            const data = pako.inflate(Uint8Array.from(bin, c => c.charCodeAt(0)), { to: 'string' });
            const objects = data.split(';');

            console.log("Renderer: SUCCESS! Found " + objects.length + " objects.");

            // 2. RENDER with 10k limit for stability
            objects.slice(0, 10000).forEach(objStr => {
                const p = objStr.split(',');
                const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];

                if (id && x && y) {
                    const sprite = new cc.Sprite(ID_MAP[id] || ID_MAP["default"]);
                    
                    // SCALE & POSITION
                    // GD units are large, so we divide by 4. 
                    // We subtract 500 from Y to bring the level down into view.
                    sprite.setPosition(parseFloat(x) / 4, (parseFloat(y) / 4) - 200);
                    sprite.setScale(0.3);
                    layer.addChild(sprite);
                }
            });

            document.getElementById('loader-ui').style.display = 'none';
        } catch (e) { console.error("Final Render Error:", e); }
        
        cc.director.runScene(scene);
    };
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml?v=' + Date.now())
    .then(r => r.text())
    .then(window.loadLevelLibrary);
