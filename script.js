const bar = document.getElementById('bar');
const status = document.getElementById('status');

async function initGame() {
  try {
    bar.style.width = '40%';
    const res = await fetch('assets/project_data.xml');
    const xml = await res.text();
    bar.style.width = '70%';

    // This loop waits for the engine to wake up
    let check = setInterval(() => {
      if (window.loadLevelLibrary || window.Game) {
        clearInterval(check);
        bar.style.width = '100%';
        
        setTimeout(() => {
          document.getElementById('loader-ui').style.display = 'none';
          if (window.loadLevelLibrary) loadLevelLibrary(xml);
          else if (window.Game) Game.importSave(xml);
        }, 500);
      }
    }, 500);

  } catch (e) {
    status.innerText = "Load Failed. Refreshing...";
    console.error(e);
  }
}

initGame();
