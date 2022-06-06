const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 620;

let snowBgCanvas;
let branchCanvas;
let snowFgCanvas;

function initializeCanvas(canvasID) {
    let canvas = document.getElementById(canvasID);
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    return canvas;
}

function main() {
    snowBgCanvas = initializeCanvas("canvasSnowBackground");
    branchCanvas = initializeCanvas("canvasTreeBranches");
    snowFgCanvas = initializeCanvas("canvasSnowForeground");
    const treeLocation = [CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.95];
    drawBranches(branchCanvas, treeLocation, 100, 0, 20);
    drawLeaves(branchCanvas);
    setInterval(() => {
        handleSnowFlakes(snowBgCanvas);
        drawSnowBackground(snowBgCanvas);
    }, 50);
    drawSnowForeground(snowFgCanvas);
}
function drawLeaves(branchCanvas) {
    const ctx = branchCanvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const data = imageData.data;

    let branchPixels = [];
    for (let i = 0; i < CANVAS_HEIGHT; i++) {
        for (let j = 0; j < CANVAS_WIDTH; j++) {
            let red = data[(i * CANVAS_WIDTH + j) * 4];
            let green = data[(i * CANVAS_WIDTH + j) * 4 + 1];
            let blue = data[(i * CANVAS_WIDTH + j) * 4 + 2];
            let alpha = data[(i * CANVAS_WIDTH + j) * 4 + 3];
            if (alpha > 0 && i < CANVAS_HEIGHT * 0.95 - 100) {
                branchPixels.push([j, i]);
            }
        }
    }
    for (let i = 0; i < branchPixels.length; i++) {
        if (Math.random() < 0.3) {
            let loc = branchPixels[i];
            loc[0] += (Math.random() - 0.5) * 10;
            loc[1] += (Math.random() - 0.5) * 10;
            ctx.beginPath();
            let green = (255 * (CANVAS_HEIGHT - loc[1])) / CANVAS_HEIGHT;
            ctx.fillStyle = "rgba(0," + green + ", 0, 0.4)";
            ctx.save();
            ctx.translate(...loc);
            ctx.rotate(Math.random() * Math.PI * 2);
            ctx.arc(0, 0, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}

function drawBranches(canvas, start, length, angle, branchWidth) {
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.save();
    ctx.lineWidth = branchWidth;
    ctx.translate(...start);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.stroke();

    if (length > 10) {
        drawBranches(canvas, [0, -length], length * 0.5, 35, branchWidth * 0.7);

        drawBranches(
            canvas,
            [0, -length],
            length * 0.5,
            -35,
            branchWidth * 0.7
        );
        drawBranches(canvas, [0, -length], length * 0.8, 0, branchWidth * 0.7);
    }
    ctx.restore();
}

const snowFlakes = new Image();
snowFlakes.src = "snowflakes2.png";
class SnowFlakes {
    constructor() {
        this.x = Math.random() * CANVAS_WIDTH;
        this.y = Math.random() * CANVAS_HEIGHT;
        this.size = Math.random() * 60 + 40;
        this.speed = Math.random() * 0.5 + 0.2;
        this.frameX = Math.floor(Math.random() * 4);
        this.frameY = Math.floor(Math.random() * 4);
        this.frameSize = 250;
        this.angle = 0;
        this.spin = Math.random() < 0.5 ? 2 : -2;
    }
    update() {
        this.y += this.speed * 10;
        if (this.y - this.size > CANVAS_HEIGHT) this.y = 0 - this.size;
        this.angle += this.spin;
    }
    draw(canvas) {
        const ctx = canvas.getContext("2d");
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.drawImage(
            snowFlakes,
            this.frameX * this.frameSize,
            this.frameY * this.frameSize,
            this.frameSize,
            this.frameSize,
            0 - this.size / 2,
            0 - this.size / 2,
            this.size,
            this.size
        );
        ctx.restore();
    }
}
const snowFlakesArray = [];
for (let i = 0; i < 20; i++) {
    snowFlakesArray.push(new SnowFlakes());
}
function handleSnowFlakes(canvas) {
    clear(canvas);

    for (let i = 0; i < snowFlakesArray.length; i++) {
        snowFlakesArray[i].update();
        snowFlakesArray[i].draw(canvas);
    }
}

function clear(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function drawSnowBackground(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT);
    ctx.lineTo(0, CANVAS_WIDTH - 20);
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.strokeStyle = "rgba(0, 0, 255, 0.9)";
    ctx.quadraticCurveTo(
        CANVAS_WIDTH,
        CANVAS_WIDTH - 30,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
    );
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_WIDTH - 30);
    ctx.quadraticCurveTo(0, CANVAS_WIDTH + 30, 0, CANVAS_HEIGHT);
    ctx.fill();
    ctx.stroke();
}
function drawSnowForeground(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT);
    ctx.lineTo(0, CANVAS_WIDTH + 20);
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.strokeStyle = "rgba(0, 0, 255, 0.9)";
    ctx.quadraticCurveTo(
        CANVAS_WIDTH,
        CANVAS_WIDTH + 20,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
    );
    ctx.fill();
    ctx.stroke();
}
