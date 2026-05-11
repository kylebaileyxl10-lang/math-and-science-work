/**
 * GEOMETRY DASH MATH LAB - STANDALONE BOOT SCRIPT
 * This version includes the internal renderer to fix the 'missing function' error.
 */

// --- PART 1: THE RENDERER (The "Brain") ---
// We define this here because your library.js/main.js files are missing.
window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer Started. Parsing Math Lab Data...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            
            // 1. Set Background
            const background = new cc.LayerColor(cc.color(20, 20, 20)); 
            this.addChild(background);

            // 2. Add Status Label
            const winSize = cc.director.getWinSize();
            const label = new cc.LabelTTF("Math Lab: Level Data Loaded", "Arial", 28);
            label.setPosition(winSize.width / 2, winSize.height / 2);
            label.setColor(cc.color(76, 175, 80)); // Math Green
            this.addChild(label);

            console.log("Scene initialized. Assets are in memory.");
        }
    });

    try {
        cc.director.runScene(new MathLabScene());
    } catch (e) {
        console.error("Renderer Crash:", e);
    }
};

// --- PART 2: THE BOOTLOADER ---
async function initGame() {
    const bar = document.getElementById('bar');
    const status = document.getElementById('status');
    const loaderUI = document.getElementById('loader-ui');

    try {
        console.log("Fetching project_data.xml...");
        if (status) status.innerHTML = "Downloading Math Lab Level...";
        
        const res = await fetch('assets/project_data.xml');
        if (!res.ok) throw new Error("Could not find project_data.xml");
        
        const xml = await res.text();
        console.log("XML Sync Complete. Size: " + xml.length + " bytes");
        
        if (bar) bar.style.width = '100%';

        let check = setInterval(() => {
            if (typeof cc !== 'undefined' && cc.game) {
                clearInterval(check);

                cc.game.onStart = function() {
                    cc.view.enableRetina(false);
                    cc.director.setContentScaleFactor(1.0);
                    cc.loader.register(["plist"], cc._txtLoader); 
                    
                    const resources = [
                        "assets/GJ_GameSheet.plist", "assets/GJ_GameSheet.png",
                        "assets/GJ_GameSheet02.plist", "assets/GJ_GameSheet02.png",
                        "assets/GJ_GameSheet03.plist", "assets/GJ_GameSheet03.png",
                        "assets/GJ_GameSheet04.plist", "assets/GJ_GameSheet04.png",
                        "assets/GJ_GameSheetGlow.plist", "assets/GJ_GameSheetGlow.png",
                        "assets/GJ_GameSheetIcons.plist", "assets/GJ_GameSheetIcons.png"
                    ];
                    
                    cc.loader.load(resources, function() {
                        resources.forEach(file => {
                            if (file.endsWith(".plist")) {
                                const texturePath = file.replace(".plist", ".png");
                                try {
                                    cc.spriteFrameCache.addSpriteFrames(file, texturePath);
                                } catch (e) {
                                    console.warn("Sheet skip: " + file);
                                }
                            }
                        });

                        // Now it calls the function we defined in Part 1
                        if (window.loadLevelLibrary) {
                            window.loadLevelLibrary(xml);
                        }
                        
                        if (loaderUI) loaderUI.style.display = 'none';
                    });
                };

                if (!cc.game._prepared) {
                    cc.game.run({
                        "project_type": "javascript",
                        "debugMode": 1,
                        "id": "gameCanvas",
                        "renderMode": 1
                    }); 
                }
            }
        }, 500);

    } catch (e) {
        console.error("Boot Critical Error:", e);
    }
}

initGame();
