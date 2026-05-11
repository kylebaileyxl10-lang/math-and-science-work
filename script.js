window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer Started. Parsing Math Lab Data...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            const winSize = cc.director.getWinSize();
            
            // 1. Background
            const bg = new cc.LayerColor(cc.color(10, 10, 25)); 
            this.addChild(bg);

            // 2. The Math Lab Layer (Where objects go)
            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            // 3. MINI-PARSER: Let's try to find some objects in that 12MB file
            try {
                // Geometry Dash levels usually store objects in a string after 'kS38'
                const objectDataRaw = xmlData.split('kS38')[1]?.split('</string>')[0]?.split('>');
                const objectString = objectDataRaw ? objectDataRaw[objectDataRaw.length - 1] : "";

                if (objectString) {
                    const objects = objectString.split(';');
                    console.log("Found " + objects.length + " objects in Math Lab.");

                    // Let's draw the first 100 objects as a test
                    objects.slice(0, 100).forEach(objStr => {
                        const props = objStr.split(',');
                        const objID = props[1]; // Typically the 2nd value is the Item ID
                        const x = parseFloat(props[3]);
                        const y = parseFloat(props[5]);

                        if (objID && x && y) {
                            // Try to create a sprite from your sheets
                            // We'll use a basic block if we aren't sure of the ID yet
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            sprite.setPosition(x, y);
                            sprite.setScale(0.5);
                            gameLayer.addChild(sprite);
                        }
                    });
                }
            } catch (e) {
                console.warn("Object Parser Error (Non-Critical):", e);
            }

            const label = new cc.LabelTTF("Math Lab Active", "Arial", 20);
            label.setPosition(winSize.width / 2, 40);
            this.addChild(label);
        }
    });

    cc.director.runScene(new MathLabScene());
};
