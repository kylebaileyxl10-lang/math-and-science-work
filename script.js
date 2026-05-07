async function initGame() {
  const bar = document.getElementById('bar');
  const status = document.getElementById('status');
  const startTime = Date.now();

  const timer = setInterval(() => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    status.innerHTML = `Analyzing Math Data... (${elapsed}s)`;
  }, 100);

  try {
    bar.style.width = '30%';
    // Ensure the folder name 'assets' matches your GitHub exactly
    const res = await fetch('assets/project_data.xml');
    
    if (!res.ok) throw new Error("File Missing");

    const xml = await res.text();
    bar.style.width = '100%';
    console.log("Math data loaded. Waiting for engine...");

    let attempts = 0;
    let check = setInterval(() => {
      attempts++;
      
      // Look for the engine in three different ways
      const engine = window.loadLevelLibrary || window.Game || window.Scaffolding;

      if (engine) {
        clearInterval(check);
        clearInterval(timer);
        console.log("Engine found! Starting Lab...");
        document.getElementById('loader-ui').style.display = 'none';
        
        // Try to start the game based on which engine loaded
        if (window.loadLevelLibrary) {
          loadLevelLibrary(xml);
        } else if (window.Game) {
          Game.importSave(xml);
        } else if (window.Scaffolding) {
          // Fallback for standard TurboWarp scaffolding
          const s = new Scaffolding.Scaffolding();
          s.setup();
          s.loadProject(xml);
        }
      }

      // 20 second timeout for slower school Wi-Fi or iPad Mini 4
      if (attempts > 40) {
        clearInterval(check);
        clearInterval(timer);
        status.innerHTML = "Math Lab Error: Engine Blocked. <br> <span style='color:#ff4444; font-size:12px;'>Check browser console for details.</span>";
      }
    }, 500);

  } catch (e) {
    clearInterval(timer);
    status.innerHTML = "Error: Math Data not found in /assets/.";
    console.error("Failed to load:", e);
  }
}

initGame();
