import { Input } from "./input.js";
import { Physics } from "./physics.js";
import { Scene } from "./scene.js";
export interface GameOptions {
    canvas: HTMLCanvasElement;
    input?: Input;
    physics?: Physics;
}
export declare class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    scene?: Scene;
    lastTime: number;
    input: Input;
    physics: Physics;
    constructor(options: GameOptions);
    setScene(scene: Scene): void;
    setInput(input: Input): void;
    start(): void;
    loop(timestamp: number): void;
}
