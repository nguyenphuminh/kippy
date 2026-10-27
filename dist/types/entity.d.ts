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
export interface EntityOptions {
    animator?: Animator;
    sprite?: Sprite;
    position?: Vector2;
    rotation?: number;
    body?: EntityBody;
    collider?: Collider;
    glow?: GlowEffect;
}
export declare class Entity {
    animator?: Animator;
    sprite?: Sprite;
    position: Vector2;
    rotation: number;
    body?: EntityBody;
    collider?: Collider;
    glow?: GlowEffect;
    constructor(options?: EntityOptions);
    onCollisionEnter?: (other: Entity, info: CollisionInfo) => void;
    onCollisionStay?: (other: Entity, info: CollisionInfo) => void;
    onCollisionExit?: (other: Entity, info: CollisionInfo) => void;
    onTriggerEnter?: (other: Entity) => void;
    onTriggerStay?: (other: Entity) => void;
    onTriggerExit?: (other: Entity) => void;
    getFrame(): FrameSource | null;
    render(ctx: CanvasRenderingContext2D): void;
}
