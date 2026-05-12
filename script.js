// --- V1.0.9: DEEP SCAN & PAKO ENGINE ---
console.log("Boot: Home PC Init v1.0.9 Started...");

// 1. THE DECOMPRESSION ENGINE (Uses Pako)
window.decompressLevel = function(base64String) {
    try {
        // Geometry Dash uses URL-safe Base64; fix it before decoding
        const normalized = base64String.replace(/-/g, '+').replace(/_/g, '/');
        const binaryString = atob(normalized);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Use Pako to "inflate" the Gzip data
        const decompressed = pako.inflate(bytes, { to: 'string' });
        return decompressed;
    } catch (err) {
        console.error("Pako Decompression failed!", err);
        return "";
    }
};

// 2. THE RENDERER (Finds and draws the level)
window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Scanning XML for the largest project data...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            this.addChild(new cc.LayerColor(cc.color(10, 10, 15))); 
            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            try {
                // Split XML by the level data marker
                const k4Marker = "<k>k4</k><s>";
                const parts = xmlData.split(k4Marker);
                let bestData = "";

                // DEEP SCAN: Find the level with the most data (ignoring tiny test levels)
                for (let i = 1; i < parts.length; i++) {
                    const levelSegment = parts[i].split("</s>")[0].trim();
                    if (levelSegment.length > bestData.length) {
                        bestData = levelSegment;
                    }
                }

                if (bestData.length > 0) {
                    console.log("Renderer: Found Massive Level! (Raw Size: " + (bestData.length / 1024 / 1024).toFixed(2) + " MB)");
                    
                    const decodedData = window.decompressLevel(bestData);
                    const objects = decodedData.split(';');
                    console.log("Renderer: SUCCESS! Found " + objects.length + " objects.");

                    // Limit to 10k objects for performance stability
                    objects.slice(0, 10000).forEach(objStr => {
                        const p = objStr.split(',');
                        const x = parseFloat(p[p.indexOf('2') + 1]);
                        const y = parseFloat(p[p.indexOf('3') + 1]);
                        if (!isNaN(x) && !isNaN(y)) {
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            sprite.setPosition(x / 10, y / 10); 
                            sprite.setScale(0.1);
                            gameLayer.addChild(sprite);
                        }
                    });
                }
            } catch (e) { 
                console.error("Deep Scan Extraction Error", e); 
            }

            const label = new cc.LabelTTF("Math Lab: " + gameLayer.childrenCount + " Objects Rendered", "Arial", 16);
            label.setPosition(cc.winSize.width / 2, 40);
            this.addChild(label);
        }
    });
    cc.director.runScene(new MathLabScene());
};

// 3. THE BOOTLOADER (Fetches your 12.7MB file)
cc.game.onStart = function() {
    fetch('project_data.xml')
        .then(response => {
            console.log("Boot: XML Fetched (" + response.headers.get('content-length') + " bytes)");
            return response.text();
        })
        .then(data => {
            window.loadLevelLibrary(data);
        })
        .catch(err => console.error("Boot Error: Could not reach project_data.xml", err));
};

cc.game.run("gameCanvas");
