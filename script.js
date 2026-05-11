async function initGame() {
    const bar = document.getElementById('bar');
    const status = document.getElementById('status');
    const loaderUI = document.getElementById('loader-ui');
    const startTime = Date.now();

    const timer = setInterval(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        status.innerHTML = `Analyzing Math Data... (${elapsed}s)`;
    }, 100);

    try {
        if (bar) bar.style.width = '40%';
        
        // 1. Fetch XML first
        console.log("Pre-fetching Lab Assets...");
        const res = await fetch('assets/project_data.xml');
        if (!res.ok) throw new Error("Missing XML");
        const xml = await res.text();
        
        if (bar) bar.style.width = '100%';

        let check = setInterval(() => {
            const liteEngineFound = (typeof cc !== 'undefined' && cc.game);

            if (liteEngineFound) {
                clearInterval(check);
                clearInterval(timer);

                cc.game.onStart = function() {
                    console.log("Renderer Ready. Patching SpriteMaps...");
                    
                    // Force Standard Definition for iPad Mini 4 stability
                    cc.view.enableRetina(false);
                    cc.director.setContentScaleFactor(1.0);

                    // --- THE JSON-PLIST HYBRID FIX ---
                    // Since your file ends in .plist but is actually JSON text:
                    cc.loader.register(["plist"], cc._txtLoader); 

                    // We use the NEW filename you created in the assets folder
                    const sheetPath = "assets/GJ_GameSheet.plist"; 
                    const texturePath = "assets/GJ_GameSheet.png";
                    
                    console.log("Syncing: " + sheetPath);

                    cc.loader.load([sheetPath, texturePath], function() {
                        console.log("Assets cached. Booting Math Lab logic...");
                        
                        if (window.loadLevelLibrary) {
                            loadLevelLibrary(xml);
                        }
                        
                        if (loaderUI) loaderUI.style.display = 'none';
                    });
                };

                // Added check to prevent the "init" binding error from image_395055.png
                if (!cc.game._prepared) {
                    cc.game.run("gameCanvas");
                }
            }
        }, 500);

    } catch (e) {
        if (timer) clearInterval(timer);
        status.innerHTML = "Error: Assets not found.";
        console.error("Init Error:", e);
    }
}

initGame();
