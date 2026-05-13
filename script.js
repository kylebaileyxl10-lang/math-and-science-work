// --- GDRWeb v1.0.76: THE "TRUE ROOT" FIX ---
window.GDRWEB_VERSION = "1.0.76";

cc.game.onStart = function() {
    cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    const sheetNames = ["", "02", "03", "04", "Glow", "Icons", "Editor"];
    const assetList = ["assets/GJ_squareB_01.png"];
    sheetNames.forEach(s => {
        assetList.push(`assets/GJ_GameSheet${s}.json`, `assets/GJ_GameSheet${s}.png`);
    });

    cc.loader.load(assetList, function() {
        
        const spliceSheet = (name) => {
            const data = cc.loader.getRes(`assets/GJ_GameSheet${name}.json`);
            if (!data || !data.plist) return;

            let converted = { frames: {}, metadata: {} };
            // FIX: Removed the [0] index as the data isn't an array in your files
            const rootDict = data.plist.dict; 
            if (!rootDict || !rootDict.key) return;

            const frameIdx = rootDict.key.indexOf("frames");
            if (frameIdx === -1) return;
            const frameDict = rootDict.dict[frameIdx];

            frameDict.key.forEach((frameName, i) => {
                const raw = frameDict.dict[i];
                let fObj = {};
                if (raw && raw.key) {
                    raw.key.forEach((k, j) => {
                        if (raw.string && raw.string[j] !== undefined) fObj[k] = raw.string[j];
                        else if (raw.integer && raw.integer[j] !== undefined) fObj[k] = raw.integer[j];
                        else if (raw.true !== undefined && raw.key[j] === k) fObj[k] = true;
                        else if (raw.false !== undefined && raw.key[j] === k) fObj[k] = false;
                    });
                }
                converted.frames[frameName] = fObj;
            });
            cc.spriteFrameCache._addSpriteFramesByObject(name, converted);
        };

        // Load all sheets
        cc.spriteFrameCache._addSpriteFramesByObject("01", cc.loader.getRes("assets/GJ_GameSheet.json"));
        ["03", "04", "Glow", "Icons"].forEach(spliceSheet);

        const getSprite = (n) => {
            const f = cc.spriteFrameCache.getSpriteFrame(n);
            return f ? new cc.Sprite("#" + n) : new cc.Sprite("assets/GJ_squareB_01.png");
        };

        const MainMenuScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(175, 0, 175)));
                const logo = getSprite("GJ_logo_001.png");
                logo.setPosition(640, 550);
                this.addChild(logo);

                const playBtn = new cc.MenuItemSprite(getSprite("GJ_playBtn_001.png"), getSprite("GJ_playBtn_001.png"), function() {
                    cc.director.runScene(new LevelSelectScene());
                }, this);

                const menu = new cc.Menu(playBtn);
                menu.setPosition(640, 320);
                this.addChild(menu);
            }
        });

        const LevelSelectScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(0, 102, 255)));

                const diff = getSprite("difficulty_01_btn_001.png");
                diff.setPosition(640, 360);
                this.addChild(diff);

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
