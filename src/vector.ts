export class Vector2 {
    static ZERO = new Vector2(0, 0);
    static ONE = new Vector2(1, 1);
    static UP = new Vector2(0, -1);
    static DOWN = new Vector2(0, 1);
    static LEFT = new Vector2(-1, 0);
    static RIGHT = new Vector2(1, 0);

    constructor(public x: number, public y: number) {}

    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    sub(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    scale(scale: number): Vector2 {
        return new Vector2(this.x * scale, this.y * scale);
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vector2 {
        const mag = this.magnitude();
        return mag > 0 ? new Vector2(this.x / mag, this.y / mag) : new Vector2(0, 0);
    }

    dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    distance(other: Vector2): number {
        return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    lerp(other: Vector2, scale: number): Vector2 {
        return this.add(other.sub(this).scale(scale));
    }

    clamp(maxLength: number): Vector2 {
        const mag = this.magnitude();
        return mag > maxLength ? this.scale(maxLength / mag) : this.copy();
    }

    rotate(angle: number): Vector2 {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    angle(): number {
        return Math.atan2(this.y, this.x);
    }

    angleTo(other: Vector2): number {
        return Math.atan2(other.y - this.y, other.x - this.x);
    }

    reflect(normal: Vector2): Vector2 {
        const d = this.dot(normal);
        return this.sub(normal.scale(2 * d));
    }

    equals(other: Vector2): boolean {
        return this.x === other.x && this.y === other.y;
    }
}
