// Clean Script with Delay for Friday
setTimeout(() => {
    fetch('assets/project_data.xml')
      .then(response => response.text())
      .then(data => {
          // Try loading levels after engine starts
          try {
              if (typeof loadLevelLibrary === 'function') {
                  loadLevelLibrary(data);
              } else if (window.Game) {
                  Game.importSave(data);
              }
              console.log("Levels loaded successfully.");
          } catch (e) {
              console.log("Auto-load failed. Use the manual Import button.");
          }
      });
}, 3000); // 3-second delay to stop the lag/crash
