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
export declare class RigidBody {
    velocityX: number;
    velocityY: number;
    rotationVelocity: number;
    mass: number;
    inertia: number;
    forceX: number;
    forceY: number;
    torque: number;
    constructor(options?: RigidBodyOptions);
}
export type EntityBody = RigidBody;
export declare class Physics {
    update(entities: Entity[]): void;
}
