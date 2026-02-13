export class Game {
    canvas;
    ctx;
    scene;
    lastTime = 0;
    input;
    constructor(options) {
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.input = options.input;
    }
    setScene(scene) {
        this.scene?.exit();
        this.scene = scene;
        this.scene.init();
    }
    setInput(input) {
        this.input = input;
    }
    start() {
        requestAnimationFrame(this.loop.bind(this));
    }
    // Game loop
    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        // Update state, clear canvas, re-render
        this.scene?.update(dt);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.scene?.render(this.ctx);
        // Update input info
        this.input?.update();
        requestAnimationFrame(this.loop.bind(this));
    }
}
