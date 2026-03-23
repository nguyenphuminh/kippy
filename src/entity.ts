import { Animator } from "./animation.js";
import { Collider, CollisionInfo, EntityBody } from "./physics.js";
import { Sprite } from "./sprite.js";
import { Vector2 } from "./vector.js";

export interface EntityOptions {
    animator?: Animator;
    sprite?: Sprite;
    position?: Vector2;
    rotation?: number;
    body?: EntityBody;
    collider?: Collider;
}

export class Entity {
    // Basic entity structure
    public animator?: Animator;
    public sprite?: Sprite;
    public position: Vector2;
    public rotation: number;
    public body?: EntityBody;
    public collider?: Collider;

    constructor(options: EntityOptions = {}) {
        this.animator = options.animator;
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

    // Render
    render(ctx: CanvasRenderingContext2D) {
        // If there is an animator
        if (this.animator) {
            const animation = this.animator.currentAnimation;
            const spriteSheet = animation.spriteSheet;
            const frame = this.animator.currentFrame;

            const cols = Math.floor(spriteSheet.texture.width / spriteSheet.frameWidth);
            const sx = (frame % cols) * spriteSheet.frameWidth;
            const sy = Math.floor(frame / cols) * spriteSheet.frameHeight;

            const dw = spriteSheet.width ?? spriteSheet.frameWidth;
            const dh = spriteSheet.height ?? spriteSheet.frameHeight;

            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(
                spriteSheet.texture,
                sx, sy, spriteSheet.frameWidth, spriteSheet.frameHeight,
                -dw / 2, -dh / 2, dw, dh
            );
            ctx.restore();
        }
        // If there is a static sprite
        else if (this.sprite) {
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
