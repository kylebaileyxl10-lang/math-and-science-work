// Clean Load Script for math-and-science-work
// This replaces the 50-page file to stop the lag.

fetch('assets/project_data.xml')
  .then(response => response.text())
  .then(data => {
    // This command imports your 5 pages of levels into the game
    if (typeof loadLevelLibrary === 'function') {
        loadLevelLibrary(data);
    } else {
        // Fallback for different engine versions
        Game.importSave(data);
    }
    console.log("Your levels have been loaded successfully!");
  })
  .catch(err => console.error("Error loading levels:", err));
