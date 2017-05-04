class Main extends egret.DisplayObjectContainer {
    constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    onAddToStage(event) {
        this.createGameScene();
        this._shape = new egret.Shape();
        this.addChild(this._shape);
        this.initGraphics();
        ///设置按钮的标签
        var label = new eui.Label();
        this.label = label;
        label.text = "点击关闭水流";
        //设置颜色等文本属性
        label.textColor = 0xff0000;
        label.size = 16;
        label.lineSpacing = 12;
        label.textAlign = egret.HorizontalAlign.JUSTIFY;
        label.y = 60;
        /*** 本示例关键代码段结束 ***/
        label.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
        this.addChild(label);
        var imgLoader = new egret.ImageLoader;
        imgLoader.once(egret.Event.COMPLETE, this.imgLoadHandler, this);
        imgLoader.load("resource/cartoon-egret_01_small.png");
    }
    onTouch() {
        if (this.label.text === '点击关闭水流') {
            this.label.text = '点击开启水流';
            this.system.stop();
        }
        else {
            this.label.text = '点击关闭水流';
            this.system.start();
        }
    }
    imgLoadHandler(evt) {
        var bmd = evt.currentTarget.data;
        /// 产生确定数量的白鹭小鸟
        var wHalfBird = bmd.width / 2;
        var hHalfBird = bmd.height / 2;
        this._rectScope = new egret.Rectangle(wHalfBird * Main.SCALE_BASE, hHalfBird * Main.SCALE_BASE, this.stage.stageWidth - wHalfBird * Main.SCALE_BASE * 2, this.stage.stageHeight - hHalfBird * Main.SCALE_BASE * 2);
        this._vcBird = new Array();
        for (var i = 0; i < Main.NUM; ++i) {
            var bird = new egret.Bitmap(bmd);
            bird.anchorOffsetX = wHalfBird;
            bird.anchorOffsetY = hHalfBird;
            /// 给一个随机的初始位置
            bird.x = this._rectScope.x + this._rectScope.width * Math.random();
            bird.y = this._rectScope.y + this._rectScope.height * Math.random();
            bird.scaleX = bird.scaleY = Main.SCALE_BASE;
            this._vcBird.push(bird);
            this.addChild(bird);
        }
        /// 提示信息
        this._txInfo = new egret.TextField;
        this.addChild(this._txInfo);
        this._txInfo.size = 28;
        this._txInfo.x = 50;
        this._txInfo.y = 50;
        this._txInfo.width = this.stage.stageWidth - 100;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.touchEnabled = true;
        this._bgInfo = new egret.Shape;
        this.addChild(this._bgInfo);
        this._bgInfo.x = this._txInfo.x;
        this._bgInfo.y = this._txInfo.y;
        this._bgInfo.graphics.clear();
        this._bgInfo.graphics.beginFill(0xffffff, .5);
        this._bgInfo.graphics.drawRect(0, 0, this._txInfo.width, this._txInfo.height);
        this._bgInfo.graphics.endFill();
        this._bgInfo.cacheAsBitmap = true;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, (evt) => {
            this.planRdmMotion();
        }, this);
        this.planRdmMotion();
        this._nScaleBase = 0;
        /// 产生动画
        this.stage.addEventListener(egret.Event.ENTER_FRAME, (evt) => {
            /*** 本示例关键代码段开始 ***/
            switch (this._iMotionMode) {
                case MotionMode.ROT:
                    this._vcBird[this._vcMotion[0]].rotation += 3;
                    this._vcBird[this._vcMotion[1]].rotation -= 3;
                    this._vcBird[this._vcMotion[2]].rotation += 3;
                    var scale = Main.SCALE_BASE + Math.abs(Math.sin(this._nScaleBase += 0.03)) * Main.SCALE_RANGE;
                    //console.log( "scale at:", Math.abs( Math.sin( this._nScaleBase ) ) );
                    this._vcBird[this._vcMotion[0]].scaleX = this._vcBird[this._vcMotion[0]].scaleY = scale;
                    this._vcBird[this._vcMotion[1]].scaleX = this._vcBird[this._vcMotion[1]].scaleY = scale;
                    this._vcBird[this._vcMotion[2]].scaleX = this._vcBird[this._vcMotion[2]].scaleY = scale;
                    break;
                case MotionMode.MOV:
                    var xTo;
                    if ((xTo = this._vcBird[this._vcMotion[0]].x - 3) < this._rectScope.left)
                        xTo = this._rectScope.right;
                    this._vcBird[this._vcMotion[0]].x = xTo;
                    if ((xTo = this._vcBird[this._vcMotion[1]].x + 3) > this._rectScope.right)
                        xTo = this._rectScope.left;
                    this._vcBird[this._vcMotion[1]].x = xTo;
                    if ((xTo = this._vcBird[this._vcMotion[2]].x - 3) < this._rectScope.left)
                        xTo = this._rectScope.right;
                    this._vcBird[this._vcMotion[2]].x = xTo;
                    break;
            }
            /*** 本示例关键代码段结束 ***/
        }, this);
    }
    /// 随机设置运动内容
    planRdmMotion() {
        /// 随机一个运动模式
        this._iMotionMode = Math.random() > .5 ? 0 : 1;
        /// 还原比例
        if (this._vcMotion && this._vcMotion.length == 3) {
            this._vcBird[this._vcMotion[0]].scaleX = this._vcBird[this._vcMotion[0]].scaleY = Main.SCALE_BASE;
            this._vcBird[this._vcMotion[1]].scaleX = this._vcBird[this._vcMotion[1]].scaleY = Main.SCALE_BASE;
            this._vcBird[this._vcMotion[2]].scaleX = this._vcBird[this._vcMotion[2]].scaleY = Main.SCALE_BASE;
        }
        this.setChildIndex(this._txInfo, this.numChildren - 1); /// 重置提示文字及背景深度
        this.setChildIndex(this._bgInfo, this.numChildren - 2);
        /// 随机取三个位置的白鹭小鸟并且确保深度最高
        this._vcMotion = new Array();
        this._vcMotion.push(Math.floor(Main.NUM * Math.random()));
        this._vcMotion.push(Math.floor(Main.NUM * Math.random()));
        this._vcMotion.push(Math.floor(Main.NUM * Math.random()));
        this.setChildIndex(this._vcBird[this._vcMotion[0]], this.numChildren - 3);
        this.setChildIndex(this._vcBird[this._vcMotion[1]], this.numChildren - 4);
        this.setChildIndex(this._vcBird[this._vcMotion[2]], this.numChildren - 5);
    }
    //创建游戏场景
    createGameScene() {
        RES.getResByUrl("resource/assets/particle1/blue.png", function (texture) {
            this._texture = texture;
            this.create();
        }, this, RES.ResourceItem.TYPE_IMAGE);
        RES.getResByUrl("resource/assets/particle1/sun.json", function (data) {
            this._config = data;
            this.create();
        }, this, RES.ResourceItem.TYPE_JSON);
    }
    //初始化赋值
    initGraphics() {
        var shape = this._shape;
        /*** 本示例关键代码段开始 ***/
        shape.graphics.lineStyle(10, 0x000000);
        shape.graphics.moveTo(0, 100);
        shape.graphics.lineTo(800, 100);
        /*** 本示例关键代码段结束 ***/
        // shape.graphics.lineStyle(20, 0xff0ff0);
        // shape.graphics.moveTo(140, 400);
        // shape.graphics.curveTo(340, 200, 480, 500);
    }
    create() {
        if (this._texture && this._config) {
            this.system = new particle.GravityParticleSystem(this._texture, this._config);
            let system = this.system;
            this.addChild(system);
            system.start();
            // system.y = 400;
            // system.x = 300;
            var angle = 0;
        }
    }
}
Main.NUM = 32;
Main.SCALE_BASE = .5;
Main.SCALE_RANGE = .5;
class MotionMode {
}
MotionMode.ROT = 0;
MotionMode.MOV = 1;


window['Main'] = Main;
//# sourceMappingURL=egret.js.map
