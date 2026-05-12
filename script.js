// --- V1.0.9: DEEP SCAN & PAKO ENGINE ---
console.log("Boot: Home PC Init v1.0.9 Started...");

// 1. THE DECOMPRESSION ENGINE (Uses Pako)
window.decompressLevel = function(base64String) {
    try {
        // Fix URL-safe Base64 and decode
        const normalized = base64String.replace(/-/g, '+').replace(/_/g, '/');
        const binaryString = atob(normalized);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Use Pako to "inflate" the Gzip data (Fixes the GZip TypeError)
        const decompressed = pako.inflate(bytes, { to: 'string' });
        return decompressed;
    } catch (err) {
        console.error("Renderer: Failed to decode compressed data.", err);
        return "";
    }
};

// 2. THE RENDERER
window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Scanning XML for the largest project data...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            this.addChild(new cc.LayerColor(cc.color(10, 10, 15))); 
            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            try {
                const k4Marker = "<k>k4</k><s>";
                const parts = xmlData.split(k4Marker);
                let bestData = "";

                // DEEP SCAN: Find the actual level (ignoring tiny test files)
                for (let i = 1; i < parts.length; i++) {
                    const levelSegment = parts[i].split("</s>")[0].trim();
                    if (levelSegment.length > bestData.length) {
                        bestData = levelSegment;
                    }
                }

                if (bestData.length > 0) {
                    console.log("Renderer: Found Massive Level! (" + (bestData.length / 1024 / 1024).toFixed(2) + " MB)");
                    
                    const decodedData = window.decompressLevel(bestData);
                    const objects = decodedData.split(';');
                    console.log("Renderer: SUCCESS! Found " + objects.length + " objects.");

                    // Render first 10,000 objects for performance
                    objects.slice(0, 10000).forEach(objStr => {
                        const p = objStr.split(',');
                        const xIndex = p.indexOf('2');
                        const yIndex = p.indexOf('3');
                        if (xIndex !== -1 && yIndex !== -1) {
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            sprite.setPosition(parseFloat(p[xIndex + 1]) / 10, parseFloat(p[yIndex + 1]) / 10); 
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

// 3. THE BOOTLOADER
cc.game.onStart = function() {
    fetch('project_data.xml')
        .then(response => {
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return response.text();
        })
        .then(data => {
            console.log("Boot: XML Fetched (" + data.length + " bytes)");
            window.loadLevelLibrary(data);
        })
        .catch(err => {
            console.error("Boot Error: Cannot find project_data.xml. Check your file name!", err);
        });
};

cc.game.run("gameCanvas");
