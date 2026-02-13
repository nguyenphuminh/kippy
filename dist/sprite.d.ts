export type Texture = HTMLImageElement | HTMLCanvasElement | OffscreenCanvas | ImageBitmap;
export interface SpriteOptions {
    texture: Texture;
    width?: number;
    height?: number;
}
export declare class Sprite {
    texture: Texture;
    width: number;
    height: number;
    constructor(options: SpriteOptions);
}
