import { Entity } from "./entity.js";
export declare abstract class Scene {
    entities: Entity[];
    init(): void;
    update(deltaTime: number): void;
    exit(): void;
    addEntity(entity: Entity): void;
    removeEntity(entity: Entity): void;
    render(ctx: CanvasRenderingContext2D): void;
}
