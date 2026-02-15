import { EntityBody } from "./physics.js";
import { Sprite } from "./sprite.js";
import { Vector2 } from "./vector.js";
export interface EntityOptions {
    sprite?: Sprite;
    position?: Vector2;
    rotation?: number;
    body?: EntityBody;
}
export declare class Entity {
    sprite?: Sprite;
    position: Vector2;
    rotation: number;
    body?: EntityBody;
    constructor(options?: EntityOptions);
    render(ctx: CanvasRenderingContext2D): void;
}
