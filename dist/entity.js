export class Entity {
    sprite;
    x;
    y;
    rotation;
    body;
    constructor(options = {}) {
        this.sprite = options.sprite;
        this.x = options.x ?? 0;
        this.y = options.y ?? 0;
        this.rotation = options.rotation ?? 0;
        this.body = options.body;
    }
    setSprite(sprite) {
        this.sprite = sprite;
    }
    render(ctx) {
        if (this.sprite) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(this.sprite.texture, -this.sprite.width / 2, -this.sprite.height / 2);
            ctx.restore();
        }
    }
}
