// --- GDRWeb v1.0.15: SPRITE RENDERER ---
console.log("Boot: Sprite Engine v1.0.15 Active");

const ID_MAP = {
    "1": "gj_block_01.png", 
    "8": "gj_spike_01.png",
    "22": "gj_saw_01.png",
    "default": "gj_block_01.png"
};

// DECOMPRESSION LOGIC
window.decompressLevel = function(raw) {
    try {
        const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
        const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
        return pako.inflate(bytes, { to: 'string' });
    } catch (e) {
        console.error("Decompress Error:", e);
        return "";
    }
};

window.loadLevelLibrary = function(xmlData) {
    const loaderUI = document.getElementById('loader-ui');
    const pBar = document.getElementById('p-bar');

    cc.game.onStart = function() {
        const scene = new cc.Scene();
        scene.addChild(new cc.LayerColor(cc.color(5, 5, 10)));
        const gameLayer = new cc.Layer();
        scene.addChild(gameLayer);

        // Load your sheet from the assets folder
        cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet.plist");

        try {
            const raw = xmlData.split("<k>k4</k><s>")[1].split("</s>")[0].trim();
            const decoded = window.decompressLevel(raw);
            const objects = decoded.split(';');

            console.log("SUCCESS! Objects in Data: " + objects.length);

            // Limit to 8000 for performance
            objects.slice(0, 8000).forEach(objStr => {
                const p = objStr.split(',');
                const id = p[p.indexOf('1') + 1];
                const x = p[p.indexOf('2') + 1];
                const y = p[p.indexOf('3') + 1];

                if (id && x && y) {
                    const spriteName = ID_MAP[id] || ID_MAP["default"];
                    const sprite = new cc.Sprite("#" + spriteName);
                    sprite.setPosition(parseFloat(x) / 4, parseFloat(y) / 4);
                    sprite.setScale(0.4);
                    gameLayer.addChild(sprite);
                }
            });

            if (loaderUI) loaderUI.style.display = 'none';
        } catch (e) { console.error("Render Error:", e); }
        cc.director.runScene(scene);
    };
    cc.game.run("gameCanvas");
};

// FETCH DATA
fetch('project_data.xml?v=' + Date.now())
    .then(r => r.text())
    .then(window.loadLevelLibrary)
    .catch(err => console.error("Failed to fetch project_data.xml", err));
