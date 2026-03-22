import { Scene } from "./scene";
import { Vector2 } from "./vector";
export interface CameraOptions {
    position?: Vector2;
    rotation?: number;
    zoom?: number;
    scene: Scene;
}
export declare class Camera {
    position: Vector2;
    rotation: number;
    zoom: number;
    scene: Scene;
    constructor(options: CameraOptions);
    apply(): void;
    screenToWorld(screenPos: Vector2): Vector2;
}
