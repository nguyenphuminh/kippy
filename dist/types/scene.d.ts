import { Camera } from "./camera.js";
import { Entity } from "./entity.js";
export declare abstract class Scene {
    ctx?: CanvasRenderingContext2D;
    camera: Camera;
    entities: Entity[];
    init(): void;
    update(deltaTime: number): void;
    exit(): void;
    addEntity(entity: Entity): void;
    removeEntity(entity: Entity): void;
    render(): void;
}
