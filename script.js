window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Emergency Data Recovery Started...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            this.addChild(new cc.LayerColor(cc.color(10, 10, 20))); 
            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            try {
                // 1. LAZY SEARCH: Just grab the biggest block of text in the file
                // This bypasses XML parsing errors entirely.
                const rawParts = xmlData.split(/[<>]/);
                let levelString = "";
                for (let part of rawParts) {
                    if (part.includes(',') && part.includes(';')) {
                        levelString = part;
                        break;
                    }
                }

                if (levelString.length > 100) {
                    const objects = levelString.split(';');
                    console.log("Renderer: SUCCESS! Recovered " + objects.length + " objects.");

                    // 2. FORCE DRAW: Place everything in a visible grid
                    objects.slice(0, 300).forEach((objStr, index) => {
                        const p = objStr.split(',');
                        // Attempt to find X/Y by checking every even index
                        let x = parseFloat(p[p.indexOf('2') + 1]);
                        let y = parseFloat(p[p.indexOf('3') + 1]);

                        if (!isNaN(x) && !isNaN(y)) {
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            sprite.setPosition(x / 4, y / 4); // Scale down for visibility
                            sprite.setScale(0.2);
                            gameLayer.addChild(sprite);
                        }
                    });
                } else {
                    console.error("Renderer: Could not find object string. Is the level empty?");
                }
            } catch (e) {
                console.error("Renderer Crash:", e);
            }

            const label = new cc.LabelTTF("Lab Status: " + (gameLayer.childrenCount > 0 ? "Rendering" : "Empty"), "Arial", 16);
            label.setPosition(cc.winSize.width / 2, 30);
            this.addChild(label);
        }
    });
    cc.director.runScene(new MathLabScene());
};
