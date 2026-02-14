import { Input } from "./input.js";
import { Physics } from "./physics.js";
export class Game {
    canvas;
    ctx;
    scene;
    lastTime = 0;
    input;
    physics;
    constructor(options) {
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.input = options.input ?? new Input({ canvas: this.canvas });
        this.physics = options.physics ?? new Physics();
    }
    setCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    }
    setScene(scene) {
        this.scene?.exit();
        this.scene = scene;
        this.scene.init();
    }
    start() {
        requestAnimationFrame(this.loop.bind(this));
    }
    // Game loop
    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        if (this.scene) {
            // Update input info
            this.input.update();
            // Update game logic
            this.scene.update(dt);
            // Update physics info
            this.physics.update(this.scene.entities);
            // Render
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.scene.render(this.ctx);
        }
        else {
            throw new Error("Can not run game loop without a scene");
        }
        requestAnimationFrame(this.loop.bind(this));
    }
}
