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
                console.log("Engine found. Booting Renderer...");

                cc.game.onStart = function() {
                    console.log("Renderer Initialized.");
                    if (loaderUI) loaderUI.style.display = 'none';
                    if (window.loadLevelLibrary) loadLevelLibrary(xml);
                };

                // This forces the engine to use the config and the canvas
                setTimeout(() => {
                    try {
                        cc.game.run("gameCanvas");
                    } catch (e) {
                        console.error("Boot failure:", e);
                    }
                }, 400); 
            }
    } catch (e) {
        status.innerHTML = "Error: Check /assets/folder.";
    }
}
initGame();
