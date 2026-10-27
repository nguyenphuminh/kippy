import { Animator } from "./animation.js";
import { Collider, CollisionInfo, EntityBody } from "./physics.js";
import { Sprite, Texture } from "./sprite.js";
import { Vector2 } from "./vector.js";

export interface GlowEffect {
    color: string;
    bloom: number;
    intensity: number;
}

export interface FrameSource {
    texture: Texture;
    sx: number;
    sy: number;
    sw: number;
    sh: number;
    dw: number;
    dh: number;
}

// Baked glow images, shared by every entity that draws the same frame with the same glow
const glowCache = new WeakMap<Texture, Map<string, { image: OffscreenCanvas; pad: number }>>();
 
function getGlowImage(frame: FrameSource, glow: GlowEffect) {
    let byTexture = glowCache.get(frame.texture);

    if (!byTexture) {
        byTexture = new Map();
        glowCache.set(frame.texture, byTexture);
    }
 
    const key = (
        `${frame.sx},` +
        `${frame.sy},` +
        `${frame.sw},` +
        `${frame.sh},` +
        `${frame.dw},` +
        `${frame.dh},` +
        `${glow.color},` +
        `${glow.bloom},` +
        `${glow.intensity}`
    );
    let baked = byTexture.get(key);
 
    if (!baked) {
        // A glow of which settings change every frame would add a new entry every frame
        if (byTexture.size >= 256) byTexture.clear();
 
        const pad = Math.ceil(glow.bloom * 2);
        const image = new OffscreenCanvas(Math.ceil(frame.dw) + pad * 2, Math.ceil(frame.dh) + pad * 2);
        const g = image.getContext("2d")!;
        g.shadowColor = glow.color;
        g.shadowBlur = glow.bloom;
 
        for (let i = 0; i < glow.intensity; i++) {
            g.drawImage(
                frame.texture,
                frame.sx,
                frame.sy,
                frame.sw,
                frame.sh,
                pad,
                pad,
                frame.dw,
                frame.dh
            );
        }
 
        baked = { image, pad };
        byTexture.set(key, baked);
    }
 
    return baked;
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
    
    // The part of the texture to draw this frame, and the size to draw it at
    getFrame(): FrameSource | null {
        if (this.animator) {
            const ss = this.animator.currentAnimation.spriteSheet;
            const frame = this.animator.currentFrame;
            const cols = Math.floor(ss.texture.width / ss.frameWidth);
            
            return {
                texture: ss.texture,
                sx: (frame % cols) * ss.frameWidth,
                sy: Math.floor(frame / cols) * ss.frameHeight,
                sw: ss.frameWidth,
                sh: ss.frameHeight,
                dw: ss.width,
                dh: ss.height,
            };
        }
 
        if (this.sprite) {
            const texture = this.sprite.texture;
            
            return {
                texture,
                sx: 0,
                sy: 0,
                sw: texture.width,
                sh: texture.height,
                dw: this.sprite.width,
                dh: this.sprite.height
            };
        }
 
        return null;
    }

    render(ctx: CanvasRenderingContext2D) {
        const frame = this.getFrame();
        if (!frame) return;

        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);

        if (this.glow) {
            const { image, pad } = getGlowImage(frame, this.glow);
            
            ctx.drawImage(
                image,
                -frame.dw / 2 - pad,
                -frame.dh / 2 - pad
            );
        }

        ctx.drawImage(
            frame.texture,
            frame.sx,
            frame.sy,
            frame.sw,
            frame.sh,
            -frame.dw / 2,
            -frame.dh / 2,
            frame.dw, frame.dh
        );
        ctx.restore();
    }
}
