// --- V1.0.10: DEEP SCAN & SMART BOOT ---
console.log("Boot: Home PC Init v1.0.10 Started...");

// 1. THE DECOMPRESSION ENGINE (Pako)
window.decompressLevel = function(base64String) {
    try {
        const normalized = base64String.replace(/-/g, '+').replace(/_/g, '/');
        const binaryString = atob(normalized);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return pako.inflate(bytes, { to: 'string' });
    } catch (err) {
        console.error("Renderer: Compression Error", err);
        return "";
    }
};

// 2. THE RENDERER
window.loadLevelLibrary = function(xmlData) {
    console.log("Renderer: Scanning XML...");
    
    const MathLabScene = cc.Scene.extend({
        onEnter: function() {
            this._super();
            this.addChild(new cc.LayerColor(cc.color(10, 10, 15))); 
            const gameLayer = new cc.Layer();
            this.addChild(gameLayer);

            try {
                const k4Marker = "<k>k4</k><s>";
                const parts = xmlData.split(k4Marker);
                let bestData = "";

                // Find the largest level segment
                for (let i = 1; i < parts.length; i++) {
                    const levelSegment = parts[i].split("</s>")[0].trim();
                    if (levelSegment.length > bestData.length) {
                        bestData = levelSegment;
                    }
                }

                if (bestData.length > 0) {
                    console.log("Renderer: Unzipping " + (bestData.length / 1024 / 1024).toFixed(2) + " MB...");
                    const decodedData = window.decompressLevel(bestData);
                    const objects = decodedData.split(';');
                    console.log("Renderer: SUCCESS! Found " + objects.length + " objects.");

                    objects.slice(0, 10000).forEach(objStr => {
                        const p = objStr.split(',');
                        const xIdx = p.indexOf('2');
                        const yIdx = p.indexOf('3');
                        if (xIdx !== -1 && yIdx !== -1) {
                            const sprite = new cc.Sprite("#GJ_GameSheet.png"); 
                            sprite.setPosition(parseFloat(p[xIdx+1]) / 10, parseFloat(p[yIdx+1]) / 10);
                            sprite.setScale(0.1);
                            gameLayer.addChild(sprite);
                        }
                    });
                }
            } catch (e) { console.error("Renderer Error", e); }

            const label = new cc.LabelTTF("Math Lab: " + gameLayer.childrenCount + " Objects", "Arial", 16);
            label.setPosition(cc.winSize.width / 2, 40);
            this.addChild(label);
        }
    });
    cc.director.runScene(new MathLabScene());
};

// 3. THE SMART BOOTLOADER
cc.game.onStart = function() {
    const tryFetch = (url) => {
        return fetch(url).then(response => {
            if (!response.ok) throw new Error();
            return response.text();
        });
    };

    // Try root first, then assets folder
    tryFetch('project_data.xml')
        .catch(() => tryFetch('assets/project_data.xml'))
        .then(data => {
            console.log("Boot: XML Fetched (" + data.length + " bytes)");
            window.loadLevelLibrary(data);
        })
        .catch(err => {
            console.error("Boot Error: File NOT found in root or assets folder. Check capitalization!");
        });
};

cc.game.run("gameCanvas");
