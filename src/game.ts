import { Input } from "./input.js";
import { Scene } from "./scene.js";

export interface GameOptions {
    canvas: HTMLCanvasElement;
    input?: Input;
}

export class Game {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public scene?: Scene;
    public input: Input;
    public lastTime = 0;
    public paused = false;

    constructor(options: GameOptions) {
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.input = options.input ?? new Input({ canvas: this.canvas });
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }

    setScene(scene: Scene) {
        this.scene?.exit();
        scene.game = this;
        this.scene = scene;
        this.scene.init();
    }

    start() {
        // These events prevent delta time accumulation by pausing the game when we leave the current tab
        window.addEventListener("blur", () => {
            this.paused = true;
        });

        window.addEventListener("focus", () => {
            this.paused = false;
            this.lastTime = performance.now();
        });

        // Start game loop, non-blocking, updated before the next repaint
        requestAnimationFrame(this.loop.bind(this));
    }

    // Game loop
    loop(timestamp: number) {
        // Does not continue until game is unpaused
        if (this.paused) {
            requestAnimationFrame(this.loop.bind(this));
            return;
        }

        // Delta time calculation
        if (this.lastTime === 0) this.lastTime = timestamp;
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Scene update
        if (this.scene) {
            // Update scene
            this.scene.runSystems(dt);
            // Update input
            this.input.update();
        } else {
            throw new Error("Can not run game loop without a scene");
        }

        // Loop
        requestAnimationFrame(this.loop.bind(this));
    }
}
