async function initGame() {
    // 1. Hook into the new HTML elements
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
        // 3. Start the progress bar
        if (bar) bar.style.width = '30%';
        
        // 4. Fetch the level data
        console.log("Fetching project_data.xml...");
        const res = await fetch('assets/project_data.xml');
        
        if (!res.ok) throw new Error("Math Data file (project_data.xml) missing in /assets/ folder.");

        const xml = await res.text();
        if (bar) bar.style.width = '100%';
        console.log("Math data loaded. Waiting for engine...");

        // 5. Engine Detection Loop
        let attempts = 0;
        let check = setInterval(() => {
            attempts++;
            
            // Check for any of the common GD-web engine entry points
            const engine = window.loadLevelLibrary || window.Game || window.Scaffolding;

            if (engine) {
                clearInterval(check);
                clearInterval(timer);
                console.log("Engine found! Launching Lab...");
                
                // Hide the loader and show the game
                if (loaderUI) loaderUI.style.display = 'none';
                
                // Start based on which engine loaded
                if (window.loadLevelLibrary) {
                    loadLevelLibrary(xml);
                } else if (window.Game) {
                    Game.importSave(xml);
                } else if (window.Scaffolding) {
                    const s = new Scaffolding.Scaffolding();
                    s.setup();
                    s.loadProject(xml);
                }
            }

            // 6. Timeout after 30 seconds (Better for iPad Mini 4 on slow Wi-Fi)
            if (attempts > 60) {
                clearInterval(check);
                clearInterval(timer);
                status.innerHTML = "Math Lab Error: Engine Blocked. <br> <span style='color:#ff4444; font-size:12px;'>Wait a moment and refresh.</span>";
                console.error("The engine script (cocos2d) failed to initialize in time.");
            }
        }, 500);

    } catch (e) {
        clearInterval(timer);
        status.innerHTML = "Error: Math Data not found. Check /assets/.";
        console.error("Critical Load Failure:", e);
    }
}

// Kick off the initialization
initGame();
