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
                console.log("Engine detected. Forcing canvas binding...");

                // The "Secret Sauce" to fix the tagName error
                setTimeout(() => {
                    try {
                        cc.container = document.getElementById('Cocos2dGameContainer');
                        cc._canvas = document.getElementById('gameCanvas');
                        cc.game.run();
                        if (window.loadLevelLibrary) loadLevelLibrary(xml);
                        if (loaderUI) loaderUI.style.display = 'none';
                    } catch (e) {
                        console.error("Manual binding failed:", e);
                    }
                }, 300); // Wait 0.3s for iPad Safari to paint the DOM
            }

            if (attempts > 60) {
                clearInterval(check);
                status.innerHTML = "Math Lab Error: Try Refreshing.";
            }
        }, 500);

    } catch (e) {
        status.innerHTML = "Error: Check /assets/folder.";
    }
}
initGame();
