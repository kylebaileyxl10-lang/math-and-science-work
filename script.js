// --- PART 1: THE RECOVERY RENDERER ---
window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: EMERGENCY RECOVERY TRIGGERED");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            console.log("Renderer: Scene entered. Initializing layers...");
            this.addChild(new cc.LayerColor(cc.color(15, 15, 25))); 
            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            try {
                // Ignore XML keys and just find the massive block of numbers
                const textSegments = xmlData.split(/[<>]/);
                let levelString = "";
                for (let segment of textSegments) {
                    // Level data is the only segment likely to be over 5000 chars with commas and semicolons
                    if (segment.length > 5000 && segment.includes(',') && segment.includes(';')) {
                        levelString = segment;
                        break;
                    }
                }

                if (levelString.length > 0) {
                    const objects = levelString.split(';');
                    console.log("Renderer: SUCCESS! Found " + objects.length + " objects.");

                    objects.slice(0, 500).forEach(objStr => {
                        const p = objStr.split(',');
                        const xIndex = p.indexOf('2');
                        const yIndex = p.indexOf('3');
                        
                        if (xIndex !== -1 && yIndex !== -1) {
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            sprite.setPosition(parseFloat(p[xIndex+1]) / 5, parseFloat(p[yIndex+1]) / 5);
                            sprite.setScale(0.15);
                            gameLayer.addChild(sprite);
                        }
                    });
                } else {
                    console.error("Renderer: Failed to find level string in data segment.");
                }
            } catch (e) {
                console.error("Renderer: CRASH during object generation", e);
            }

            const label = new cc.LabelTTF("Lab Active: " + gameLayer.childrenCount + " Objects", "Arial", 16);
            label.setPosition(cc.winSize.width / 2, 40);
            this.addChild(label);
        }
    });
    cc.director.runScene(new MathLabScene());
};

// --- PART 2: THE BOOTLOADER ---
async function initGame() {
    console.log("Boot: Process Started...");
    const bar = document.getElementById('bar');
    const status = document.getElementById('status');
    const loaderUI = document.getElementById('loader-ui');

    try {
        if (status) status.innerHTML = "Forcing Data Sync...";
        const res = await fetch('assets/project_data.xml');
        const xml = await res.text();
        console.log("Boot: Data Sync Complete (" + xml.length + " bytes)");
        
        if (bar) bar.style.width = '100%';

        let check = setInterval(() => {
            if (typeof cc !== 'undefined' && cc.game) {
                clearInterval(check);
                console.log("Boot: Engine Verified.");

                cc.game.onStart = function() {
                    console.log("Boot: Engine starting render phase...");
                    cc.view.enableRetina(false);
                    cc.director.setContentScaleFactor(1.0);
                    cc.loader.register(["plist"], cc._txtLoader); 
                    
                    const resources = [
                        "assets/GJ_GameSheet.plist", "assets/GJ_GameSheet.png",
                        "assets/GJ_GameSheet02.plist", "assets/GJ_GameSheet02.png"
                    ];
                    
                    cc.loader.load(resources, function() {
                        console.log("Boot: All textures confirmed.");
                        resources.forEach(file => {
                            if (file.endsWith(".plist")) {
                                cc.spriteFrameCache.addSpriteFrames(file, file.replace(".plist", ".png"));
                            }
                        });
                        window.loadLevelLibrary(xml);
                        if (loaderUI) loaderUI.style.display = 'none';
                    });
                };

                if (!cc.game._prepared) {
                    cc.game.run({"project_type": "javascript", "id": "gameCanvas", "renderMode": 1}); 
                }
            }
        }, 500);
    } catch (e) {
        console.error("Boot: FATAL SYNC ERROR", e);
    }
}
initGame();
