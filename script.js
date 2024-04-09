import QuadTree from "./quadtree.js";

//state vars (dependent on canvas size)
let qt;
let particles;
let pointer = {x:0, y:0};

//settings (relative to canvas size)
let numParticles;
let minRadius;
let maxRadius;
let minVelocity;
let maxVelocity;
let pointerRadius;

//canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    qt = new QuadTree(canvas);
    numParticles = Math.floor(canvas.width*canvas.height/4500);
    maxRadius = Math.min(canvas.width, canvas.height)/75;
    minRadius = maxRadius/2;
    maxVelocity = maxRadius/3;
    minVelocity = maxVelocity/3;
    particles = Array(numParticles).fill().map(getParticle);
    pointerRadius = maxRadius * 10;
}
canvas.addEventListener("pointermove", ({x,y}) => pointer = {x,y});
canvas.addEventListener("touchmove", ({touches}) => pointer = {x: touches[0].clientX, y: touches[0].clientY});

//particles
function getParticle() {
    const { width: w, height: h } = canvas;
    const r = Math.random() * (maxRadius - minRadius) + minRadius;
    const a = Math.random() * Math.PI * 2;
    const v = Math.random() * (maxVelocity - minVelocity) + minVelocity;
    return {
        x: Math.random() * (w - 2 * r) + r,
        y: Math.random() * (h - 2 * r) + r,
        r,
        vx: v * Math.cos(a),
        vy: v * Math.sin(a),
        hue: Math.floor(Math.random() * 360),
        sat: 100,
        lit: 15
    };
}
function updateParticle(p) {
    p.lit = 15;
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < p.r) {
        p.x = p.r;
        p.vx *= -1;
    } else if (p.x > canvas.width - p.r) {
        p.x = canvas.width - p.r;
        p.vx *= -1;
    }
    if (p.y < p.r) {
        p.y = p.r;
        p.vy *= -1;
    } else if (p.y > canvas.height - p.r) {
        p.y = canvas.height - p.r;
        p.vy *= -1;
    }
}
function drawParticle(p) {
    ctx.fillStyle = `hsl(${p.hue}deg, ${p.sat}%, ${p.lit}%)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
}

//loop
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    qt.empty();
    for (let p of particles) {
        updateParticle(p);
        qt.insert(p);
    }
    for (let p of particles) {
        let pts = qt.getPoints(p, p.r+maxRadius).filter(pt => pt.x !== p.x && pt.y !== p.y);
        if (!pts.length) continue;
        [p.vx, p.vy, pts[0].vx, pts[0].vy] = [pts[0].vx, pts[0].vy, p.vx, p.vy];
        p.lit = 50;
        pts[0].lit = 50;
    }
    for (let p of particles) {
        drawParticle(p);
    }
    for (let rect of qt.getRects()) {
        let {x,y,w,h} = rect;
        if ((new Rect(rect)).intersectsWithCircle(pointer, pointerRadius)) {
            ctx.strokeStyle = "cyan";
            ctx.lineWidth = 4;
        }
        else {
            ctx.strokeStyle = "silver";
            ctx.lineWidth = 0.5;
        }
        ctx.strokeRect(x, y, w, h);
    }
    const pointerPoints = qt.getPoints(pointer, pointerRadius);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#ffffffaa";
    for (let p of pointerPoints) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.stroke();
    }
    ctx.strokeStyle = "#ff0000aa";
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, pointerRadius, 0, Math.PI*2);
    ctx.stroke();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);


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
        const distX = Math.abs(pt.x-(this.x+this.w/2));
        if (this.y <= pt.y && this.y+this.h >= pt.y && distX < (r+this.w/2)) return true;
        const distY = Math.abs(pt.y-(this.y+this.h/2));
        if (this.x <= pt.x && this.x+this.w >= pt.x && distY < (r+this.h/2)) return true;
        //circle intersects corner of Rect?
        const nearestCorner = {x:0,y:0};
        if (pt.x < this.x) nearestCorner.x = this.x;
        else if (pt.x > this.x+this.w) nearestCorner.x = this.x+this.w;
        if (pt.y < this.y) nearestCorner.y = this.y;
        else if (pt.y > this.y+this.h) nearestCorner.y = this.y+this.h;
        const cornerDistSq = Point.sqDistance(pt, nearestCorner);
        return cornerDistSq <= r * r;
    }
}
