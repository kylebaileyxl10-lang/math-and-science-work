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
        
        // 1. Fetch XML and the SpriteSheet JSONs first
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
                    console.log("Renderer Ready.");
                    
                    // --- THE FIX FOR BLACK SCREEN & JSON ---
                    cc.view.enableRetina(false);
                    cc.director.setContentScaleFactor(1.0);

                    // Tell the engine how to read your converted JSON files
                    cc.loader.register(["json"], cc._txtLoader); 

                    // Manually add your sheets to the cache to bypass the "Sync XHR" block
                    // Do this for your main gamesheet
                    const sheetPath = "assets/GJ_GameSheet.json";
                    const texturePath = "assets/GJ_GameSheet.png";
                    
                    cc.loader.load([sheetPath, texturePath], function() {
                        console.log("Textures Loaded. Starting Math Lab...");
                        
                        if (window.loadLevelLibrary) {
                            loadLevelLibrary(xml);
                        }
                        
                        if (loaderUI) loaderUI.style.display = 'none';
                    });
                };

                setTimeout(() => {
                    try {
                        // Pass the config ID to ensure it binds to the canvas
                        cc.game.run("gameCanvas");
                    } catch (e) {
                        console.error("Boot failure:", e);
                    }
                }, 500); 
            }
        }, 500);

    } catch (e) {
        if (timer) clearInterval(timer);
        status.innerHTML = "Error: Assets not found.";
    }
}

initGame();
