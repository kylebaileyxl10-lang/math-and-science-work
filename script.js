// --- PART 1: THE DEEP RENDERER ---
window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Starting Deep Scan...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            const winSize = cc.director.getWinSize();
            const bg = new cc.LayerColor(cc.color(10, 10, 15)); 
            this.addChild(bg);

            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            try {
                // 1. Find the start of the object string (kS38)
                const s38Index = xmlData.indexOf('kS38');
                if (s38Index !== -1) {
                    // Extract the text between <string> and </string> immediately after kS38
                    const startTag = xmlData.indexOf('>', s38Index) + 1;
                    const endTag = xmlData.indexOf('</string>', startTag);
                    const objectString = xmlData.substring(startTag, endTag);
                    
                    // 2. Split into individual blocks/spikes (separated by ;)
                    const objects = objectString.split(';');
                    console.log("Renderer: Found " + (objects.length - 1) + " total objects!");

                    // 3. Draw the first 200 objects to see if it works
                    let drawnCount = 0;
                    objects.slice(0, 200).forEach(objStr => {
                        if (!objStr) return;
                        const p = objStr.split(',');
                        
                        // Geometry Dash Object Props: 1=ID, 2=X, 3=Y (standard format)
                        // Note: Some levels use 1,2,3... others use 1,3,5...
                        const objID = p[1];
                        const x = parseFloat(p[3]); // Index 3 is typical for X
                        const y = parseFloat(p[5]); // Index 5 is typical for Y

                        if (objID && !isNaN(x) && !isNaN(y)) {
                            // Using a simple square for now to verify positions
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            sprite.setPosition(x, y);
                            sprite.setScale(0.5);
                            gameLayer.addChild(sprite);
                            drawnCount++;
                        }
                    });
                    console.log("Renderer: Successfully drew " + drawnCount + " test sprites.");
                    
                    // 4. Center the camera on the first few objects
                    if (objects[0]) {
                        const firstX = parseFloat(objects[0].split(',')[3]);
                        gameLayer.setPosition(-firstX + 100, 0);
                    }
                } else {
                    console.error("Renderer Error: kS38 key not found in XML!");
                }
            } catch (e) {
                console.error("Parser Crash:", e);
            }

            const label = new cc.LabelTTF("Math Lab: Objects Found", "Arial", 18);
            label.setPosition(winSize.width / 2, 30);
            this.addChild(label);
        }
    });

    cc.director.runScene(new MathLabScene());
};
