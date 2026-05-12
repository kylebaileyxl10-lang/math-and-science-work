// --- V1.0.9: DEEP SCAN EXTRACTION ---
window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Scanning XML for the largest level...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            this.addChild(new cc.LayerColor(cc.color(10, 10, 15))); 
            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            try {
                // Find ALL level strings in the file
                const k4Marker = "<k>k4</k><s>";
                const parts = xmlData.split(k4Marker);
                let bestData = "";

                // Loop through every level found and keep the biggest one
                for (let i = 1; i < parts.length; i++) {
                    const levelSegment = parts[i].split("</s>")[0].trim();
                    if (levelSegment.length > bestData.length) {
                        bestData = levelSegment;
                    }
                }

                if (bestData.length > 0) {
                    console.log("Renderer: Found Largest Level! (Raw Size: " + (bestData.length / 1024 / 1024).toFixed(2) + " MB)");
                    
                    const decodedData = window.decompressLevel(bestData);
                    const objects = decodedData.split(';');
                    console.log("Renderer: SUCCESS! Found " + objects.length + " objects.");

                    // Draw the level
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
                } else {
                    console.error("Renderer: No level data found in XML!");
                }
            } catch (e) { 
                console.error("Deep Scan Error", e); 
            }

            const label = new cc.LabelTTF("Math Lab: " + gameLayer.childrenCount + " Objects Rendered", "Arial", 16);
            label.setPosition(cc.winSize.width / 2, 40);
            this.addChild(label);
        }
    });
    cc.director.runScene(new MathLabScene());
};
