import { Entity } from "./entity.js";

export abstract class Scene {
    public entities: Entity[] = [];

    init() { }

    update(deltaTime: number) { }

    exit() { }

    addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    removeEntity(entity: Entity) {
        this.entities = this.entities.filter(childEntities => childEntities !== entity);
    }

    render(ctx: CanvasRenderingContext2D) {
        for (const entity of this.entities) {
            entity.render(ctx);
        }
    }
}
