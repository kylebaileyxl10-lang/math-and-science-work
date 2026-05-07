// Clean Script for Everywhere Dash
fetch('assets/project_data.xml')
  .then(response => response.text())
  .then(data => {
    // Correct command for TurboWarp/Ge-NET-ry engines
    if (typeof loadLevelLibrary === 'function') {
        loadLevelLibrary(data);
    } else if (window.Game) {
        Game.importSave(data);
    }
    console.log("Levels loaded successfully from assets.");
  })
  .catch(err => console.error("Could not find project_data.xml in assets folder. Use the Import button."));
