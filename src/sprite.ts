export type Texture = HTMLImageElement | HTMLCanvasElement | OffscreenCanvas | ImageBitmap;

export interface SpriteOptions {
    texture: Texture;
    width?: number;
    height?: number;
}

export class Sprite {
    public texture: Texture;
    public width: number;
    public height: number;
    
    constructor(options: SpriteOptions) {
        this.texture = options.texture;
        this.width = options.width ?? this.texture.width;
        this.height = options.height ?? this.texture.height;
    }
}
