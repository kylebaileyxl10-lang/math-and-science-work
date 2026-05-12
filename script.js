// --- GDRWeb v1.0.49: UNIFIED THREAD LOGIC ---
console.log("System: v1.0.49 - Single-entry initialization");

window.loadGDRWeb = function(xmlData) {
    // PRE-BUILD DATA
    let levelDataString = "";
    try {
        const levelPart = xmlData.split("<k>k4</k>")[1].split("</s>")[0].trim();
        const decoded = atob(levelPart.replace(/-/g, '+').replace(/_/g, '/'));
        levelDataString = pako.inflate(Uint8Array.from(decoded, c => c.charCodeAt(0)), { to: 'string' });
    } catch(e) { console.log("Level data cached for renderer."); }

    cc.game.onStart = function() {
        cc.view.enableRetina(false); 
        cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);

        cc.loader.loadTxt("assets/GJ_GameSheet.plist", function(err, textData) {
            if (err) return;
            try {
                cc.spriteFrameCache._addSpriteFramesByObject("assets/GJ_GameSheet.plist", JSON.parse(textData));
            } catch (e) {}

            const MainMenuScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    if (this.getChildrenCount() > 0) return; // Hard-stop for duplicates

                    this.addChild(new cc.LayerColor(cc.color(20, 80, 180))); 

                    const frame = cc.spriteFrameCache.getSpriteFrame("blackCogwheel_01_001.png");
                    const logo = frame ? new cc.Sprite(frame) : new cc.LabelTTF("GDRWeb", "Arial", 40);
                    logo.setPosition(400, 350);
                    if (frame) logo.setScale(1.5);
                    this.addChild(logo);

                    const playBtnSprite = new cc.Sprite("assets/GJ_squareB_01.png");
                    const playBtn = new cc.MenuItemSprite(playBtnSprite, playBtnSprite, function() {
                        cc.director.runScene(new GameplayScene());
                    });
                    const menu = new cc.Menu(playBtn);
                    menu.setPosition(400, 200);
                    this.addChild(menu);
                    
                    if (document.getElementById('status')) document.getElementById('status').style.display = 'none';
                }
            });

            const GameplayScene = cc.Scene.extend({
                onEnter: function() {
                    this._super();
                    const world = new cc.Layer();
                    this.addChild(new cc.LayerColor(cc.color(10, 40, 90)));
                    this.addChild(world);

                    const player = new cc.Sprite("assets/icons/player_01.png");
                    player.setPosition(150, 150);
                    world.addChild(player);

                    // SIMPLE RENDERER
                    levelDataString.split(';').slice(0, 300).forEach(obj => {
                        const p = obj.split(',');
                        if (p.indexOf('1') !== -1) {
                            const b = new cc.Sprite("assets/GJ_squareB_01.png");
                            b.setPosition(parseFloat(p[p.indexOf('2') + 1])/4, (parseFloat(p[p.indexOf('3') + 1])/4) + 120);
                            b.setScale(0.3);
                            world.addChild(b);
                        }
                    });

                    this.scheduleUpdate();
                    let vY = 0;
                    this.update = function(dt) {
                        world.x -= 300 * dt; vY -= 35 * dt; player.y += vY;
                        if (player.y <= 115) { player.y = 115; vY = 0; }
                    };
                    cc.eventManager.addListener({ event: cc.EventListener.MOUSE, onMouseDown: () => vY = 13 }, this);
                }
            });

            cc.director.runScene(new MainMenuScene());
        });
    };
    // REMOVED: cc.game.run call here to prevent double-start thread
    cc.initEngine(cc.game.config, cc.game.onStart.bind(cc.game));
};

fetch('assets/project_data.xml').then(r => r.text()).then(window.loadGDRWeb);
