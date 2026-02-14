export interface InputOptions {
    canvas: HTMLCanvasElement;
}
export declare class Input {
    canvas: HTMLCanvasElement;
    keys: Set<string>;
    keysPressed: Set<string>;
    keysReleased: Set<string>;
    pointerX: number;
    pointerY: number;
    pointers: Set<number>;
    pointersPressed: Set<number>;
    pointersReleased: Set<number>;
    constructor(options: InputOptions);
    update(): void;
    isKeyDown(key: string): boolean;
    isKeyPressed(key: string): boolean;
    isKeyReleased(key: string): boolean;
    isPointerDown(button?: number): boolean;
    isPointerPressed(button?: number): boolean;
    isPointerReleased(button?: number): boolean;
}
