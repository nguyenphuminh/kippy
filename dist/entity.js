import { Vector2 } from "./vector.js";
export class Entity {
    // Basic entity structure
    sprite;
    position;
    rotation;
    body;
    collider;
    constructor(options = {}) {
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
    // Render with sprite
    render(ctx) {
        if (this.sprite) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(this.sprite.texture, -this.sprite.width / 2, -this.sprite.height / 2, this.sprite.width, this.sprite.height);
            ctx.restore();
        }
    }
}
