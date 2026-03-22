import { Vector2 } from "./vector.js";
export class Entity {
    // Basic entity structure
    animator;
    sprite;
    position;
    rotation;
    body;
    collider;
    constructor(options = {}) {
        this.animator = options.animator;
        this.sprite = options.sprite;
        this.position = options.position ?? new Vector2(0, 0);
        this.rotation = options.rotation ?? 0;
        this.body = options.body;
        this.collider = options.collider;
    }
    // Event handlers
    onCollisionEnter;
    onCollisionStay;
    onCollisionExit;
    onTriggerEnter;
    onTriggerStay;
    onTriggerExit;
    // Render
    render(ctx) {
        // If there is an animator
        if (this.animator) {
            const animation = this.animator.currentAnimation;
            const spriteSheet = animation.spriteSheet;
            const frame = this.animator.currentFrame;
            const cols = Math.floor(spriteSheet.texture.width / spriteSheet.frameWidth);
            const sx = (frame % cols) * spriteSheet.frameWidth;
            const sy = Math.floor(frame / cols) * spriteSheet.frameHeight;
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(spriteSheet.texture, sx, sy, spriteSheet.frameWidth, spriteSheet.frameHeight, -spriteSheet.frameWidth / 2, -spriteSheet.frameHeight / 2, spriteSheet.frameWidth, spriteSheet.frameHeight);
            ctx.restore();
        }
        // If there is a static sprite
        else if (this.sprite) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(this.sprite.texture, -this.sprite.width / 2, -this.sprite.height / 2, this.sprite.width, this.sprite.height);
            ctx.restore();
        }
    }
}
