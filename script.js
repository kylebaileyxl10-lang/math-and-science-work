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

        let check = setInterval(() => {
            if (typeof cc !== 'undefined' && cc.game) {
                clearInterval(check);
                clearInterval(timer);

                cc.game.onStart = function() {
                    console.log("Renderer Ready. Loading Full Library...");
                    
                    cc.view.enableRetina(false);
                    cc.director.setContentScaleFactor(1.0);

                    // Tell the engine to read these .plist files as JSON text
                    cc.loader.register(["plist", "json"], cc._txtLoader); 

                    // List every file from your screenshot
                    const resources = [
                        "assets/GJ_GameSheet.plist", "assets/GJ_GameSheet.png",
                        "assets/GJ_GameSheet02.plist", "assets/GJ_GameSheet02.png",
                        "assets/GJ_GameSheet03.plist", "assets/GJ_GameSheet03.png",
                        "assets/GJ_GameSheet04.plist", "assets/GJ_GameSheet04.png",
                        "assets/GJ_GameSheetGlow.plist", "assets/GJ_GameSheetGlow.png",
                        "assets/GJ_GameSheetIcons.plist", "assets/GJ_GameSheetIcons.png"
                    ];
                    
                    cc.loader.load(resources, function() {
                        console.log("All Math Lab textures synced!");
                        if (window.loadLevelLibrary) loadLevelLibrary(xml);
                        if (loaderUI) loaderUI.style.display = 'none';
                    });
                };

                if (!cc.game._prepared) {
                    cc.game.run("gameCanvas");
                }
            }
        }, 500);

    } catch (e) {
        if (timer) clearInterval(timer);
        status.innerHTML = "Error: Check /assets folder.";
        console.error("Init Error:", e);
    }
}

initGame();
