import QuadTree from "./quadtree.js";

//state vars (dependent on canvas size)
let qt;
let particles;

//settings (relative to canvas size)
let numParticles;
let minRadius;
let maxRadius;
let minVelocity;
let maxVelocity;

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
}

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
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "silver";
    for (let {x,y,w,h} of qt.getRects()) {
        ctx.strokeRect(x, y, w, h);
    }
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
