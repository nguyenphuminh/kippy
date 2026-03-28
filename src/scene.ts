import { Game } from "./game.js";
import { Camera } from "./camera.js";
import { Physics } from "./physics.js";
import { Entity } from "./entity.js";

export abstract class Scene {
    // Parent game instance that this scene is mounted to
    public game?: Game;
    // Built-in systems
    public camera = new Camera({ scene: this });
    public physics = new Physics();
    // Entities list, just full entities for now
    public entities: Entity[] = [];
    
    // Entities management
    addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    removeEntity(entity: Entity) {
        this.entities = this.entities.filter(childEntities => childEntities !== entity);
    }

    // Run systems, spaghetti for now, will have proper systems and custom systems in the future
    animationUpdate(deltaTime: number) {
        for (const entity of this.entities) {
            entity.animator?.update(deltaTime);
        }
    }

    render() {
        if (this.game) {
            const ctx = this.game.ctx;;

            // Clear screen
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // Preserve canvas context
            ctx.save();

            // Apply camera config (position, zoom, rotate)
            this.camera.apply();

            for (const entity of this.entities) {
                entity.render(ctx);
            }

            // Restore so camera/entity stuff does not affect original context
            ctx.restore();
        } else {
            throw new Error("Can not render when mounted to a game instance");
        }
    }

    runSystems(dt: number) {
        // Update game logic
        this.update(dt);

        // Update animators
        this.animationUpdate(dt);

        // Update physics info
        this.physics.update(this.entities, dt);

        // Render
        this.render();
    }

    // User-defined methods
    init() { }
    update(deltaTime: number) { }
    exit() { }
}
