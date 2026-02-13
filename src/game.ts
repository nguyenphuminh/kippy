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
    public lastTime = 0;
    public input?: Input;

    constructor(options: GameOptions) {
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.input = options.input;
    }

    setScene(scene: Scene) {
        this.scene?.exit();
        this.scene = scene;
        this.scene.init();
    }

    setInput(input: Input) {
        this.input = input;
    }

    start() {
        requestAnimationFrame(this.loop.bind(this));
    }

    // Game loop
    loop(timestamp: number) {
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
