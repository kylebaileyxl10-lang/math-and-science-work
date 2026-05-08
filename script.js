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
        
        // Fetch XML manually to avoid Synchronous XMLHttpRequest errors
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
                console.log("Engine found. Initializing Renderer...");

                // The official hook for Cocos2d-JS Lite
                cc.game.onStart = function() {
                    console.log("Renderer Ready. Injecting Data.");
                    if (loaderUI) loaderUI.style.display = 'none';
                    if (window.loadLevelLibrary) {
                        loadLevelLibrary(xml);
                    }
                };

                // Added delay to ensure the DOM is painted
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
