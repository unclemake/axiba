(function () {
    var Stage = Laya.Stage;
    var Loader = Laya.Loader;
    var Particle2D = Laya.Particle2D;
    var Browser = Laya.Browser;
    var Handler = Laya.Handler;
    var Stat = Laya.Stat;
    var WebGL = Laya.WebGL;
    var Sprite = Laya.Sprite;
    var sp;
    var Animation = Laya.Animation;
    var Stage = Laya.Stage;
    var Rectangle = Laya.Rectangle;
    var Loader = Laya.Loader;
    var Browser = Laya.Browser;
    var Handler = Laya.Handler;
    var WebGL = Laya.WebGL;

    var AniConfPath = "assets/resource/fighter.json";

    (function () {
        // 不支持WebGL时自动切换至Canvas
        Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);

        Laya.stage.alignV = Stage.ALIGN_MIDDLE;
        Laya.stage.alignH = Stage.ALIGN_CENTER;

        Laya.stage.scaleMode = "showall";
        Laya.stage.bgColor = "#ffffff";

        Stat.show();

        Laya.URL.basePath += "../../";
        Laya.loader.load("dist/resource/GravityMode.json", Handler.create(this, onAssetsLoaded), null, Loader.JSON);

        let sp = new Sprite();
        Laya.stage.addChild(sp);
        //画线
        sp.graphics.drawLine(0, 492, 900, 492, "#000000", 20);
    })();

    function onAssetsLoaded(settings) {
        sp = new Particle2D(settings);
        sp.emitter.start();
        sp.play();
        Laya.stage.addChild(sp);

        sp.x = Laya.stage.width / 2;
        sp.y = Laya.stage.height / 2;
    }



    (function () {
        Laya.loader.load(AniConfPath, Handler.create(this, createAnimation), null, Loader.ATLAS);
    })();

    function createAnimation() {
        var ani = new Animation();
        ani.loadAtlas(AniConfPath); // 加载图集动画
        ani.interval = 30;			// 设置播放间隔（单位：毫秒）
        ani.index = 1; 				// 当前播放索引
        ani.play(); 				// 播放图集动画

        // 获取动画的边界信息
        var bounds = ani.getGraphicBounds();
        ani.pivot(bounds.width / 2, bounds.height / 2);

        ani.pos(Laya.stage.width / 2, Laya.stage.height / 2 - 300);

        Laya.stage.addChild(ani);

        var ani = new Animation();
        ani.loadAtlas(AniConfPath); // 加载图集动画
        ani.interval = 30;			// 设置播放间隔（单位：毫秒）
        ani.index = 1; 				// 当前播放索引
        ani.play(); 				// 播放图集动画
        // 获取动画的边界信息
        var bounds = ani.getGraphicBounds();
        ani.pivot(bounds.width / 2, bounds.height / 2);

        ani.pos(Laya.stage.width / 2 - 200, Laya.stage.height / 2 - 300);

        Laya.stage.addChild(ani);

        var ani = new Animation();
        ani.loadAtlas(AniConfPath); // 加载图集动画
        ani.interval = 30;			// 设置播放间隔（单位：毫秒）
        ani.index = 1; 				// 当前播放索引
        ani.play(); 				// 播放图集动画
        // 获取动画的边界信息
        var bounds = ani.getGraphicBounds();
        ani.pivot(bounds.width / 2, bounds.height / 2);

        ani.pos(Laya.stage.width / 2 + 200, Laya.stage.height / 2 - 300);

        Laya.stage.addChild(ani);


        var ani = new Animation();
        ani.loadAtlas(AniConfPath); // 加载图集动画
        ani.interval = 30;			// 设置播放间隔（单位：毫秒）
        ani.index = 1; 				// 当前播放索引
        ani.play(); 				// 播放图集动画
        // 获取动画的边界信息
        var bounds = ani.getGraphicBounds();
        ani.pivot(bounds.width / 2, bounds.height / 2);

        ani.pos(Laya.stage.width / 2 + 200, Laya.stage.height / 2 + 300);

        Laya.stage.addChild(ani);


        var ani = new Animation();
        ani.loadAtlas(AniConfPath); // 加载图集动画
        ani.interval = 30;			// 设置播放间隔（单位：毫秒）
        ani.index = 1; 				// 当前播放索引
        ani.play(); 				// 播放图集动画
        // 获取动画的边界信息
        var bounds = ani.getGraphicBounds();
        ani.pivot(bounds.width / 2, bounds.height / 2);

        ani.pos(Laya.stage.width / 2, Laya.stage.height / 2 + 300);

        Laya.stage.addChild(ani);

        var ani = new Animation();
        ani.loadAtlas(AniConfPath); // 加载图集动画
        ani.interval = 30;			// 设置播放间隔（单位：毫秒）
        ani.index = 1; 				// 当前播放索引
        ani.play(); 				// 播放图集动画
        // 获取动画的边界信息
        var bounds = ani.getGraphicBounds();
        ani.pivot(bounds.width / 2, bounds.height / 2);

        ani.pos(Laya.stage.width / 2 - 200, Laya.stage.height / 2 + 300);

        Laya.stage.addChild(ani);
    }
})();