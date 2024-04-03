export default class QuadTree {

    constructor() {}

}

class Point {
    constructor({x,y}, data = {}) {
        this.x = x;
        this.y = y;
        this.data = data;
    }
    sqDistanceTo(pt) {
        if (pt instanceof Point) {
            const dx = pt.x - this.x;
            const dy = pt.y - this.y;
            return dx * dx + dy * dy;
        }
    }
    distanceTo(pt) {
        if (pt instanceof Point) {
            return Math.sqrt(this.sqDistanceTo(pt));
        }
    }
}

class Rect {
    constructor({x = 0, y = 0, w, width, h, height}) {
        this.x = x;
        this.y = y;
        this.w = w ?? width;
        this.h = h ?? height;
    }
    contains(pt) {
        if (pt instanceof Point) {
            return this.x <= pt.x && this.x+this.w >= pt.x &&
                    this.y <= pt.y && this.y+this.h >= pt.y;
        }
    }
    divide() {
        const w = this.w/2;
        const h = this.h/2;
        return {
            nw: new Rect({x: this.x, y: this.y, w, h}),
            ne: new Rect({x: this.x+w, y: this.y, w, h}),
            sw: new Rect({x: this.x, y: this.y+h, w, h}),
            se: new Rect({x: this.x+w, y: this.y+h, w, h})
        };
    }
}