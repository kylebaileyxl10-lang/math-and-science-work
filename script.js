async function initGame() {
    // 1. Hook into the HTML elements
    const bar = document.getElementById('bar');
    const status = document.getElementById('status');
    const loaderUI = document.getElementById('loader-ui');
    const startTime = Date.now();

    // 2. Start the "Analyzing" timer text
    const timer = setInterval(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        status.innerHTML = `Analyzing Math Data... (${elapsed}s)`;
    }, 100);

    try {
        // 3. Update Progress
        if (bar) bar.style.width = '40%';
        
        // 4. Fetch the level data
        console.log("Fetching project_data.xml...");
        const res = await fetch('assets/project_data.xml');
        
        if (!res.ok) throw new Error("Math Data file missing in /assets/.");

        const xml = await res.text();
        if (bar) bar.style.width = '100%';
        console.log("Math data loaded. Detecting Lite Engine...");

        // 5. Updated Engine Detection Loop for Lite Version
        let attempts = 0;
        let check = setInterval(() => {
            attempts++;
            
            // Check for the 'cc' object from cocos2d-js-v3.13-lite
            const liteEngineFound = (typeof cc !== 'undefined' && cc.game);
            const standardEngine = window.loadLevelLibrary || window.Game;

            if (liteEngineFound || standardEngine) {
                clearInterval(check);
                clearInterval(timer);
                console.log("Engine active! Launching Lab...");
                
                // Hide loader
                if (loaderUI) loaderUI.style.display = 'none';
                
                // Start the Lite Engine
                if (liteEngineFound) {
                    cc.game.run(); 
                    // If you have a specific level loading function, call it here:
                    if (window.loadLevelLibrary) loadLevelLibrary(xml);
                } else if (window.loadLevelLibrary) {
                    loadLevelLibrary(xml);
                }
            }

            // 6. Timeout for iPad Mini 4 performance
            if (attempts > 80) {
                clearInterval(check);
                clearInterval(timer);
                status.innerHTML = "Math Lab Error: Sync Failure. <br> <span style='color:#ff4444; font-size:12px;'>Check cocos2d.js file size.</span>";
            }
        }, 500);

    } catch (e) {
        clearInterval(timer);
        status.innerHTML = "Critical Error: Check /assets/ folder.";
        console.error("Load Failure:", e);
    }
}

initGame();
