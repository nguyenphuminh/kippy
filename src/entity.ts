import { EntityBody } from "./physics.js";
import { Sprite } from "./sprite.js";

export interface EntityOptions {
    sprite?: Sprite;
    x?: number;
    y?: number;
    rotation?: number;
    body?: EntityBody;
}

export class Entity {
    public sprite?: Sprite;
    public x: number;
    public y: number;
    public rotation: number;
    public body?: EntityBody;

    constructor(options: EntityOptions = {}) {
        this.sprite = options.sprite;
        this.x = options.x ?? 0;
        this.y = options.y ?? 0;
        this.rotation = options.rotation ?? 0;
        this.body = options.body;
    }

    render(ctx: CanvasRenderingContext2D) {
        if (this.sprite) {
            ctx.save();
            ctx.translate(this.x, this.y);
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
