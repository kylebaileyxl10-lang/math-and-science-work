// --- GDRWeb v1.0.75: DEEP JSON MAPPING & UI ---
window.GDRWEB_VERSION = "1.0.75";

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
            const rootDict = data.plist.dict[0];
            const frameIdx = rootDict.key.indexOf("frames");
            const frameDict = rootDict.dict[frameIdx];

            // --- DEEP MAPPER: Extracts values from Plist-JSON Arrays ---
            frameDict.key.forEach((frameName, i) => {
                const raw = frameDict.dict[i];
                let fObj = {};
                raw.key.forEach((k, j) => {
                    // Check every possible type-array for the value at index j
                    if (raw.string && raw.string[j] !== undefined) fObj[k] = raw.string[j];
                    else if (raw.integer && raw.integer[j] !== undefined) fObj[k] = raw.integer[j];
                    else if (raw.true !== undefined && raw.key[j] === k) fObj[k] = true;
                    else if (raw.false !== undefined && raw.key[j] === k) fObj[k] = false;
                });
                converted.frames[frameName] = fObj;
            });
            cc.spriteFrameCache._addSpriteFramesByObject(name, converted);
        };

        // Load the simple ones first, then the deep ones
        cc.spriteFrameCache._addSpriteFramesByObject("01", cc.loader.getRes("assets/GJ_GameSheet.json"));
        ["03", "04", "Glow", "Icons"].forEach(spliceSheet);

        const getSprite = (n) => {
            const f = cc.spriteFrameCache.getSpriteFrame(n);
            return f ? new cc.Sprite("#" + n) : new cc.Sprite("assets/GJ_squareB_01.png");
        };

        // --- SCENES ---
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

                const editBtn = new cc.MenuItemSprite(getSprite("GJ_creatorBtn_001.png"), getSprite("GJ_creatorBtn_001.png"), function(){});

                const menu = new cc.Menu(editBtn, playBtn);
                menu.alignItemsHorizontallyWithPadding(60);
                menu.setPosition(640, 320);
                this.addChild(menu);
            }
        });

        const LevelSelectScene = cc.Scene.extend({
            onEnter: function() {
                this._super();
                this.addChild(new cc.LayerColor(cc.color(0, 102, 255))); // Blue

                // Level Card
                const title = new cc.LabelTTF("Stereo Madness", "Arial", 60);
                title.setPosition(640, 520);
                this.addChild(title);

                const diff = getSprite("difficulty_01_btn_001.png");
                diff.setPosition(640, 360);
                diff.setScale(1.2);
                this.addChild(diff);

                // Rewards (Stars & Orbs)
                const starIcon = getSprite("GJ_starsIcon_001.png");
                starIcon.setPosition(580, 240);
                this.addChild(starIcon);
                this.addChild(Object.assign(new cc.LabelTTF("1", "Arial", 30), {position: cc.p(620, 240)}));

                const orbIcon = getSprite("currencyOrbIcon_001.png");
                orbIcon.setPosition(670, 240);
                orbIcon.setScale(0.8);
                this.addChild(orbIcon);
                this.addChild(Object.assign(new cc.LabelTTF("50", "Arial", 30), {position: cc.p(720, 240)}));

                // Back Button
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
