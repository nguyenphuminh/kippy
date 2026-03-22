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
    toString() {
        return `Vector2(${this.x}, ${this.y})`;
    }
    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    sub(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    mul(other) {
        return new Vector2(this.x * other.x, this.y * other.y);
    }
    div(other) {
        return new Vector2(this.x / other.x, this.y / other.y);
    }
    neg() {
        return new Vector2(-this.x, -this.y);
    }
    scale(scale) {
        return new Vector2(this.x * scale, this.y * scale);
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    magnitudeSquared() {
        return this.x * this.x + this.y * this.y;
    }
    normalize() {
        const mag = this.magnitude();
        return mag > 0 ? new Vector2(this.x / mag, this.y / mag) : new Vector2(0, 0);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    cross(other) {
        return this.x * other.y - this.y * other.x;
    }
    project(other) {
        const scalar = this.dot(other) / other.magnitudeSquared();
        return other.scale(scalar);
    }
    min(other) {
        return new Vector2(Math.min(this.x, other.x), Math.min(this.y, other.y));
    }
    max(other) {
        return new Vector2(Math.max(this.x, other.x), Math.max(this.y, other.y));
    }
    floor() {
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    }
    ceil() {
        return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
    }
    round() {
        return new Vector2(Math.round(this.x), Math.round(this.y));
    }
    distance(other) {
        return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
    }
    distanceSquared(other) {
        return (this.x - other.x) ** 2 + (this.y - other.y) ** 2;
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
    orthogonal() {
        return new Vector2(-this.y, this.x);
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
