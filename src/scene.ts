import { Camera } from "./camera.js";
import { Entity } from "./entity.js";

export abstract class Scene {
    public ctx?: CanvasRenderingContext2D;
    public camera: Camera = new Camera({ scene: this });
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

    render() {
        const ctx = this.ctx;

        if (ctx) {
            // Preserve canvas context
            ctx.save();

            // Apply camera config (position, zoom, rotate)
            this.camera.apply();

            for (const entity of this.entities) {
                entity.render(ctx);
            }

            // Restore so camera/entity stuff does not affect original context
            ctx.restore();
        }
    }
}
