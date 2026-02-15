import { Vector2 } from "./vector";
export class RigidBody {
    velocity;
    rotationVelocity;
    mass;
    inertia;
    force;
    torque;
    constructor(options = {}) {
        this.velocity = options.velocity ?? new Vector2(0, 0);
        this.rotationVelocity = options.rotationVelocity ?? 0;
        this.mass = options.mass ?? 1;
        this.inertia = options.inertia ?? 1;
        this.force = options.force ?? new Vector2(0, 0);
        this.torque = options.torque ?? 0;
    }
}
export class Physics {
    update(entities) {
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
