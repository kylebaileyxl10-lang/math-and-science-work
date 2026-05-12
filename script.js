// --- V1.0.14: THE SPRITE MAPPER ---
console.log("Boot: Sprite Engine v1.0.14 Started...");

// 1. OBJECT ID MAPPING
// You can add more IDs here as you find them!
const ID_MAP = {
    "1": "gj_block_01.png", // Standard Block
    "8": "gj_spike_01.png", // Standard Spike
    "22": "gj_saw_01.png",  // Sawblade
    "default": "gj_block_01.png" 
};

window.loadLevelLibrary = function(xmlData) {
    const loaderUI = document.getElementById('loader-ui');
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            this.addChild(new cc.LayerColor(cc.color(10, 10, 15))); 
            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            // Load the spritesheet metadata (.plist)
            cc.spriteFrameCache.addSpriteFrames("assets/GJ_GameSheet.plist");

            try {
                const raw = xmlData.split("<k>k4</k><s>")[1].split("</s>")[0].trim();
                const decoded = window.decompressLevel(raw);
                const objects = decoded.split(';');

                // We're rendering the first 10,000 to keep it smooth
                objects.slice(0, 10000).forEach(objStr => {
                    const p = objStr.split(',');
                    
                    // Find the keys
                    const idIdx = p.indexOf('1'); // Key 1 = Object ID
                    const xIdx = p.indexOf('2');  // Key 2 = X
                    const yIdx = p.indexOf('3');  // Key 3 = Y

                    if (idIdx !== -1 && xIdx !== -1 && yIdx !== -1) {
                        const objID = p[idIdx + 1];
                        const spriteName = ID_MAP[objID] || ID_MAP["default"];
                        
                        // Create the actual sprite from the sheet
                        const sprite = new cc.Sprite("#" + spriteName);
                        
                        // Geometry Dash uses 30 units per block, so we scale down
                        sprite.setPosition(parseFloat(p[xIdx+1]) / 4, parseFloat(p[yIdx+1]) / 4);
                        sprite.setScale(0.5); 
                        
                        gameLayer.addChild(sprite);
                    }
                });

                if (loaderUI) loaderUI.style.display = 'none';
            } catch (e) { console.error("Sprite Render Error:", e); }

            const label = new cc.LabelTTF("Math Lab: Level Sprites Active", "Arial", 16);
            label.setPosition(cc.winSize.width / 2, 40);
            this.addChild(label);
        }
    });
    cc.director.runScene(new MathLabScene());
};

// ... (Keep your existing Pako Decompressor and Bootloader from v1.0.13) ...
