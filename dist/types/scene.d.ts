import { Game } from "./game.js";
import { Camera } from "./camera.js";
import { Physics } from "./physics.js";
import { Entity } from "./entity.js";
export declare abstract class Scene {
    game?: Game;
    camera: Camera;
    physics: Physics;
    entities: Entity[];
    addEntity(entity: Entity): void;
    removeEntity(entity: Entity): void;
    animationUpdate(deltaTime: number): void;
    render(): void;
    runSystems(dt: number): void;
    init(): void;
    update(deltaTime: number): void;
    exit(): void;
}
