import { EntityBody } from "./physics.js";
import { Sprite } from "./sprite.js";
import { Vector2 } from "./vector.js";

export interface EntityOptions {
    sprite?: Sprite;
    position?: Vector2;
    rotation?: number;
    body?: EntityBody;
}

export class Entity {
    public sprite?: Sprite;
    public position: Vector2;
    public rotation: number;
    public body?: EntityBody;

    constructor(options: EntityOptions = {}) {
        this.sprite = options.sprite;
        this.position = options.position ?? new Vector2(0, 0);
        this.rotation = options.rotation ?? 0;
        this.body = options.body;
    }

    render(ctx: CanvasRenderingContext2D) {
        if (this.sprite) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(
                this.sprite.texture,
                -this.sprite.width / 2,
                -this.sprite.height / 2
            );
            ctx.restore();
        }
    }
}
