async function initGame() {
    const loaderUI = document.getElementById('loader-ui');

    try {
        console.log("Fetching project_data.xml...");
        const res = await fetch('assets/project_data.xml');
        const xml = await res.text();
        
        console.log("Level Data Syncing... (Size: " + xml.length + ")");

        let check = setInterval(() => {
            if (typeof cc !== 'undefined' && cc.game) {
                clearInterval(check);

                cc.game.onStart = function() {
                    // Force SD for iPad Mini 4
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
                        // 1. Unpack all sheets into memory
                        resources.forEach(file => {
                            if (file.endsWith(".plist")) {
                                const texturePath = file.replace(".plist", ".png");
                                cc.spriteFrameCache.addSpriteFrames(file, texturePath);
                            }
                        });

                        // 2. Start the Level Renderer
                        if (window.loadLevelLibrary) {
                            console.log("Renderer found. Booting Math Lab level...");
                            loadLevelLibrary(xml);
                        } else {
                            console.error("Renderer function (loadLevelLibrary) not found!");
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
        console.error("Boot Error:", e);
    }
}
initGame();
