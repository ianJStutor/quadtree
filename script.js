import QuadTree from "./quadtree.js";

//canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

//particles
const numParticles = 500;
const minRadius = 5;
const maxRadius = 25;
const minVelocity = 2;
const maxVelocity = 6;
const particles = Array(numParticles).fill().map(getParticle);
function getParticle() {
    const { width: w, height: h } = canvas;
    const r = Math.random()*(maxRadius-minRadius)+minRadius;
    const a = Math.random()*Math.PI*2;
    const v = Math.random()*(maxVelocity-minVelocity)+minVelocity;
    return {
        x: Math.random()*(w-2*r)+r,
        y: Math.random()*(h-2*r)+r,
        r,
        vx: v*Math.cos(a),
        vy: v*Math.sin(a),
        hue: Math.floor(Math.random()*360),
        sat: 100,
        lit: 95
    };
}
function updateParticle(p) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < p.r) {
        p.x = p.r;
        p.vx *= -1;
    }
    else if (p.x > canvas.width-p.r) {
        p.x = canvas.width-p.r;
        p.vx *= -1;
    }
    if (p.y < p.r) {
        p.y = p.r;
        p.vy *= -1;
    }
    else if (p.y > canvas.height-p.r) {
        p.y = canvas.height-p.r;
        p.vy *= -1;
    }
}
function drawParticle(p) {
    ctx.fillStyle = `hsl(${p.hue}deg, ${p.sat}%, ${p.lit}%)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
}

//loop
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
        updateParticle(p);
        drawParticle(p);
    }
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);