import { Texture } from "./sprite.js";
export interface SpriteSheetOptions {
    texture: Texture;
    frameWidth: number;
    frameHeight: number;
    width?: number;
    height?: number;
}
export declare class SpriteSheet {
    texture: Texture;
    frameWidth: number;
    frameHeight: number;
    width: number;
    height: number;
    constructor(options: SpriteSheetOptions);
}
export interface AnimationOptions {
    spriteSheet: SpriteSheet;
    frames: number[];
    fps: number;
    loop?: boolean;
}
export declare class Animation {
    spriteSheet: SpriteSheet;
    frames: number[];
    fps: number;
    loop: boolean;
    constructor(options: AnimationOptions);
}
export interface AnimatorOptions {
    animations: Record<string, Animation>;
    default: string;
}
export declare class Animator {
    animations: Record<string, Animation>;
    currentAnimation: Animation;
    currentAnimationName: string;
    frameIndex: number;
    stopped: boolean;
    elapsed: number;
    onEnd?: (name: string) => void;
    constructor(options: AnimatorOptions);
    play(animation: string): void;
    update(dt: number): void;
    get currentFrame(): number;
}
