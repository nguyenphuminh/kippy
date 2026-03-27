import { Animator } from "./animation.js";
import { Collider, CollisionInfo, EntityBody } from "./physics.js";
import { Sprite } from "./sprite.js";
import { Vector2 } from "./vector.js";

export interface GlowEffect {
    color: string;
    bloom: number;
    intensity: number;
}

export interface EntityOptions {
    // Graphics
    animator?: Animator;
    sprite?: Sprite;
    // Position
    position?: Vector2;
    rotation?: number;
    // Physics
    body?: EntityBody;
    collider?: Collider;
    // Effects
    glow?: GlowEffect;
}

export class Entity {
    // Basic entity structure
    public animator?: Animator;
    public sprite?: Sprite;
    public position: Vector2;
    public rotation: number;
    public body?: EntityBody;
    public collider?: Collider;
    public glow?: GlowEffect;

    constructor(options: EntityOptions = {}) {
        this.animator = options.animator;
        this.sprite = options.sprite;
        this.position = options.position ?? new Vector2(0, 0);
        this.rotation = options.rotation ?? 0;
        this.body = options.body;
        this.collider = options.collider;
        this.glow = options.glow;
    }

    // Event handlers
    onCollisionEnter?: (other: Entity, info: CollisionInfo) => void;
    onCollisionStay?: (other: Entity, info: CollisionInfo) => void;
    onCollisionExit?: (other: Entity, info: CollisionInfo) => void;
    onTriggerEnter?: (other: Entity) => void;
    onTriggerStay?: (other: Entity) => void;
    onTriggerExit?: (other: Entity) => void;

    // Render
    drawSelf(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        if (this.animator) {
            const animation = this.animator.currentAnimation;
            const spriteSheet = animation.spriteSheet;
            const frame = this.animator.currentFrame;
            const cols = Math.floor(spriteSheet.texture.width / spriteSheet.frameWidth);
            const sx = (frame % cols) * spriteSheet.frameWidth;
            const sy = Math.floor(frame / cols) * spriteSheet.frameHeight;
            const dw = spriteSheet.width ?? spriteSheet.frameWidth;
            const dh = spriteSheet.height ?? spriteSheet.frameHeight;
            ctx.drawImage(spriteSheet.texture, sx, sy, spriteSheet.frameWidth, spriteSheet.frameHeight, -dw / 2, -dh / 2, dw, dh);
        } else if (this.sprite) {
            ctx.drawImage(this.sprite.texture, -this.sprite.width / 2, -this.sprite.height / 2, this.sprite.width, this.sprite.height);
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);

        if (this.glow) {
            const ss = this.animator?.currentAnimation.spriteSheet;
            const width = ss ? (ss.width ?? ss.frameWidth) : (this.sprite?.width ?? 0);
            const height = ss ? (ss.height ?? ss.frameHeight) : (this.sprite?.height ?? 0);

            const pad = this.glow.bloom * 2;
            const w = width + pad;
            const h = height + pad;

            const off = new OffscreenCanvas(w, h);
            const offCtx = off.getContext("2d")!;
            offCtx.translate(w / 2, h / 2);
            this.drawSelf(offCtx);

            ctx.shadowColor = this.glow.color;
            ctx.shadowBlur = this.glow.bloom;
            
            for (let i = 0; i < this.glow.intensity; i++) {
                ctx.drawImage(off, -w / 2, -h / 2);
            }

            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
        }

        this.drawSelf(ctx);
        ctx.restore();
    }
}
