import { Camera } from "./camera.js";
export class Scene {
    ctx;
    camera = new Camera({ scene: this });
    entities = [];
    init() { }
    update(deltaTime) { }
    exit() { }
    addEntity(entity) {
        this.entities.push(entity);
    }
    removeEntity(entity) {
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
