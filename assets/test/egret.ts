export default class Main extends egret.DisplayObjectContainer {
    private _shape: egret.Shape;
    private moveShape: egret.Shape;
    private moveLineShape: egret.Shape;
    private point = [{ x: 200, y: 20 }, { x: 300, y: 20 }, { x: 300, y: 40 }]

    constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        this.initGraphics();
    }

    /**
     * 初始化
     * 
     * @private
     * 
     * @memberOf Main
     */
    private initGraphics(): void {
        let WireNew: Wire;

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

        // 能拖动的线
        WireNew = this.newWire(this.point);
        this.point.forEach(value => {
            let MovePointNew = new MovePoint(value);
            this.addChild(MovePointNew);
            MovePointNew.onMove = () => {
                WireNew.timeOnEnterFrame = 0;
            }
        })

        // 组
        var leftCon = new egret.DisplayObjectContainer();
        this.addChild(leftCon);
        let shapeWireNew = new Wire([{ x: 30, y: 120 }, { x: 150, y: 120 }]);
        leftCon.addChild(shapeWireNew);

        // 能拖动的圆
        this.moveShape = new egret.Shape();
        let MovePointNew = new MovePoint({ x: 250, y: 100 }, 30);
        leftCon.addChild(MovePointNew);
        egret.Tween.get(leftCon, { loop: true }).to({ x: 0, y: 200 }, 3000, egret.Ease.sineIn).to({ x: 0, y: 0 }, 3000, egret.Ease.sineIn);

        // 相对动画
        var shape = new egret.Shape();
        leftCon.addChild(shape);
        shape.graphics.beginFill(0xff0000);
        shape.graphics.lineStyle(2, 0xff0000);
        shape.graphics.drawCircle(350, 100, 20 + 20);
        egret.Tween.get(shape, { loop: true }).to({ x: 100, y: 0 }, 3000, egret.Ease.sineIn).to({ x: 0, y: 0 }, 3000, egret.Ease.sineIn);

        // 旋转的圆
        var shape = new egret.Shape();
        leftCon.addChild(shape);
        shape.graphics.beginFill(0xff0000);
        shape.graphics.lineStyle(2, 0xff0000);
        shape.graphics.drawRect(300, 200, 100, 100);
        egret.Tween.get(shape, { loop: true }).to({ x: 100, y: 0, rotation: 100 }, 3000, egret.Ease.sineIn).to({ x: 0, y: 0, rotation: 0 }, 3000, egret.Ease.sineIn);

    }

    /**
     * 初始化线
     * 
     * @param {PointInterface[]} point
     * @returns
     * 
     * @memberOf Main
     */
    newWire(point: PointInterface[]) {
        let wire = new Wire(point);
        this.addChild(wire);
        return wire;
    }

}
window['Main'] = Main;


/**
 * 拖动的圆
 * 
 * @class MovePoint
 * @extends {egret.DisplayObjectContainer}
 */
class MovePoint extends egret.DisplayObjectContainer {
    /**
     * 画板对象
     * 
     * @type {egret.Shape}
     * @memberOf MovePoint
     */
    shape: egret.Shape;
    _touchStatus: boolean = false;
    _distance: egret.Point = new egret.Point();
    point: PointInterface

    /**
     * 移动事件
     * 
     * 
     * @memberOf MovePoint
     */
    onMove;

    constructor(point: PointInterface, radius: number = 5) {
        super();
        this.shape = new egret.Shape();
        this.addChild(this.shape);
        let graphics = this.shape.graphics;
        graphics.beginFill(0xff0000);
        graphics.lineStyle(2, 0xff0000);
        graphics.drawCircle(0, 0, radius);
        this.shape.touchEnabled = true;
        this.shape.x = point.x;
        this.shape.y = point.y;
        this.point = point;
        this.shape.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.shape.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
    }

    private mouseDown(evt: egret.TouchEvent) {
        this._touchStatus = true;
        this._distance.x = evt.stageX - this.shape.x;
        this._distance.y = evt.stageY - this.shape.y;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
    }

    private mouseUp(evt: egret.TouchEvent) {
        this._touchStatus = false;
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
    }

    private mouseMove(evt: egret.TouchEvent) {
        if (this._touchStatus) {
            this.shape.x = evt.stageX - this._distance.x;
            this.shape.y = evt.stageY - this._distance.y;
            this.point.x = evt.stageX - this._distance.x;
            this.point.y = evt.stageY - this._distance.y;
            this.onMove && this.onMove();
        }
    }
}


interface PointInterface {
    x: number,
    y: number
}

class Wire extends egret.DisplayObjectContainer {
    /**
     * 形状对象
     * 
     * @type {egret.Shape}
     * @memberOf Wire
     */
    shape: egret.Shape;
    shapeMask: egret.Shape;
    shapeBg: egret.Shape;

    /**
     * 背景色
     * 
     * @type {number}
     * @memberOf Wire
     */
    bgColor: number = 0xFFFF33;
    /**
     * 线颜色
     * 
     * @type {number}
     * @memberOf Wire
     */
    color: number = 0xFF0000;
    /**
     * 点集合
     * 
     * @type {PointInterface[]}
     * @memberOf Wire
     */
    point: PointInterface[];
    /**
     * 偏移长度
     * 
     * @type {number}
     * @memberOf Wire
     */
    deviationLength: number = 6;
    /**
     * 虚线长短
     * 
     * @type {number}
     * @memberOf Wire
     */
    dashLength: number = 4;
    /**
     * 线宽
     * 
     * @type {number}
     * @memberOf Wire
     */
    wireWidth: number = 2;

    /**
     * 记录动画时长
     * 
     * @type {number}
     * @memberOf Wire
     */
    timeOnEnterFrame: number = 0;

    constructor(point: PointInterface[]) {
        super();
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
        this.addEventListener(egret.Event.ENTER_FRAME, (evt: egret.Event) => {
            let now = egret.getTimer();
            let pass = now - this.timeOnEnterFrame;
            if (pass > 200) {
                this.timeOnEnterFrame = now;
                if (this.deviationLength < this.dashLength * 2) {
                    this.deviationLength++;
                } else {
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
    drawDottedLine(start: PointInterface, end: PointInterface) {

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
            } else {
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
    getPointByDeviation(start: PointInterface, end: PointInterface, deviation: number) {
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
    getBeveling(x: number, y: number) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
}

