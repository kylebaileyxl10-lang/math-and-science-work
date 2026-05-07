async function initGame() {
  const bar = document.getElementById('bar');
  const status = document.getElementById('status');
  
  try {
    bar.style.width = '30%';
    // We check the assets folder
    const res = await fetch('assets/project_data.xml');
    
    if (!res.ok) throw new Error("File Missing");

    const xml = await res.text();
    bar.style.width = '100%';
    
    let check = setInterval(() => {
      if (window.loadLevelLibrary || window.Game) {
        clearInterval(check);
        document.getElementById('loader-ui').style.display = 'none';
        if (window.loadLevelLibrary) loadLevelLibrary(xml);
        else Game.importSave(xml);
      }
    }, 500);

  } catch (e) {
    // PLAN B: If the file is deleted/missing, don't stay black
    bar.style.width = '100%';
    status.innerHTML = "Math Lab Ready. <br> <span style='color:white; font-size:12px;'>Use manual import icon.</span>";
    setTimeout(() => {
       document.getElementById('loader-ui').style.display = 'none';
    }, 2000);
  }
}
initGame();
