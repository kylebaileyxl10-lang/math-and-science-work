// Clean Script - math-and-science-work
fetch('assets/project_data.xml')
  .then(res => res.text())
  .then(xmlData => {
    // Wait for engine to wake up
    setTimeout(() => {
      try {
        if (typeof loadLevelLibrary === 'function') loadLevelLibrary(xmlData);
        else if (window.Game) Game.importSave(xmlData);
      } catch (e) { console.log("Manual import ready."); }
    }, 2000);
  });
