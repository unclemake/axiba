define("test/egret.2.js",[],function(require, exports, module) {
class Main extends egret.DisplayObjectContainer {
    constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    onAddToStage(event) {
        this.initGraphics();
    }
    //初始化赋值
    initGraphics() {
        let WireNew;
        // 弯线
        this.newWire([{ x: 30, y: 25 }, { x: 60, y: 50 }, { x: 90, y: 25 }, { x: 120, y: 50 }, { x: 150, y: 25 }]);
        this.newWire([{ x: 30, y: 25 }, { x: 60, y: 50 }, { x: 90, y: 25 }]);
        // // 三条线
        this.newWire([{ x: 30, y: 60 }, { x: 150, y: 60 }]);
        WireNew = this.newWire([{ x: 30, y: 62 }, { x: 150, y: 62 }]);
        WireNew.deviationLength = 4;
        this.newWire([{ x: 30, y: 64 }, { x: 150, y: 64 }]);
        // 修改颜色
        WireNew = this.newWire([{ x: 30, y: 90 }, { x: 150, y: 90 }, { x: 150, y: 120 }]);
        WireNew.color = 0x009933;
        WireNew.bgColor = 0x99FFFF;
        WireNew.wireWidth = 4;
        // 组
        var shape = new egret.Shape();
        var leftCon = new egret.DisplayObjectContainer();
        this.addChild(leftCon);
        leftCon.addChild(shape);
        let shapeWireNew = new Wire([{ x: 30, y: 120 }, { x: 150, y: 120 }]);
        leftCon.addChild(shapeWireNew);
        // 画圆
        shape.graphics.beginFill(0xff0000 + Math.floor(Math.random() * 100) * (0xffffff / 100), 1);
        shape.graphics.lineStyle(2, 0xff0000 + Math.floor(Math.random() * 100) * (0xffffff / 100));
        shape.graphics.drawCircle(250, 100, Math.random() * 20 + 20);
        egret.Tween.get(leftCon, { loop: true }).to({ x: 0, y: 200 }, 3000, egret.Ease.sineIn).to({ x: 0, y: 0 }, 3000, egret.Ease.sineIn);
        // 相对动画
        var shape = new egret.Shape();
        leftCon.addChild(shape);
        shape.graphics.beginFill(0xff0000);
        shape.graphics.lineStyle(2, 0xff0000);
        shape.graphics.drawCircle(350, 100, 20 + 20);
        egret.Tween.get(shape, { loop: true }).to({ x: 100, y: 0 }, 3000, egret.Ease.sineIn).to({ x: 0, y: 0 }, 3000, egret.Ease.sineIn);
        var shape = new egret.Shape();
        leftCon.addChild(shape);
        shape.graphics.beginFill(0xff0000);
        shape.graphics.lineStyle(2, 0xff0000);
        shape.graphics.drawRect(300, 200, 100, 100);
        egret.Tween.get(shape, { loop: true }).to({ x: 100, y: 0, rotation: 100 }, 3000, egret.Ease.sineIn).to({ x: 0, y: 0, rotation: 0 }, 3000, egret.Ease.sineIn);
    }
    newWire(point) {
        let wire = new Wire(point);
        this.addChild(wire);
        return wire;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Main;
window['Main'] = Main;
class Wire extends egret.DisplayObjectContainer {
    constructor(point) {
        super();
        /**
         * 背景色
         *
         * @type {number}
         * @memberOf Wire
         */
        this.bgColor = 0xFFFF33;
        /**
         * 线颜色
         *
         * @type {number}
         * @memberOf Wire
         */
        this.color = 0xFF0000;
        /**
         * 偏移长度
         *
         * @type {number}
         * @memberOf Wire
         */
        this.deviationLength = 6;
        /**
         * 虚线长短
         *
         * @type {number}
         * @memberOf Wire
         */
        this.dashLength = 4;
        /**
         * 线宽
         *
         * @type {number}
         * @memberOf Wire
         */
        this.wireWidth = 2;
        /**
         * 记录动画时长
         *
         * @type {number}
         * @memberOf Wire
         */
        this.timeOnEnterFrame = 0;
        this.shape = new egret.Shape();
        this.shapeMask = new egret.Shape();
        this.shapeBg = new egret.Shape();
        this.shape.mask = this.shapeMask;
        this.addChild(this.shapeBg);
        this.addChild(this.shape);
        this.addChild(this.shapeMask);
        this.point = point;
        this.animation();
        this.draw();
    }
    /**
     * 启动帧动画
     *
     *
     * @memberOf Wire
     */
    animation() {
        this.addEventListener(egret.Event.ENTER_FRAME, (evt) => {
            let now = egret.getTimer();
            let pass = now - this.timeOnEnterFrame;
            if (pass > 200) {
                this.timeOnEnterFrame = now;
                if (this.deviationLength < this.dashLength * 2) {
                    this.deviationLength++;
                }
                else {
                    this.deviationLength = -this.dashLength * 2 + 1;
                }
                this.draw();
            }
        }, this);
    }
    /**
     * 编列画线
     *
     *
     * @memberOf Wire
     */
    draw() {
        this.shapeMask.graphics.clear();
        this.shape.graphics.clear();
        this.shapeBg.graphics.clear();
        let shape = this.shape;
        for (let index = 0; index < this.point.length - 1; index++) {
            this.drawDottedLine(this.point[index], this.point[index + 1]);
        }
    }
    /**
     * 画线
     *
     * @param {PointInterface} start
     * @param {PointInterface} end
     *
     * @memberOf Wire
     */
    drawDottedLine(start, end) {
        var shape = this.shapeBg;
        // 画背景
        shape.graphics.lineStyle(this.wireWidth, this.bgColor);
        shape.graphics.moveTo(start.x, start.y);
        shape.graphics.lineTo(end.x, end.y);
        var shape = this.shape;
        // 得到总长度  
        let beveling = this.getBeveling(end.x - start.x, end.y - start.y);
        // 计算有多少个线段  
        let num = Math.floor(beveling / this.dashLength / 2);
        // 画背景
        shape.graphics.lineStyle(this.wireWidth, this.color);
        shape.graphics.moveTo(start.x, start.y);
        shape.graphics.lineTo(end.x, end.y);
        // 计算起点
        let deviation = this.getPointByDeviation(start, end, this.deviationLength);
        // console.log(start);
        // console.log(end);
        // console.log(deviation);
        let startPoint = deviation.start;
        let endPoint = deviation.end;
        var shape = this.shapeMask;
        shape.graphics.moveTo(startPoint.x, startPoint.y);
        shape.graphics.lineStyle(this.wireWidth, this.color);
        for (var index = 0; index <= num + 2; index++) {
            let x = startPoint.x + (endPoint.x - startPoint.x) / num * index;
            let y = startPoint.y + (endPoint.y - startPoint.y) / num * index;
            if (this.deviationLength < 0 && index === 0) {
                x = start.x;
                y = start.y;
            }
            if (index % 2 == 0) {
                shape.graphics.moveTo(x, y);
            }
            else {
                shape.graphics.lineTo(x, y);
            }
        }
        // console.log(this.deviationLength);
    }
    /**
     * 根据偏移获取坐标
     *
     * @param {PointInterface} start
     * @param {PointInterface} end
     * @param {number} deviation
     * @returns
     *
     * @memberOf Wire
     */
    getPointByDeviation(start, end, deviation) {
        let beveling = this.getBeveling(end.x - start.x, end.y - start.y);
        let proportion = deviation / beveling;
        return {
            start: {
                x: start.x == end.x ? start.x : (end.x - start.x) * proportion + start.x,
                y: start.y == end.y ? start.y : (end.y - start.y) * proportion + start.y
            },
            end: {
                x: start.x == end.x ? start.x : (end.x - start.x) * proportion + end.x,
                y: start.y == end.y ? start.y : (end.y - start.y) * proportion + end.y
            }
        };
    }
    /**
     * 获得长度
     *
     * @param {any} x
     * @param {any} y
     * @returns
     *
     * @memberOf Wire
     */
    getBeveling(x, y) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
}
});
//# sourceMappingURL=egret.2.js.map
