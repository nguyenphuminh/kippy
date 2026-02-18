import { Entity } from "./entity";
import { Vector2 } from "./vector";
export interface RigidBodyOptions {
    velocity?: Vector2;
    rotationVelocity?: number;
    mass?: number;
    inertia?: number;
    force?: Vector2;
    torque?: number;
    restitution?: number;
    sleepThreshold?: number;
    sleepTimeThreshold?: number;
    isSleeping?: boolean;
    sleepTimer?: number;
}
export declare class RigidBody {
    velocity: Vector2;
    rotationVelocity: number;
    mass: number;
    inertia: number;
    force: Vector2;
    torque: number;
    restitution: number;
    sleepThreshold: number;
    sleepTimeThreshold: number;
    isSleeping: boolean;
    sleepTimer: number;
    constructor(options?: RigidBodyOptions);
    wake(): void;
}
export type EntityBody = RigidBody;
export interface CircleColliderOptions {
    radius: number;
    offset?: Vector2;
    isTrigger?: boolean;
    layer?: number;
    mask?: number;
}
export declare class CircleCollider {
    radius: number;
    offset: Vector2;
    isTrigger: boolean;
    layer: number;
    mask: number;
    constructor(options: CircleColliderOptions);
}
export interface BoxColliderOptions {
    width: number;
    height: number;
    offset?: Vector2;
    isTrigger?: boolean;
    layer?: number;
    mask?: number;
}
export declare class BoxCollider {
    width: number;
    height: number;
    offset: Vector2;
    isTrigger: boolean;
    layer: number;
    mask: number;
    constructor(options: BoxColliderOptions);
}
export type Collider = CircleCollider | BoxCollider;
export interface SpatialGridOptions {
    cellSize?: number;
    grid?: Map<string, Set<Entity>>;
}
export declare class SpatialGrid {
    cellSize: number;
    grid: Map<string, Set<Entity>>;
    constructor(options?: SpatialGridOptions);
    clear(): void;
    adaptCellSize(entities: Entity[]): void;
    insert(entity: Entity): void;
    getNearby(entity: Entity): Entity[];
    getEntityBounds(entity: Entity): {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    };
}
export interface CollisionInfo {
    normal: Vector2;
    penetration: number;
    contact: Vector2;
    accumulatedNormalImpulse: number;
}
export interface CollisionResult {
    isTrigger: boolean;
    info?: CollisionInfo;
}
export declare class Physics {
    collisionPairs: Map<Entity, Map<Entity, CollisionInfo>>;
    spatialGrid: SpatialGrid;
    entityCount: number;
    update(entities: Entity[], dt: number): void;
    checkCollision(entityA: Entity, entityB: Entity): CollisionResult;
    resolveCollision(entityA: Entity, entityB: Entity, info: CollisionInfo, dt: number): void;
}
