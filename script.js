// --- GDRWeb v1.0.74: FULL ASSET SYNC ---
window.GDRWEB_VERSION = "1.0.74";

cc.game.onStart = function() {
    cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    // List of all your uploaded assets
    const sheetNames = ["", "02", "03", "04", "Glow", "Icons", "Editor"];
    const assetList = ["assets/GJ_squareB_01.png"];
    
    sheetNames.forEach(s => {
        assetList.push(`assets/GJ_GameSheet${s}.json`);
        assetList.push(`assets/GJ_GameSheet${s}.png`);
    });

    cc.loader.load(assetList, function() {
        
        // --- IMPROVED SPLICER: Deep-dives into nested Plist-JSON ---
        const spliceSheet = (name) => {
            const data = cc.loader.getRes(`assets/GJ_GameSheet${name}.json`);
            if (!data) return;

            let converted = { frames: {}, metadata: {} };

            if (data.plist && data.plist.dict) {
                const root = data.plist.dict[0];
                const frameKeys = root.key.indexOf("frames");
                const frameDict = root.dict[frameKeys];

                // Digging into the nested "key" and "dict" arrays
                frameDict.key.forEach((frameName, i) => {
                    const rawData = frameDict.dict[i];
                    let frameObj = {};
                    rawData.key.forEach((k, j) => {
                        // Map the string values (like "{0,0}") to the keys (like "spriteOffset")
                        frameObj[k] = rawData.string[j];
                    });
                    converted.frames[frameName] = frameObj;
                });
                cc.spriteFrameCache._addSpriteFramesByObject(name, converted);
            } else {
                cc.spriteFrameCache._addSpriteFramesByObject(name, data);
            }
        };

        sheetNames.forEach(spliceSheet);

        const getSprite = (name) => {
            const frame = cc.spriteFrameCache.getSpriteFrame(name);
            return frame ? new cc.Sprite("#" + name) : new cc.Sprite("assets/GJ_squareB_01.png");
        };

        // --- SCENES ---
        const MainMenuScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(175, 0, 175)));
                
                // Logo (from Sheet 01)
                const logo = getSprite("GJ_logo_001.png");
                logo.setPosition(640, 550);
                this.addChild(logo);

                // Play Button (from Sheet 04)
                const playBtn = new cc.MenuItemSprite(getSprite("GJ_playBtn_001.png"), getSprite("GJ_playBtn_001.png"), function() {
                    cc.director.runScene(new LevelSelectScene());
                }, this);

                // Creator Button (from Sheet 04)
                const editBtn = new cc.MenuItemSprite(getSprite("GJ_creatorBtn_001.png"), getSprite("GJ_creatorBtn_001.png"), function() {
                    console.log("Routing to: My Levels");
                }, this);

                const menu = new cc.Menu(editBtn, playBtn);
                menu.alignItemsHorizontallyWithPadding(60);
                menu.setPosition(640, 320);
                this.addChild(menu);
            }
        });

        const LevelSelectScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(0, 100, 255))); // Blue

                const label = new cc.LabelTTF("Stereo Madness", "Arial", 60);
                label.setPosition(640, 500);
                this.addChild(label);

                // Back Arrow (from Sheet 03)
                const backBtn = new cc.MenuItemSprite(getSprite("GJ_arrow_01_001.png"), getSprite("GJ_arrow_01_001.png"), function() {
                    cc.director.runScene(new MainMenuScene());
                }, this);
                
                const menu = new cc.Menu(backBtn);
                menu.setPosition(80, 640);
                this.addChild(menu);
            }
        });

        cc.director.runScene(new MainMenuScene());
    });
};

cc.game.run("gameCanvas");
