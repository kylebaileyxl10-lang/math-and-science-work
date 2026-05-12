// --- GDRWeb v1.0.24: PLAYER PHYSICS & CAMERA ---
console.log("System: v1.0.24 - Gameplay Physics Engaged");

const ID_MAP = { "1": "assets/GJ_square01.png", "default": "assets/GJ_square01.png" };

window.loadGDRWeb = function(xmlData) {
    cc.game.onStart = function() {
        
        // --- SCENE: THE LEVEL ---
        const LevelScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                const world = new cc.Layer();
                this.addChild(world);

                // 1. THE PLAYER CUBE
                const player = new cc.Sprite("assets/GJ_square01.png");
                player.setPosition(100, 200);
                player.setColor(cc.color(0, 255, 0)); // Classic Green
                world.addChild(player);

                // 2. PARSE LEVEL
                const parts = xmlData.split("<k>k4</k><s>");
                const raw = parts[1].split("</s>")[0].trim();
                const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
                const data = pako.inflate(Uint8Array.from(bin, c => c.charCodeAt(0)), { to: 'string' });
                const objects = data.split(';');

                objects.slice(0, 8000).forEach(objStr => {
                    const p = objStr.split(',');
                    const id = p[p.indexOf('1') + 1], x = p[p.indexOf('2') + 1], y = p[p.indexOf('3') + 1];
                    if (id && x && y) {
                        const s = new cc.Sprite(ID_MAP[id] || ID_MAP["default"]);
                        s.setPosition(parseFloat(x)/4, (parseFloat(y)/4));
                        s.setScale(0.35);
                        world.addChild(s);
                    }
                });

                // 3. THE PHYSICS LOOP (The "GD Movement")
                let velocityY = 0;
                let isJumping = false;

                this.scheduleUpdate();
                this.update = function(dt) {
                    // Move world left (makes player look like they move right)
                    const speed = 350 * dt;
                    world.x -= speed;

                    // Gravity
                    velocityY -= 25 * dt;
                    player.y += velocityY;

                    // Floor Collision (Basic)
                    if (player.y <= 100) {
                        player.y = 100;
                        velocityY = 0;
                        isJumping = false;
                    }

                    // Camera Follow (Center player on screen)
                    player.x += speed; 
                };

                // 4. CLICK TO JUMP
                cc.eventManager.addListener({
                    event: cc.EventListener.MOUSE,
                    onMouseDown: function() {
                        if (!isJumping) {
                            velocityY = 12;
                            isJumping = true;
                        }
                    }
                }, this);
            }
        });

        // Start with Menu (or skip to LevelScene to test immediately)
        cc.director.runScene(new LevelScene());
    };
    cc.game.run("gameCanvas");
};

fetch('assets/project_data.xml?v=' + Date.now()).then(r => r.text()).then(window.loadGDRWeb);
