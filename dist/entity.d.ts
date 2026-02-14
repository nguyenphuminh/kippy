import { EntityBody } from "./physics.js";
import { Sprite } from "./sprite.js";
export interface EntityOptions {
    sprite?: Sprite;
    x?: number;
    y?: number;
    rotation?: number;
    body?: EntityBody;
}
export declare class Entity {
    sprite?: Sprite;
    x: number;
    y: number;
    rotation: number;
    body?: EntityBody;
    constructor(options?: EntityOptions);
    render(ctx: CanvasRenderingContext2D): void;
}
