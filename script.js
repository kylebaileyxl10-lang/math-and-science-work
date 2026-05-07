async function initGame() {
  const bar = document.getElementById('bar');
  const status = document.getElementById('status');
  const startTime = Date.now();

  // Timer update
  const timer = setInterval(() => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    status.innerHTML = `Analyzing Math Data... (${elapsed}s)`;
  }, 100);

  try {
    bar.style.width = '30%';
    const res = await fetch('assets/project_data.xml');
    
    if (!res.ok) throw new Error("File Missing");

    const xml = await res.text();
    bar.style.width = '100%';
    
    let attempts = 0;
    let check = setInterval(() => {
      attempts++;
      
      // Check if the TurboWarp/Scaffolding engine has loaded
      if (window.loadLevelLibrary || window.Game || window.Scaffolding) {
        clearInterval(check);
        clearInterval(timer);
        
        document.getElementById('loader-ui').style.display = 'none';
        
        if (window.loadLevelLibrary) loadLevelLibrary(xml);
        else if (window.Game) Game.importSave(xml);
      }

      // If the timer hits 15 seconds and still nothing, it's a firewall block
      if (attempts > 30) {
        clearInterval(check);
        clearInterval(timer);
        status.innerHTML = "Math Lab Error: Engine Blocked. <br> <span style='color:#ff4444; font-size:12px;'>School firewall is stopping the engine script.</span>";
      }
    }, 500);

  } catch (e) {
    clearInterval(timer);
    bar.style.width = '100%';
    status.innerHTML = "Math Lab Ready. <br> <span style='color:white; font-size:12px;'>Use manual import icon.</span>";
    setTimeout(() => {
       document.getElementById('loader-ui').style.display = 'none';
    }, 2000);
  }
}

initGame();
