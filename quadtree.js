export default class QuadTree {
    #defaultCapacity = 6;

    constructor(bounds, capacity = this.#defaultCapacity) {
        this.bounds = new Rect(bounds);
        this.capacity = Math.max(Number(capacity), 1) || 1;
        this.points = [];
    }

    insert(point) {
        const pt = new Point(point);
        //not yet divided
        if (Array.isArray(this.points)) {
            //in bounds?
            if (!this.bounds.contains(pt)) return false;
            //insert
            this.points.push(pt);
            if (this.points.length >= this.capacity) this.divide();
            return true;
        }
        //divided
        return (
            this.nw.insert(pt) || 
            this.ne.insert(pt) || 
            this.sw.insert(pt) || 
            this.se.insert(pt)
        );
    }

    divide() {
        const { nw, ne, sw, se } = this.bounds.divide();
        this.nw = new QuadTree(nw, this.capacity);
        this.ne = new QuadTree(ne, this.capacity);
        this.sw = new QuadTree(sw, this.capacity);
        this.se = new QuadTree(se, this.capacity);
        for (let pt of this.points) {
            if (this.nw.insert(pt) ||
                this.ne.insert(pt) ||
                this.sw.insert(pt) ||
                this.se.insert(pt)) continue;
            throw Error("Cannot insert point", pt);
        }
        this.points = null;
    }

    getPoints(pt, maxDist, found = []) {
        if (!(pt instanceof Point)) pt = new Point(pt);
        //not yet divided
        if (Array.isArray(this.points)) {
            if (!this.bounds.intersectsWithCircle(pt, maxDist)) return found;
            const rSq = maxDist * maxDist;
            for (let p of this.points) {
                if (pt.sqDistanceTo(p) <= rSq) found.push({x: p.x, y: p.y, data: p.data});
            }
            return found;
        }
        //divided
        return [
            ...found,
            ...this.nw.getPoints(pt, maxDist, found),
            ...this.ne.getPoints(pt, maxDist, found),
            ...this.sw.getPoints(pt, maxDist, found),
            ...this.se.getPoints(pt, maxDist, found)
        ];
    }
}

class Point {
    constructor({ x, y, data = {} }) {
        if (x === undefined || y === undefined) throw TypeError("Incorrect Point args");
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

/**
 * x,y is top-left corner of rectangle, not center
 */
class Rect {
    constructor({ x = 0, y = 0, w, width, h, height }) {
        if (!(w ?? width) || !(h ?? height)) throw TypeError("Incorrect Rect args");
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
            nw: {x: this.x, y: this.y, w, h},
            ne: {x: this.x+w, y: this.y, w, h},
            sw: {x: this.x, y: this.y+h, w, h},
            se: {x: this.x+w, y: this.y+h, w, h}
        };
    }
    intersectsWithCircle(pt, r) {
        //circle center within Rect?
        if (!(pt instanceof Point)) pt = new Point(pt);
        if (this.contains(pt)) return true;
        //circle intersects side of Rect?
        const distX = Math.abs(pt.x-this.x);
        if (distX > (r+this.w/2)) return false;
        const distY = Math.abs(pt.y-this.y);
        if (distY > (r+this.h/2)) return false;
        //circle exactly intersects corner of Rect?
        const rectCenter = new Point({x: this.x + this.w/2, y: this.y + this.h/2});
        const diagSquared = rectCenter.sqDistanceTo(new Point({x: this.x, y: this.y}));
        return pt.sqDistanceTo(rectCenter) <= diagSquared + r * r;
    }
    toObject() {
        return {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        };
    }
}