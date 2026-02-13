import { Input } from "./input.js";
import { Scene } from "./scene.js";
export interface GameOptions {
    canvas: HTMLCanvasElement;
    input?: Input;
}
export declare class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    scene?: Scene;
    lastTime: number;
    input?: Input;
    constructor(options: GameOptions);
    setScene(scene: Scene): void;
    setInput(input: Input): void;
    start(): void;
    loop(timestamp: number): void;
}
