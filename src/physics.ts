import { Entity } from "./entity";
import { Vector2 } from "./vector";

export interface RigidBodyOptions {
    velocity?: Vector2;
    rotationVelocity?: number;
    mass?: number;
    inertia?: number;
    force?: Vector2;
    torque?: number;
}

export class RigidBody {
    public velocity: Vector2;
    public rotationVelocity: number;
    public mass: number;
    public inertia: number;
    public force: Vector2;
    public torque: number;

    constructor(options: RigidBodyOptions = {}) {
        this.velocity = options.velocity ?? new Vector2(0, 0);
        this.rotationVelocity = options.rotationVelocity ?? 0;
        this.mass = options.mass ?? 1;
        this.inertia = options.inertia ?? 1;
        this.force = options.force ?? new Vector2(0, 0);
        this.torque = options.torque ?? 0;
    }
}

export type EntityBody = RigidBody;

export class Physics {
    update(entities: Entity[]) {
        for (const entity of entities) {
            if (entity.body instanceof RigidBody) {
                // Acceleration/apply force
                entity.body.velocity.x += entity.body.force.x / entity.body.mass;
                entity.body.velocity.y += entity.body.force.y / entity.body.mass;
                entity.body.rotationVelocity += entity.body.torque / entity.body.inertia;
                // Positional update
                entity.position.x += entity.body.velocity.x;
                entity.position.y += entity.body.velocity.y;
                entity.rotation += entity.body.rotationVelocity;
                // Clear force
                entity.body.force.x = 0;
                entity.body.force.y = 0;
                entity.body.torque = 0;
            }
        }
    }
}
