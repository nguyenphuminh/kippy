export class SpriteSheet {
    texture;
    frameWidth;
    frameHeight;
    constructor(options) {
        this.texture = options.texture;
        this.frameWidth = options.frameWidth;
        this.frameHeight = options.frameHeight;
    }
}
export class Animation {
    // Animation config
    spriteSheet;
    frames;
    fps;
    loop;
    constructor(options) {
        this.spriteSheet = options.spriteSheet;
        this.frames = options.frames;
        this.fps = options.fps;
        this.loop = options.loop ?? false;
    }
}
export class Animator {
    animations;
    currentAnimation;
    currentAnimationName;
    // Animation state
    frameIndex = 0;
    stopped = false;
    elapsed = 0;
    // Event handler
    onEnd;
    constructor(options) {
        this.animations = options.animations;
        this.currentAnimation = this.animations[options.default];
        this.currentAnimationName = options.default;
    }
    play(animation) {
        this.currentAnimation = this.animations[animation];
        this.currentAnimationName = animation;
        this.frameIndex = 0;
        this.stopped = false;
        this.elapsed = 0;
    }
    update(dt) {
        if (this.stopped)
            return;
        this.elapsed += dt;
        const frameDuration = 1 / this.currentAnimation.fps;
        if (this.elapsed >= frameDuration) {
            this.elapsed -= frameDuration;
            this.frameIndex++;
            if (this.frameIndex >= this.currentAnimation.frames.length) {
                if (this.currentAnimation.loop) {
                    this.frameIndex = 0;
                }
                else {
                    this.frameIndex = this.currentAnimation.frames.length - 1;
                    this.stopped = true;
                    this.onEnd?.(this.currentAnimationName);
                }
            }
        }
    }
    get currentFrame() {
        return this.currentAnimation.frames[this.frameIndex];
    }
}
