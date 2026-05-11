async function initGame() {
    const bar = document.getElementById('bar');
    const status = document.getElementById('status');
    const loaderUI = document.getElementById('loader-ui');

    try {
        status.innerHTML = "Fetching Lab Data...";
        const res = await fetch('assets/project_data.xml');
        const xml = await res.text();
        
        let check = setInterval(() => {
            if (typeof cc !== 'undefined' && cc.game) {
                clearInterval(check);

                cc.game.onStart = function() {
                    console.log("Renderer Ready. Loading Sprite Maps...");
                    
                    cc.view.enableRetina(false);
                    cc.director.setContentScaleFactor(1.0);

                    // Sync the JSON-content plists
                    cc.loader.register(["plist"], cc._txtLoader); 
                    
                    // ALL resources found in your assets folder
                    const resources = [
                        "assets/GJ_GameSheet.plist", "assets/GJ_GameSheet.png",
                        "assets/GJ_GameSheet02.plist", "assets/GJ_GameSheet02.png",
                        "assets/GJ_GameSheet03.plist", "assets/GJ_GameSheet03.png",
                        "assets/GJ_GameSheet04.plist", "assets/GJ_GameSheet04.png",
                        "assets/GJ_GameSheetGlow.plist", "assets/GJ_GameSheetGlow.png",
                        "assets/GJ_GameSheetIcons.plist", "assets/GJ_GameSheetIcons.png",
                        "assets/GJ_GameSheetEditor.plist", "assets/GJ_GameSheetEditor.png"
                    ];
                    
                    cc.loader.load(resources, function() {
                        console.log("Assets Downloaded. Injecting into Memory...");

                        // INJECTION LOOP: This is the fix for the black screen
                        resources.forEach(file => {
                            if (file.endsWith(".plist")) {
                                const texturePath = file.replace(".plist", ".png");
                                cc.spriteFrameCache.addSpriteFrames(file, texturePath);
                                console.log("Memory Synced: " + file);
                            }
                        });

                        console.log("Math Lab Booting...");
                        if (window.loadLevelLibrary) loadLevelLibrary(xml);
                        if (loaderUI) loaderUI.style.display = 'none';
                    });
                };

                // The Fix: Manual boot to prevent the 'init' crash
                if (!cc.game._prepared) {
                    const config = {
                        "project_type": "javascript",
                        "debugMode": 1,
                        "id": "gameCanvas",
                        "renderMode": 1
                    };
                    cc.game.run(config); 
                }
            }
        }, 500);

    } catch (e) {
        status.innerHTML = "Error: Check assets folder.";
        console.error(e);
    }
}
initGame();
