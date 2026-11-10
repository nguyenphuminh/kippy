import { Vector2 } from "./vector.js";
export interface InputOptions {
    canvas: HTMLCanvasElement;
}
export declare class Input {
    canvas: HTMLCanvasElement;
    keys: Set<string>;
    keysPressed: Set<string>;
    keysReleased: Set<string>;
    pointer: Vector2;
    pointers: Set<number>;
    pointersPressed: Set<number>;
    pointersReleased: Set<number>;
    pads: (Gamepad | null)[];
    padPrev: boolean[][];
    padCurr: boolean[][];
    activePad: number;
    constructor(options: InputOptions);
    updatePointer(e: PointerEvent): void;
    pollGamepads(): void;
    update(): void;
    isKeyDown(key: string): boolean;
    isKeyPressed(key: string): boolean;
    isKeyReleased(key: string): boolean;
    isPointerDown(button?: number): boolean;
    isPointerPressed(button?: number): boolean;
    isPointerReleased(button?: number): boolean;
    isButtonDown(button: number, padIndex?: number): boolean;
    isButtonPressed(button: number, padIndex?: number): boolean;
    isButtonReleased(button: number, padIndex?: number): boolean;
    getStick(side: "left" | "right", padIndex?: number, deadzone?: number): Vector2;
}
export declare const BUTTON: {
    A: number;
    B: number;
    X: number;
    Y: number;
    LB: number;
    RB: number;
    LT: number;
    RT: number;
    SELECT: number;
    START: number;
    LS: number;
    RS: number;
    UP: number;
    DOWN: number;
    LEFT: number;
    RIGHT: number;
    HOME: number;
};
