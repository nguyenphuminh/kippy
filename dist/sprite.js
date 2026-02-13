export class Sprite {
    texture;
    width;
    height;
    constructor(options) {
        this.texture = options.texture;
        this.width = options.width || this.texture.width;
        this.height = options.height || this.texture.height;
    }
}
