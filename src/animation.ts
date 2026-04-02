import { Texture } from "./sprite.js";

export interface SpriteSheetOptions {
    texture: Texture;
    frameWidth: number;
    frameHeight: number;
    width?: number;
    height?: number;
}

export class SpriteSheet {
    public texture: Texture;
    public frameWidth: number;
    public frameHeight: number;
    public width: number;
    public height: number;

    constructor(options: SpriteSheetOptions) {
        this.texture = options.texture;
        this.frameWidth = options.frameWidth;
        this.frameHeight = options.frameHeight;
        this.width = options.width ?? options.frameWidth;
        this.height = options.height ?? options.frameHeight;
    }
}

export interface AnimationOptions {
    spriteSheet: SpriteSheet,
    frames: number[],
    fps: number,
    loop?: boolean;
}

export class Animation {
    // Animation config
    public spriteSheet: SpriteSheet;
    public frames: number[];
    public fps: number;
    public loop: boolean;

    constructor(options: AnimationOptions) {
        this.spriteSheet = options.spriteSheet;
        this.frames = options.frames;
        this.fps = options.fps;
        this.loop = options.loop ?? false;
    }
}

export interface AnimatorOptions {
    animations: Record<string, Animation>;
    default: string;
}

export class Animator {
    public animations: Record<string, Animation>;
    public currentAnimation: Animation;
    public currentAnimationName: string;

    // Animation state
    public frameIndex = 0;
    public stopped = false;
    public elapsed = 0;

    // Event handler
    public onEnd?: (name: string) => void;

    constructor(options: AnimatorOptions) {
        this.animations = options.animations;
        this.currentAnimation = this.animations[options.default];
        this.currentAnimationName = options.default;
    }

    play(animation: string) {
        this.currentAnimation = this.animations[animation];
        this.currentAnimationName = animation;
        this.frameIndex = 0;
        this.stopped = false;
        this.elapsed = 0;
    }

    update(dt: number) {
        if (this.stopped) return;

        this.elapsed += dt;
        const frameDuration = 1 / this.currentAnimation.fps;

        if (this.elapsed >= frameDuration) {
            this.elapsed -= frameDuration;
            this.frameIndex++;

            if (this.frameIndex >= this.currentAnimation.frames.length) {
                if (this.currentAnimation.loop) {
                    this.frameIndex = 0;
                } else {
                    this.frameIndex = this.currentAnimation.frames.length - 1;
                    this.stopped = true;
                    this.onEnd?.(this.currentAnimationName);
                }
            }
        }
    }

    get currentFrame(): number {
        return this.currentAnimation.frames[this.frameIndex];
    }
}
