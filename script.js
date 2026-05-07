// Force Load Script
window.onload = () => {
    console.log("Starting engine...");
    fetch('assets/project_data.xml')
        .then(response => response.text())
        .then(xmlData => {
            // Wait 1 second then force the import
            setTimeout(() => {
                if (window.loadLevelLibrary) {
                    loadLevelLibrary(xmlData);
                } else if (window.Game) {
                    Game.importSave(xmlData);
                }
                // Kill the loading screen manually
                const loader = document.getElementById('loading');
                if (loader) loader.style.display = 'none';
            }, 1000);
        })
        .catch(() => {
            document.getElementById('loading').innerHTML = "<p>Ready. Use Manual Import.</p>";
        });
};
