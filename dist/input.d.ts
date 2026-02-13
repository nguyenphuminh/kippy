export interface InputOptions {
    canvas: HTMLCanvasElement;
}
export declare class Input {
    canvas: HTMLCanvasElement;
    keys: Set<string>;
    keysPressed: Set<string>;
    keysReleased: Set<string>;
    mouseX: number;
    mouseY: number;
    mouseButtons: Set<number>;
    mousePressed: Set<number>;
    mouseReleased: Set<number>;
    constructor(options: InputOptions);
    update(): void;
    isKeyDown(key: string): boolean;
    isKeyPressed(key: string): boolean;
    isKeyReleased(key: string): boolean;
    isMouseDown(button?: number): boolean;
    isMousePressed(button?: number): boolean;
    isMouseReleased(button?: number): boolean;
}
