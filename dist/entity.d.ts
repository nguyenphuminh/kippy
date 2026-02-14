import { RigidBody } from "./physics.js";
import { Sprite } from "./sprite.js";
export interface EntityOptions {
    sprite?: Sprite;
    x?: number;
    y?: number;
    rotation?: number;
    body?: RigidBody;
}
export declare class Entity {
    sprite?: Sprite;
    x: number;
    y: number;
    rotation: number;
    body?: RigidBody;
    constructor(options?: EntityOptions);
    setSprite(sprite: Sprite): void;
    render(ctx: CanvasRenderingContext2D): void;
}
