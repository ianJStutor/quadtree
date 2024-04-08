export default class QuadTree {
    #defaultCapacity = 6;
    #maxDepth = 8;

    constructor(bounds, capacity = this.#defaultCapacity, depth = 1) {
        this.bounds = new Rect(bounds);
        this.capacity = Math.max(Number(capacity), 1) || this.#defaultCapacity;
        this.points = [];
        this.depth = depth;
    }

    insert(point) {
        if (!Point.isValid(point)) throw TypeError("Not a valid point", point);
        //not yet divided
        if (Array.isArray(this.points)) {
            //in bounds?
            if (!this.bounds.contains(point)) return false;
            //insert
            this.points.push(point);
            if (
                this.points.length > this.capacity && 
                this.depth < this.#maxDepth
            ) this.#divide();
            return true;
        }
        //divided
        return (
            this.nw.insert(point) || 
            this.ne.insert(point) || 
            this.sw.insert(point) || 
            this.se.insert(point)
        );
    }

    #divide() {
        const { nw, ne, sw, se } = this.bounds.divide();
        this.nw = new QuadTree(nw, this.capacity, this.depth+1);
        this.ne = new QuadTree(ne, this.capacity, this.depth+1);
        this.sw = new QuadTree(sw, this.capacity, this.depth+1);
        this.se = new QuadTree(se, this.capacity, this.depth+1);
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
        if (!Point.isValid(pt)) throw TypeError("Not a valid point", pt);
        //not yet divided
        if (Array.isArray(this.points)) {
            if (!this.bounds.intersectsWithCircle(pt, maxDist)) return found;
            const rSq = maxDist * maxDist;
            for (let p of this.points) {
                if (Point.sqDistance(pt, p) <= rSq) found.push(p);
            }
            return found;
        }
        //divided
        return [
            ...found,
            ...this.nw.getPoints(pt, maxDist),
            ...this.ne.getPoints(pt, maxDist),
            ...this.sw.getPoints(pt, maxDist),
            ...this.se.getPoints(pt, maxDist)
        ];
    }

    getRects(rects = []) {
        //not yet divided
        if (Array.isArray(this.points)) {
            return [...rects, {
                x: this.bounds.x,
                y: this.bounds.y,
                w: this.bounds.w,
                h: this.bounds.h
            }];
        }
        //divided
        return [
            ...rects,
            ...this.nw.getRects(),
            ...this.ne.getRects(),
            ...this.sw.getRects(),
            ...this.se.getRects()
        ];
    }

    empty() {
        this.points = [];
        if (this.nw) delete this.nw;
        if (this.ne) delete this.ne;
        if (this.sw) delete this.sw;
        if (this.se) delete this.se;
        return true;
    }
}

class Point {
    static isValid(...pts) {
        return pts.reduce((a,b) => (a && b.x !== undefined && b.y !== undefined), true);
    }
    static sqDistance(pt1, pt2) {
        if (!Point.isValid(pt1, pt2)) return NaN;
        const dx = pt1.x - pt2.x;
        const dy = pt1.y - pt2.y;
        return dx * dx + dy * dy;
    }
    distance(pt1, pt2) {
        return Math.sqrt(Point.sqDistance(pt1, pt2));
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
        if (!Point.isValid(pt)) throw TypeError("Not a valid point", pt);
        return this.x <= pt.x && this.x+this.w >= pt.x &&
                this.y <= pt.y && this.y+this.h >= pt.y;
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
        if (!(Point.isValid(pt))) throw TypeError("Not a valid point", pt);
        if (this.contains(pt)) return true;
        //circle intersects side of Rect?
        const distX = Math.abs(pt.x-this.x);
        if (distX > (r+this.w/2)) return false;
        const distY = Math.abs(pt.y-this.y);
        if (distY > (r+this.h/2)) return false;
        //circle exactly intersects corner of Rect?
        const rectCenter = {x: this.x + this.w/2, y: this.y + this.h/2};
        const diagSquared = Point.sqDistance(rectCenter, {x: this.x, y: this.y});
        return Point.sqDistance(rectCenter, pt) <= diagSquared + r * r;
    }
}