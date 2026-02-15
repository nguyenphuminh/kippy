export declare class Vector2 {
    x: number;
    y: number;
    static ZERO: Vector2;
    static ONE: Vector2;
    static UP: Vector2;
    static DOWN: Vector2;
    static LEFT: Vector2;
    static RIGHT: Vector2;
    constructor(x: number, y: number);
    add(other: Vector2): Vector2;
    sub(other: Vector2): Vector2;
    scale(scale: number): Vector2;
    magnitude(): number;
    normalize(): Vector2;
    dot(other: Vector2): number;
    distance(other: Vector2): number;
    copy(): Vector2;
    lerp(other: Vector2, scale: number): Vector2;
    clamp(maxLength: number): Vector2;
    rotate(angle: number): Vector2;
    angle(): number;
    angleTo(other: Vector2): number;
    reflect(normal: Vector2): Vector2;
    equals(other: Vector2): boolean;
}
