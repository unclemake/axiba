define("pages/react/line.js",[],function(require, exports, module) {
class Line {
    constructor() {
        this.shape = new egret.Shape();
    }
    draw() {
        var shape = this.shape;
        /*** 本示例关键代码段开始 ***/
        shape.graphics.lineStyle(10, 0xFF0000);
        shape.graphics.moveTo(100, 300);
        this.pointArray.forEach(value => {
            shape.graphics.lineTo(value.x, value.y);
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Line;
class flowPoint {
    constructor() {
        this.shape = new egret.Shape();
    }
    draw() {
        var shape = this.shape;
        /*** 本示例关键代码段开始 ***/
        shape.graphics.lineStyle(10, 0xFF0000);
        this.pointArray.forEach(value => {
            shape.graphics.moveTo(value.x, value.y);
            shape.graphics.lineTo(value.x + 10, value.y);
        });
    }
    drawPoint(point, point2) {
        var graphics = this.shape.graphics;
        graphics.moveTo(point.x, point.y);
        graphics.lineTo(point.x + 10, point.y);
        for (var index = 0; index < array.length; index++) {
            var element = array[index];
        }
    }
}
exports.flowPoint = flowPoint;
});
//# sourceMappingURL=line.js.map
