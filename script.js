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
        
        console.log("Fetching project_data.xml...");
        const res = await fetch('assets/project_data.xml');
        if (!res.ok) throw new Error("Missing XML");
        const xml = await res.text();
        
        if (bar) bar.style.width = '100%';

        let attempts = 0;
        let check = setInterval(() => {
            attempts++;
            const liteEngineFound = (typeof cc !== 'undefined' && cc.game);

            if (liteEngineFound) {
                clearInterval(check);
                clearInterval(timer);
                console.log("Engine found. Initializing SD Renderer...");

                // This is the official hook for the Lite Engine
                cc.game.onStart = function() {
                    console.log("Renderer Ready. Forcing Standard Definition...");
                    
                    // --- SD MODE FIX START ---
                    // Prevents the engine from looking for '-hd' suffixes
                    cc.view.enableRetina(false);
                    cc.director.setContentScaleFactor(1.0);
                    // --- SD MODE FIX END ---

                    if (loaderUI) loaderUI.style.display = 'none';
                    
                    if (window.loadLevelLibrary) {
                        console.log("Injecting Data into Library...");
                        loadLevelLibrary(xml);
                    }
                };

                // Final safety delay for iPad browser rendering
                setTimeout(() => {
                    try {
                        cc.game.run("gameCanvas");
                    } catch (e) {
                        console.error("Boot failure:", e);
                    }
                }, 500); 
            }

            if (attempts > 60) {
                clearInterval(check);
                clearInterval(timer);
                status.innerHTML = "Sync Error: Please Refresh.";
            }
        }, 500);

    } catch (e) {
        if (timer) clearInterval(timer);
        status.innerHTML = "Error: Check /assets/ folder.";
        console.error("Init Error:", e);
    }
}

initGame();
