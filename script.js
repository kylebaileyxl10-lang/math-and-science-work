// --- GDRWeb v1.0.20: INDIVIDUAL ASSET ENGINE ---
console.log("System: v1.0.20 - Loading Individual Assets...");

// We use the exact names from your folder!
const ID_MAP = {
    "1": "assets/GJ_square01.png", // The basic block I saw in your folder
    "8": "assets/GJ_button_01.png", // Placeholder for spike
    "default": "assets/GJ_square01.png"
};

window.loadLevelLibrary = function(xmlData) {
    cc.game.onStart = function() {
        const scene = new cc.Scene();
        const layer = new cc.Layer();
        scene.addChild(layer);
        
        try {
            const raw = xmlData.split("<k>k4</k><s>")[1].split("</s>")[0].trim();
            const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
            const data = pako.inflate(Uint8Array.from(bin, c => c.charCodeAt(0)), { to: 'string' });
            const objects = data.split(';');

            console.log("Found: " + objects.length + " objects.");

            // Draw first 5000 objects
            objects.slice(0, 5000).forEach(objStr => {
                const p = objStr.split(',');
                const id = p[p.indexOf('1') + 1];
                const x = p[p.indexOf('2') + 1];
                const y = p[p.indexOf('3') + 1];

                if (id && x && y) {
                    const imgPath = ID_MAP[id] || ID_MAP["default"];
                    const sprite = new cc.Sprite(imgPath);
                    
                    // Center the camera slightly
                    sprite.setPosition(parseFloat(x) / 5, parseFloat(y) / 5);
                    sprite.setScale(0.3);
                    layer.addChild(sprite);
                }
            });

            document.getElementById('loader-ui').style.display = 'none';
        } catch (e) {
            console.error("Render Error:", e);
        }
        cc.director.runScene(scene);
    };
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml?v=' + Date.now())
    .then(r => r.text())
    .then(window.loadLevelLibrary);
