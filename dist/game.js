import { Input } from "./input.js";
import { Physics } from "./physics.js";
export class Game {
    canvas;
    ctx;
    scene;
    lastTime = 0;
    input;
    physics;
    paused = false;
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
        scene.ctx = this.ctx;
        this.scene = scene;
        this.scene.init();
    }
    start() {
        window.addEventListener("blur", () => {
            this.paused = true;
        });
        window.addEventListener("focus", () => {
            this.paused = false;
            this.lastTime = performance.now(); // Reset!
        });
        requestAnimationFrame(this.loop.bind(this));
    }
    // Game loop
    loop(timestamp) {
        if (this.paused) {
            requestAnimationFrame(this.loop.bind(this));
            return;
        }
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        if (this.scene) {
            // Update game logic
            this.scene.update(dt);
            // Update physics info
            this.physics.update(this.scene.entities, dt);
            // Render
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.scene.render();
            // Update input info
            this.input.update();
        }
        else {
            throw new Error("Can not run game loop without a scene");
        }
        requestAnimationFrame(this.loop.bind(this));
    }
}
