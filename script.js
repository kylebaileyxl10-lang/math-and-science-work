async function initGame() {
  const bar = document.getElementById('bar');
  const status = document.getElementById('status');
  const startTime = Date.now(); // Start the clock

  // Update the timer every 100ms
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
    
    let check = setInterval(() => {
      if (window.loadLevelLibrary || window.Game) {
        clearInterval(check);
        clearInterval(timer); // Stop the clock when the game is ready
        
        const finalTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`Load complete in ${finalTime} seconds.`);
        
        document.getElementById('loader-ui').style.display = 'none';
        if (window.loadLevelLibrary) loadLevelLibrary(xml);
        else Game.importSave(xml);
      }
    }, 500);

  } catch (e) {
    clearInterval(timer); // Stop the clock if it fails
    bar.style.width = '100%';
    status.innerHTML = "Math Lab Ready. <br> <span style='color:white; font-size:12px;'>Use manual import icon.</span>";
    setTimeout(() => {
       document.getElementById('loader-ui').style.display = 'none';
    }, 2000);
  }
}

initGame();
