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
export declare class RigidBody {
    velocity: Vector2;
    rotationVelocity: number;
    mass: number;
    inertia: number;
    force: Vector2;
    torque: number;
    constructor(options?: RigidBodyOptions);
}
export type EntityBody = RigidBody;
export declare class Physics {
    update(entities: Entity[]): void;
}
