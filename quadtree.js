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
}