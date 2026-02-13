export class Scene {
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
    render(ctx) {
        for (const entity of this.entities) {
            entity.render(ctx);
        }
    }
}
