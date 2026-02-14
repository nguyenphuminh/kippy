import { Entity } from "./entity";

export interface RigidBodyOptions {
    velocityX?: number;
    velocityY?: number;
    rotationVelocity?: number;
    mass?: number;
    inertia?: number;
    forceX?: number;
    forceY?: number;
    torque?: number;
}

export class RigidBody {
    public velocityX: number;
    public velocityY: number;
    public rotationVelocity: number;
    public mass: number;
    public inertia: number;
    public forceX: number;
    public forceY: number;
    public torque: number;

    constructor(options: RigidBodyOptions = {}) {
        this.velocityX = options.velocityX ?? 0;
        this.velocityY = options.velocityY ?? 0;
        this.rotationVelocity = options.rotationVelocity ?? 0;
        this.mass = options.mass ?? 1;
        this.inertia = options.inertia ?? 1;
        this.forceX = options.forceX ?? 0;
        this.forceY = options.forceY ?? 0;
        this.torque = options.torque ?? 0;
    }
}

export class Physics {
    update(entities: Entity[]) {
        for (const entity of entities) {
            if (entity.body instanceof RigidBody) {
                // Acceleration/apply force
                entity.body.velocityX += entity.body.forceX / entity.body.mass;
                entity.body.velocityY += entity.body.forceY / entity.body.mass;
                entity.body.rotationVelocity += entity.body.torque / entity.body.inertia;
                // Positional update
                entity.x += entity.body.velocityX;
                entity.y += entity.body.velocityY;
                entity.rotation += entity.body.rotationVelocity;
            }
        }
    }
}
