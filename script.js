// Updated Clean Script for Ge-NET-ry Dash
fetch('assets/project_data.xml')
  .then(response => response.text())
  .then(xmlData => {
      // This is the correct command for your specific engine
      try {
          loadLevelLibrary(xmlData); 
          console.log("Success: Your levels are ready!");
      } catch (err) {
          // If the first way fails, it tries the second way
          Game.importSave(xmlData);
      }
  });
