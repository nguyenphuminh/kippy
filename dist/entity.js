import { Vector2 } from "./vector.js";
export class Entity {
    sprite;
    position;
    rotation;
    body;
    constructor(options = {}) {
        this.sprite = options.sprite;
        this.position = options.position ?? new Vector2(0, 0);
        this.rotation = options.rotation ?? 0;
        this.body = options.body;
    }
    render(ctx) {
        if (this.sprite) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(this.sprite.texture, -this.sprite.width / 2, -this.sprite.height / 2);
            ctx.restore();
        }
    }
}
