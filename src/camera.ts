import { Scene } from "./scene";
import { Vector2 } from "./vector";

export interface CameraOptions {
    position?: Vector2;
    rotation?: number;
    zoom?: number;
    scene: Scene;
}

export class Camera {
    public position: Vector2;
    public rotation: number;
    public zoom: number;
    public scene: Scene;

    constructor(options: CameraOptions) {
        this.position = options.position ?? new Vector2(0, 0);
        this.rotation = options.rotation ?? 0;
        this.zoom = options.zoom ?? 1;
        this.scene = options.scene;
    }

    apply() {
        const ctx = this.scene.ctx;

        if (ctx) {
            const cx = ctx.canvas.width / 2;
            const cy = ctx.canvas.height / 2;

            // Move to center for zoom/rotation
            ctx.translate(cx, cy);
            // Zoom and rotate around center
            ctx.scale(this.zoom, this.zoom);
            ctx.rotate(this.rotation);
            // Offset so position appears at top-left
            ctx.translate(-this.position.x - cx / this.zoom, -this.position.y - cy / this.zoom);
        }
    }

    screenToWorld(screenPos: Vector2): Vector2 {
        const ctx = this.scene.ctx;

        if (ctx) {
            const cx = ctx.canvas.width / 2;
            const cy = ctx.canvas.height / 2;

            // Offset from center
            let x = screenPos.x - cx;
            let y = screenPos.y - cy;

            // Undo rotation
            const cos = Math.cos(-this.rotation);
            const sin = Math.sin(-this.rotation);
            const rotatedX = x * cos - y * sin;
            const rotatedY = x * sin + y * cos;

            // Undo zoom
            const worldX = rotatedX / this.zoom;
            const worldY = rotatedY / this.zoom;

            // Add camera offset
            return new Vector2(
                worldX + this.position.x + cx / this.zoom,
                worldY + this.position.y + cy / this.zoom
            );
        }

        return new Vector2(0, 0);
    }
}
