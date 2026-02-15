export class Vector2 {
    x;
    y;
    static ZERO = new Vector2(0, 0);
    static ONE = new Vector2(1, 1);
    static UP = new Vector2(0, -1);
    static DOWN = new Vector2(0, 1);
    static LEFT = new Vector2(-1, 0);
    static RIGHT = new Vector2(1, 0);
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    sub(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    scale(scale) {
        return new Vector2(this.x * scale, this.y * scale);
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        const mag = this.magnitude();
        return mag > 0 ? new Vector2(this.x / mag, this.y / mag) : new Vector2(0, 0);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    distance(other) {
        return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
    }
    copy() {
        return new Vector2(this.x, this.y);
    }
    lerp(other, scale) {
        return this.add(other.sub(this).scale(scale));
    }
    clamp(maxLength) {
        const mag = this.magnitude();
        return mag > maxLength ? this.scale(maxLength / mag) : this.copy();
    }
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }
    angle() {
        return Math.atan2(this.y, this.x);
    }
    angleTo(other) {
        return Math.atan2(other.y - this.y, other.x - this.x);
    }
    reflect(normal) {
        const d = this.dot(normal);
        return this.sub(normal.scale(2 * d));
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
}
