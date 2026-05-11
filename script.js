async function initGame() {
    const status = document.getElementById('status');
    const loaderUI = document.getElementById('loader-ui');

    try {
        console.log("Fetching Lab Data...");
        const res = await fetch('assets/project_data.xml');
        const xml = await res.text();
        
        // CHECK: Is the file empty or too small?
        console.log("XML Data Received. Length:", xml.length);
        if (xml.length < 100) {
            console.error("CRITICAL ERROR: project_data.xml appears to be empty!");
            if (status) status.innerHTML = "Error: Level Data is empty!";
            return; 
        }

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
                        "assets/GJ_GameSheetIcons.plist", "assets/GJ_GameSheetIcons.png",
                        "assets/GJ_GameSheetEditor.plist", "assets/GJ_GameSheetEditor.png"
                    ];
                    
                    cc.loader.load(resources, function() {
                        resources.forEach(file => {
                            if (file.endsWith(".plist")) {
                                const texturePath = file.replace(".plist", ".png");
                                cc.spriteFrameCache.addSpriteFrames(file, texturePath);
                                console.log("Synced to Memory: " + file);
                            }
                        });

                        if (window.loadLevelLibrary) {
                            console.log("Booting Level Renderer...");
                            loadLevelLibrary(xml);
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
        console.error("Fetch failed:", e);
    }
}
initGame();
