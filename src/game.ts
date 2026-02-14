import { Input } from "./input.js";
import { Physics } from "./physics.js";
import { Scene } from "./scene.js";

export interface GameOptions {
    canvas: HTMLCanvasElement;
    input?: Input;
    physics?: Physics;
}

export class Game {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public scene?: Scene;
    public lastTime = 0;
    public input: Input;
    public physics: Physics;

    constructor(options: GameOptions) {
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.input = options.input ?? new Input({ canvas: this.canvas });
        this.physics = options.physics ?? new Physics();
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
        } else {
            throw new Error("Can not run game loop without a scene");
        } 

        requestAnimationFrame(this.loop.bind(this));
    }
}
