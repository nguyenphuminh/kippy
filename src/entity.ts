import { Collider, CollisionInfo, EntityBody } from "./physics.js";
import { Sprite } from "./sprite.js";
import { Vector2 } from "./vector.js";

export interface EntityOptions {
    sprite?: Sprite;
    position?: Vector2;
    rotation?: number;
    body?: EntityBody;
    collider?: Collider;
}

export class Entity {
    // Basic entity structure
    public sprite?: Sprite;
    public position: Vector2;
    public rotation: number;
    public body?: EntityBody;
    public collider?: Collider;

    constructor(options: EntityOptions = {}) {
        this.sprite = options.sprite;
        this.position = options.position ?? new Vector2(0, 0);
        this.rotation = options.rotation ?? 0;
        this.body = options.body;
        this.collider = options.collider;
    }

    // Event handlers
    onCollisionEnter?: (other: Entity, info: CollisionInfo) => void;
    onCollisionStay?: (other: Entity, info: CollisionInfo) => void;
    onCollisionExit?: (other: Entity, info: CollisionInfo) => void;
    onTriggerEnter?: (other: Entity) => void;
    onTriggerStay?: (other: Entity) => void;
    onTriggerExit?: (other: Entity) => void;

    // Render with sprite
    render(ctx: CanvasRenderingContext2D) {
        if (this.sprite) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(
                this.sprite.texture,
                -this.sprite.width / 2,
                -this.sprite.height / 2,
                this.sprite.width,
                this.sprite.height
            );
            ctx.restore();
        }
    }
}
