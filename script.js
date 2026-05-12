window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Unlocking 9999+ objects...");
    const loaderUI = document.getElementById('loader-ui'); // Target the loading screen
    
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
                for (let i = 1; i < parts.length; i++) {
                    const levelSegment = parts[i].split("</s>")[0].trim();
                    if (levelSegment.length > bestData.length) { bestData = levelSegment; }
                }

                if (bestData.length > 0) {
                    const decodedData = window.decompressLevel(bestData);
                    const objects = decodedData.split(';');
                    
                    // Render the objects
                    objects.slice(0, 10000).forEach(objStr => {
                        const p = objStr.split(',');
                        const xIdx = p.indexOf('2'), yIdx = p.indexOf('3');
                        if (xIdx !== -1 && yIdx !== -1) {
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            sprite.setPosition(parseFloat(p[xIdx+1]) / 10, parseFloat(p[yIdx+1]) / 10);
                            sprite.setScale(0.1);
                            gameLayer.addChild(sprite);
                        }
                    });
                    
                    // --- THE FIX: Hide the loading screen now that objects are drawn ---
                    if (loaderUI) {
                        loaderUI.style.opacity = '0';
                        setTimeout(() => { loaderUI.style.display = 'none'; }, 500);
                    }
                }
            } catch (e) { console.error(e); }

            const label = new cc.LabelTTF("Math Lab: " + gameLayer.childrenCount + " Objects", "Arial", 16);
            label.setPosition(cc.winSize.width / 2, 40);
            this.addChild(label);
        }
    });
    cc.director.runScene(new MathLabScene());
};
