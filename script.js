// --- PART 1: THE DEEP RENDERER (DATA GRABBER) ---
window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Starting Universal Data Grab...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            const winSize = cc.director.getWinSize();
            this.addChild(new cc.LayerColor(cc.color(10, 10, 15))); 

            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            try {
                // 1. Hunt for the data chunk between kS38 and the next key
                let rawChunk = "";
                if (xmlData.includes('kS38')) {
                    rawChunk = xmlData.split('kS38')[1].split('</string>')[0];
                    // Remove any remaining XML tags or noise
                    rawChunk = rawChunk.substring(rawChunk.indexOf('>') + 1);
                }

                if (rawChunk.length > 10) {
                    // 2. Split by semicolon (Geometry Dash object separator)
                    const objects = rawChunk.split(';');
                    console.log("Renderer: SUCCESS! Found " + objects.length + " data points.");

                    // 3. Draw a testing grid of your objects
                    let count = 0;
                    for (let i = 0; i < Math.min(objects.length, 500); i++) {
                        const p = objects[i].split(',');
                        // Most GD objects use 1:ID, 2:X, 3:Y
                        const x = parseFloat(p[p.indexOf('2') + 1]);
                        const y = parseFloat(p[p.indexOf('3') + 1]);

                        if (!isNaN(x) && !isNaN(y)) {
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            sprite.setPosition(x / 5, y / 5); // Scale down so they fit
                            sprite.setScale(0.2);
                            gameLayer.addChild(sprite);
                            count++;
                        }
                    }
                    console.log("Renderer: Sprites on screen: " + count);
                } else {
                    console.error("Renderer: Chunk too small. Data might be encrypted.");
                }
            } catch (e) {
                console.error("Parser Crash:", e);
            }

            const label = new cc.LabelTTF("Math Lab: " + (rawChunk.length > 0 ? "Data Loaded" : "No Data"), "Arial", 18);
            label.setPosition(winSize.width / 2, 30);
            this.addChild(label);
        }
    });

    cc.director.runScene(new MathLabScene());
};
