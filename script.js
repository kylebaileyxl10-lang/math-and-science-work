// --- GDRWeb v1.0.26: THE VISUAL OVERHAUL ---
console.log("System: v1.0.26 - Polishing Visuals...");

const ID_MAP = { "1": "assets/GJ_square01.png", "default": "assets/GJ_square01.png" };

window.loadGDRWeb = function(xmlData) {
    cc.game.onStart = function() {
        const LevelScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                if (document.getElementById('loader-ui')) document.getElementById('loader-ui').style.display = 'none';

                // 1. THE BACKGROUND (The iconic GD Blue)
                const bg = new cc.LayerColor(cc.color(0, 102, 255)); 
                this.addChild(bg);

                const world = new cc.Layer();
                this.addChild(world);

                // 2. THE GROUND (Scrolling Floor)
                const ground = new cc.LayerColor(cc.color(0, 80, 200), 50000, 100);
                ground.setPosition(0, 0);
                world.addChild(ground);

                // 3. THE PLAYER (Adding a glow effect)
                const player = new cc.Sprite("assets/GJ_square01.png");
                player.setPosition(150, 200);
                player.setColor(cc.color(0, 255, 0));
                world.addChild(player);

                try {
                    const raw = xmlData.split("<k>k4</k><s>")[1].split("</s>")[0].trim();
                    const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
                    const data = pako.inflate(Uint8Array.from(bin, c => c.charCodeAt(0)), { to: 'string' });
                    const objects = data.split(';');

                    objects.slice(0, 3000).forEach(objStr => {
                        const p = objStr.split(',');
                        const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                        if (id && x && y) {
                            const s = new cc.Sprite(ID_MAP[id] || ID_MAP["default"]);
                            // GD objects are slightly above the floor
                            s.setPosition(parseFloat(x) / 4, (parseFloat(y) / 4) + 100);
                            s.setScale(0.35);
                            world.addChild(s);
                        }
                    });
                } catch(e) { console.error(e); }

                // 4. PHYSICS & AUTO-SCROLL
                let velocityY = 0;
                let isJumping = false;
                this.scheduleUpdate();
                
                this.update = function(dt) {
                    const scrollSpeed = 320 * dt;
                    world.x -= scrollSpeed; // Move world
                    player.x += scrollSpeed; // Keep player in view
                    
                    velocityY -= 35 * dt; // Gravity
                    player.y += velocityY;

                    // Collision with the Blue Ground
                    if (player.y <= 115) {
                        player.y = 115;
                        velocityY = 0;
                        isJumping = false;
                        player.setRotation(0); // Reset rotation on land
                    } else {
                        player.rotation += 300 * dt; // Rotate while jumping!
                    }
                };

                cc.eventManager.addListener({
                    event: cc.EventListener.MOUSE,
                    onMouseDown: function() {
                        if (!isJumping) { velocityY = 13; isJumping = true; }
                    }
                }, this);
            }
        });
        cc.director.runScene(new LevelScene());
    };
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml?v=' + Date.now()).then(r => r.text()).then(window.loadGDRWeb);
