async function initGame() {
    const bar = document.getElementById('bar');
    const status = document.getElementById('status');
    const loaderUI = document.getElementById('loader-ui');

    try {
        status.innerHTML = "Fetching Lab Data...";
        const res = await fetch('assets/project_data.xml');
        const xml = await res.text();
        
        let check = setInterval(() => {
            if (typeof cc !== 'undefined' && cc.game) {
                clearInterval(check);

                cc.game.onStart = function() {
                    // Manual override to prevent the 'init' crash
                    cc.view.enableRetina(false);
                    cc.director.setContentScaleFactor(1.0);

                    // Sync the JSON-content plists
                    cc.loader.register(["plist"], cc._txtLoader); 
                    
                    const resources = [
                        "assets/GJ_GameSheet.plist", "assets/GJ_GameSheet.png",
                        "assets/GJ_GameSheet02.plist", "assets/GJ_GameSheet02.png"
                    ];
                    
                    cc.loader.load(resources, function() {
                        if (window.loadLevelLibrary) loadLevelLibrary(xml);
                        if (loaderUI) loaderUI.style.display = 'none';
                    });
                };

                // The Fix: If the engine hasn't prepared, we force it with a basic config
                if (!cc.game._prepared) {
                    const config = {
                        "project_type": "javascript",
                        "debugMode": 1,
                        "id": "gameCanvas",
                        "renderMode": 1
                    };
                    cc.game.run(config); 
                }
            }
        }, 500);

    } catch (e) {
        status.innerHTML = "Error: Assets not found.";
    }
}
initGame();
