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
    input: Input;
    lastTime: number;
    paused: boolean;
    constructor(options: GameOptions);
    setCanvas(canvas: HTMLCanvasElement): void;
    setScene(scene: Scene): void;
    start(): void;
    loop(timestamp: number): void;
}
