import { Sprite } from "./sprite.js";
export interface EntityOptions {
    sprite?: Sprite;
    x?: number;
    y?: number;
    rotation?: number;
}
export declare class Entity {
    sprite?: Sprite;
    x: number;
    y: number;
    rotation: number;
    constructor(options: EntityOptions);
    setSprite(sprite: Sprite): void;
    render(ctx: CanvasRenderingContext2D): void;
}
