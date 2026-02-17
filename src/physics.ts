import { Entity } from "./entity";
import { Vector2 } from "./vector";

// Physical bodies
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

export class RigidBody {
    public velocity: Vector2;
    public rotationVelocity: number;
    public mass: number;
    public inertia: number;
    public force: Vector2;
    public torque: number;
    public restitution: number;
    public sleepThreshold: number;
    public sleepTimeThreshold: number;
    public isSleeping: boolean;
    public sleepTimer: number;

    constructor(options: RigidBodyOptions = {}) {
        this.velocity = options.velocity ?? new Vector2(0, 0);
        this.rotationVelocity = options.rotationVelocity ?? 0;
        this.mass = options.mass ?? 1;
        this.inertia = options.inertia ?? 1;
        this.force = options.force ?? new Vector2(0, 0);
        this.torque = options.torque ?? 0;
        this.restitution = options.restitution ?? 0;
        this.sleepThreshold = options.sleepThreshold ?? 0.1;
        this.sleepTimeThreshold = options.sleepTimeThreshold ?? 0.5;
        this.isSleeping = options.isSleeping ?? false;
        this.sleepTimer = options.sleepTimer ?? 0;
    }

    wake() {
        this.isSleeping = false;
        this.sleepTimer = 0;
    }
}

export type EntityBody = RigidBody;


// Colliders
export interface CircleColliderOptions {
    radius: number;
    offset?: Vector2;
    isTrigger?: boolean;
    layer?: number;
    mask?: number;
}

export class CircleCollider {
    public radius: number;
    public offset: Vector2;
    public isTrigger: boolean;
    public layer: number;
    public mask: number;

    constructor(options: CircleColliderOptions) {
        this.radius = options.radius;
        this.offset = options.offset ?? new Vector2(0, 0);
        this.isTrigger = options.isTrigger ?? false;
        this.layer = options.layer ?? (1 << 0);
        this.mask = options.mask ?? 0xFFFFFFFF;
    }
}

export interface BoxColliderOptions {
    width: number;
    height: number;
    offset?: Vector2;
    isTrigger?: boolean;
    layer?: number;
    mask?: number;
}

export class BoxCollider {
    public width: number;
    public height: number;
    public offset: Vector2;
    public isTrigger: boolean;
    public layer: number;
    public mask: number;

    constructor(options: BoxColliderOptions) {
        this.width = options.width;
        this.height = options.height;
        this.offset = options.offset ?? new Vector2(0, 0);
        this.isTrigger = options.isTrigger ?? false;
        this.layer = options.layer ?? (1 << 0);
        this.mask = options.mask ?? 0xFFFFFFFF;
    }
}

export type Collider = CircleCollider | BoxCollider;


// Spatial grid for efficient collision detection
export interface SpatialGridOptions {
    cellSize?: number;
    grid?: Map<string, Set<Entity>>;
}

export class SpatialGrid {
    public cellSize: number;
    public grid: Map<string, Set<Entity>>;

    constructor(options: SpatialGridOptions = {}) {
        this.cellSize = options.cellSize || 100;
        this.grid = options.grid || new Map();
    }

    clear() {
        this.grid.clear();
    }

    // Auto update cell size
    adaptCellSize(entities: Entity[]) {
        // Sample entity sizes
        const sizes: number[] = [];

        for (const entity of entities) {
            const bounds = this.getEntityBounds(entity);
            const width = bounds.maxX - bounds.minX;
            const height = bounds.maxY - bounds.minY;
            const maxDimension = Math.max(width, height);
            sizes.push(maxDimension);
        }

        // Use median or 75th percentile (ignore outliers)
        sizes.sort((a, b) => a - b);
        const percentile75 = sizes[Math.floor(sizes.length * 0.75)];

        // Multiply by 2-3x (common heuristic)
        this.cellSize = percentile75 * 2.5;
    }

    // Insert entity into grid
    insert(entity: Entity) {
        if (entity.collider) {
            // Get bounds of entity ('s collider)
            const bounds = this.getEntityBounds(entity);

            // Insert into all cells it overlaps
            const minCellX = Math.floor(bounds.minX / this.cellSize);
            const maxCellX = Math.floor(bounds.maxX / this.cellSize);
            const minCellY = Math.floor(bounds.minY / this.cellSize);
            const maxCellY = Math.floor(bounds.maxY / this.cellSize);

            for (let cx = minCellX; cx <= maxCellX; cx++) {
                for (let cy = minCellY; cy <= maxCellY; cy++) {
                    const key = `${cx},${cy}`;
                    if (!this.grid.has(key)) {
                        this.grid.set(key, new Set());
                    }
                    this.grid.get(key)!.add(entity);
                }
            }
        }
    }

    // Get nearby entities (checks 3x3 grid around entity)
    getNearby(entity: Entity): Entity[] {
        const centerX = Math.floor(entity.position.x / this.cellSize);
        const centerY = Math.floor(entity.position.y / this.cellSize);

        const nearby = new Set<Entity>();

        // Check 3x3 grid of cells
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const key = `${centerX + dx},${centerY + dy}`;
                const cell = this.grid.get(key);

                if (cell) {
                    for (const e of cell) {
                        if (e !== entity) {
                            nearby.add(e);
                        }
                    }
                }
            }
        }

        return Array.from(nearby);
    }

    // Helper to get entity bounds
    getEntityBounds(entity: Entity) {
        if (entity.collider instanceof CircleCollider) {
            const radius = entity.collider.radius;

            return {
                minX: entity.position.x - radius,
                maxX: entity.position.x + radius,
                minY: entity.position.y - radius,
                maxY: entity.position.y + radius
            };
        } else if (entity.collider instanceof BoxCollider) {
            const halfWidth = entity.collider.width;
            const halfHeight = entity.collider.height;

            return {
                minX: entity.position.x - halfWidth,
                maxX: entity.position.x + halfWidth,
                minY: entity.position.y - halfHeight,
                maxY: entity.position.y + halfHeight
            }
        } else {
            throw new Error("Collider type not supported");
        }
    }
}

export interface CollisionInfo {
    normal: Vector2;      // Collision normal (direction to push apart)
    penetration: number;  // How deep they overlap
    contact: Vector2;     // Contact point
    accumulatedNormalImpulse: number; // Accumulated impulse
}

export interface CollisionResult {
    isTrigger: boolean;
    info?: CollisionInfo;
}


// Physics engine
export class Physics {
    public collisionPairs = new Map<Entity, Map<Entity, CollisionInfo>>(); // To store past collisions
    public spatialGrid = new SpatialGrid();
    public entityCount = 0;

    update(entities: Entity[], dt: number) {
        // Update velocity/apply force
        for (const entity of entities) {
            if (entity.body instanceof RigidBody) {
                // Wake if force applied
                if (entity.body.force.magnitudeSquared() > 0 || entity.body.torque !== 0) {
                    entity.body.wake();
                }

                // Skip sleeping bodies with no forces
                if (entity.body.isSleeping) continue;

                // Acceleration/apply force
                entity.body.velocity.x += entity.body.force.x / entity.body.mass * dt;
                entity.body.velocity.y += entity.body.force.y / entity.body.mass * dt;
                entity.body.rotationVelocity += entity.body.torque / entity.body.inertia * dt;
                // Clear force
                entity.body.force.x = 0;
                entity.body.force.y = 0;
                entity.body.torque = 0;
            }
        }

        // Rebuild spatial grid for collision handling
        this.spatialGrid.clear();

        if (this.entityCount !== entities.length) {
            this.entityCount = entities.length;
            this.spatialGrid.adaptCellSize(entities);
        }

        for (const entity of entities) {
            this.spatialGrid.insert(entity);
        }

        // Handle collisions - PHASE 1: Detect and collect all contacts
        const currentCollisions = new Map<Entity, Map<Entity, CollisionInfo>>(); // To update this.collisionPairs and check duplicates
        const contacts: Array<{ entityA: Entity, entityB: Entity, info: CollisionInfo }> = [];

        for (const entity of entities) {
            if (entity.collider) {
                const nearby = this.spatialGrid.getNearby(entity);

                for (const other of nearby) {
                    if (other.collider) {
                        // Check duplicate
                        if (
                            (currentCollisions.has(entity) && currentCollisions.get(entity)?.has(other)) ||
                            (currentCollisions.has(other) && currentCollisions.get(other)?.has(entity))
                        ) {
                            continue;
                        }

                        // Check collision
                        const collisionResult = this.checkCollision(entity, other);

                        if (collisionResult.info) {
                            // Wake if contacting an awake body
                            if (!entity.body?.isSleeping || !other.body?.isSleeping) {
                                entity.body?.wake();
                                other.body?.wake();
                            }

                            // Track collision
                            if (!currentCollisions.has(entity)) {
                                currentCollisions.set(entity, new Map());
                            }
                            currentCollisions.get(entity)?.set(other, collisionResult.info);

                            // Check if this is a new collision
                            const wasColliding = (
                                this.collisionPairs.get(entity)?.has(other) ||
                                this.collisionPairs.get(other)?.has(entity)
                            );

                            if (!wasColliding) {
                                // ENTER
                                if (collisionResult.isTrigger) {
                                    entity.onTriggerEnter?.(other);
                                    other.onTriggerEnter?.(entity);
                                } else {
                                    entity.onCollisionEnter?.(other, collisionResult.info);
                                    other.onCollisionEnter?.(entity, {
                                        ...collisionResult.info,
                                        normal: new Vector2(-collisionResult.info.normal.x, -collisionResult.info.normal.y)
                                    });
                                }
                            } else {
                                // STAY
                                if (collisionResult.isTrigger) {
                                    entity.onTriggerStay?.(other);
                                    other.onTriggerStay?.(entity);
                                } else {
                                    entity.onCollisionStay?.(other, collisionResult.info);
                                    other.onCollisionStay?.(entity, {
                                        ...collisionResult.info,
                                        normal: new Vector2(-collisionResult.info.normal.x, -collisionResult.info.normal.y)
                                    });
                                }
                            }

                            // Collect contact for solving
                            if (!collisionResult.isTrigger) {
                                contacts.push({
                                    entityA: entity,
                                    entityB: other,
                                    info: collisionResult.info
                                });
                            }
                        }
                    }
                }
            }
        }

        // PHASE 2: Iteratively solve all contacts together
        for (let iteration = 0; iteration < 6; iteration++) {
            for (const contact of contacts) {
                this.resolveCollision(contact.entityA, contact.entityB, contact.info, dt);
            }
        }

        // EXIT
        for (const [entity, others] of this.collisionPairs) {
            for (const [other, lastInfo] of others) {
                // Check if still colliding
                const stillColliding = (
                    currentCollisions.get(entity)?.has(other) ||
                    currentCollisions.get(other)?.has(entity)
                );

                if (!stillColliding) {
                    // Determine if was a trigger
                    const wasTrigger = entity.collider?.isTrigger || other.collider?.isTrigger;

                    if (wasTrigger) {
                        entity.onTriggerExit?.(other);
                        other.onTriggerExit?.(entity);
                    } else {
                        entity.onCollisionExit?.(other, lastInfo);
                        other.onCollisionExit?.(entity, {
                            ...lastInfo,
                            normal: new Vector2(-lastInfo.normal.x, -lastInfo.normal.y)
                        });
                    }
                }
            }
        }

        // Update tracked collisions
        this.collisionPairs = currentCollisions;

        // Update position
        for (const entity of entities) {
            if (entity.body instanceof RigidBody) {
                // Skip sleeping bodies
                if (entity.body.isSleeping) continue;

                // Positional update
                entity.position.x += entity.body.velocity.x * dt;
                entity.position.y += entity.body.velocity.y * dt;
                entity.rotation += entity.body.rotationVelocity * dt;

                // Sleep accumulation
                const speed = entity.body.velocity.magnitude();
                const angularSpeed = Math.abs(entity.body.rotationVelocity);

                if (speed < entity.body.sleepThreshold && angularSpeed < entity.body.sleepThreshold) {
                    entity.body.sleepTimer += dt;

                    if (entity.body.sleepTimer >= entity.body.sleepTimeThreshold) {
                        // Go to sleep
                        entity.body.isSleeping = true;
                        entity.body.velocity.x = 0;
                        entity.body.velocity.y = 0;
                        entity.body.rotationVelocity = 0;
                    }
                } else {
                    // Reset timer if moving too fast
                    entity.body.sleepTimer = 0;
                }
            }
        }
    }

    checkCollision(entityA: Entity, entityB: Entity): CollisionResult {
        if (entityA.collider && entityB.collider) {
            // Layer/mask filtering
            if (
                (entityA.collider.mask & entityB.collider.layer) === 0 ||
                (entityB.collider.mask & entityA.collider.layer) === 0
            ) {
                return {
                    isTrigger: false
                }
            }

            // Get trigger info
            const isTrigger = entityA.collider.isTrigger || entityB.collider.isTrigger;

            // Check collision
            const posA = entityA.position.add(entityA.collider.offset);
            const posB = entityB.position.add(entityB.collider.offset);

            // Check different types of colliders
            if (entityA.collider instanceof CircleCollider && entityB.collider instanceof CircleCollider) {
                const distance = posA.distance(posB);
                const radiusSum = entityA.collider.radius + entityB.collider.radius;

                if (distance >= radiusSum) {
                    return {
                        isTrigger: false
                    };
                }

                const penetration = radiusSum - distance;

                const direction = posB.sub(posA);
                let normal = distance > 0 ? direction.scale(1 / distance) : new Vector2(1, 0);

                // Warm starting - copy accumulated impulse from last frame if contact persists
                let accumulatedImpulse = 0;
                const lastContactInfo = this.collisionPairs.get(entityA)?.get(entityB) ||
                    this.collisionPairs.get(entityB)?.get(entityA);
                if (lastContactInfo) {
                    accumulatedImpulse = lastContactInfo.accumulatedNormalImpulse;
                }

                return {
                    isTrigger,
                    info: {
                        normal,
                        penetration,
                        contact: posA.add(normal.scale(entityA.collider.radius)),
                        accumulatedNormalImpulse: accumulatedImpulse
                    }
                };
            } else if (entityA.collider instanceof BoxCollider && entityB.collider instanceof BoxCollider) {
                const halfAx = entityA.collider.width / 2;
                const halfAy = entityA.collider.height / 2;
                const halfBx = entityB.collider.width / 2;
                const halfBy = entityB.collider.height / 2;

                const delta = posB.sub(posA);
                const overlapX = halfAx + halfBx - Math.abs(delta.x);
                const overlapY = halfAy + halfBy - Math.abs(delta.y);

                if (overlapX <= 0 || overlapY <= 0) {
                    return { isTrigger: false };
                }

                let normal: Vector2;
                let penetration: number;

                if (overlapX < overlapY) {
                    penetration = overlapX;
                    normal = new Vector2(delta.x < 0 ? -1 : 1, 0);
                } else {
                    penetration = overlapY;
                    normal = new Vector2(0, delta.y < 0 ? -1 : 1);
                }

                // Contact point: center of overlapping region
                const contactX = posA.x + Math.sign(delta.x) * (halfAx - overlapX / 2);
                const contactY = posA.y + Math.sign(delta.y) * (halfAy - overlapY / 2);

                let accumulatedImpulse = 0;
                const lastContactInfo = this.collisionPairs.get(entityA)?.get(entityB) ||
                    this.collisionPairs.get(entityB)?.get(entityA);
                if (lastContactInfo) {
                    accumulatedImpulse = lastContactInfo.accumulatedNormalImpulse;
                }

                return {
                    isTrigger,
                    info: {
                        normal,
                        penetration,
                        contact: new Vector2(contactX, contactY),
                        accumulatedNormalImpulse: accumulatedImpulse
                    }
                };

            } else if (
                (entityA.collider instanceof CircleCollider && entityB.collider instanceof BoxCollider) ||
                (entityA.collider instanceof BoxCollider && entityB.collider instanceof CircleCollider)
            ) {
                const isCircleA = entityA.collider instanceof CircleCollider;
                const circlePos = isCircleA ? posA : posB;
                const boxPos = isCircleA ? posB : posA;
                const circle = (isCircleA ? entityA : entityB).collider as CircleCollider;
                const box = (isCircleA ? entityB : entityA).collider as BoxCollider;

                const halfW = box.width / 2;
                const halfH = box.height / 2;

                // Box center -> circle center
                const delta = circlePos.sub(boxPos);

                const inside = Math.abs(delta.x) < halfW && Math.abs(delta.y) < halfH;

                let normal: Vector2;
                let penetration: number;
                let contact: Vector2;

                if (inside) {
                    const overlapX = halfW - Math.abs(delta.x);
                    const overlapY = halfH - Math.abs(delta.y);

                    if (overlapX < overlapY) {
                        const sign = delta.x < 0 ? -1 : 1;
                        const boxToCircle = new Vector2(sign, 0);
                        normal = isCircleA ? boxToCircle.neg() : boxToCircle; // A→B
                        penetration = circle.radius + overlapX;
                        contact = new Vector2(boxPos.x + sign * halfW, circlePos.y);
                    } else {
                        const sign = delta.y < 0 ? -1 : 1;
                        const boxToCircle = new Vector2(0, sign);
                        normal = isCircleA ? boxToCircle.neg() : boxToCircle;
                        penetration = circle.radius + overlapY;
                        contact = new Vector2(circlePos.x, boxPos.y + sign * halfH);
                    }
                } else {
                    const clampedX = Math.max(-halfW, Math.min(halfW, delta.x));
                    const clampedY = Math.max(-halfH, Math.min(halfH, delta.y));
                    const closest = boxPos.add(new Vector2(clampedX, clampedY));

                    const diff = circlePos.sub(closest);
                    const distSq = diff.magnitudeSquared();

                    if (distSq >= circle.radius * circle.radius) {
                        return { isTrigger: false };
                    }

                    const dist = Math.sqrt(distSq);
                    const boxToCircle = dist > 0 ? diff.scale(1 / dist) : new Vector2(1, 0);

                    normal = isCircleA ? boxToCircle.neg() : boxToCircle;
                    penetration = circle.radius - dist;
                    contact = closest;
                }

                let accumulatedImpulse = 0;
                const lastContactInfo = this.collisionPairs.get(entityA)?.get(entityB) ||
                    this.collisionPairs.get(entityB)?.get(entityA);
                if (lastContactInfo) {
                    accumulatedImpulse = lastContactInfo.accumulatedNormalImpulse;
                }

                return {
                    isTrigger,
                    info: {
                        normal,
                        penetration,
                        contact,
                        accumulatedNormalImpulse: accumulatedImpulse
                    }
                };
            }

            return {
                isTrigger: false
            }
        }

        return {
            isTrigger: false
        }
    }

    resolveCollision(entityA: Entity, entityB: Entity, info: CollisionInfo, dt: number) {
        if (!entityA.body || !entityB.body) return;

        const bodyA = entityA.body;
        const bodyB = entityB.body;

        // Check for infinite mass
        const invMassA = isFinite(bodyA.mass) ? 1 / bodyA.mass : 0;
        const invMassB = isFinite(bodyB.mass) ? 1 / bodyB.mass : 0;
        const totalInvMass = invMassA + invMassB;

        // If both infinite mass, do nothing
        if (totalInvMass === 0) return;

        // Relative velocity
        const relVel = bodyB.velocity.sub(bodyA.velocity);

        // Velocity along normal
        const velAlongNormal = relVel.dot(info.normal);

        // Don't resolve if velocities are separating
        if (velAlongNormal > 0) return;

        // Restitution (bounciness) with slop
        const restitutionSlop = 0.5;  // Kill bounce below 0.5 unit/sec
        let restitution = Math.max(bodyA.restitution, bodyB.restitution);

        // No bounce for slow collisions (helps objects settle)
        if (Math.abs(velAlongNormal) < restitutionSlop) {
            restitution = 0;
        }

        // Position correction with slop (Box2D/PhysX style)
        const slop = 0.01;  // Allow small penetration without correction
        const baumgarte = 0.2;  // Correct 20% of penetration per frame

        // Bias velocity - only apply when no bounce (restitution = 0)
        // When bouncing, let restitution handle it naturally
        const biasVelocity = restitution === 0 ? (Math.max(0, info.penetration - slop) * baumgarte) / dt : 0;

        // Calculate impulse using inverse mass
        const jn = (-(1 + restitution) * velAlongNormal + biasVelocity) / totalInvMass;

        // Clamp accumulated impulse
        const oldImpulse = info.accumulatedNormalImpulse || 0;
        info.accumulatedNormalImpulse = Math.max(0, oldImpulse + jn);
        const actualImpulse = info.accumulatedNormalImpulse - oldImpulse;

        // Apply actual impulse
        bodyA.velocity = bodyA.velocity.sub(info.normal.scale(actualImpulse * invMassA));
        bodyB.velocity = bodyB.velocity.add(info.normal.scale(actualImpulse * invMassB));

        // Apply angular impulse (torque from contact point)
        // Disabled for now because colliders must rotate too and there isn't polygon collider solver for now
        /*const rA = info.contact.sub(entityA.position);
        const rB = info.contact.sub(entityB.position);
        
        const angularImpulseA = rA.cross(info.normal.scale(-actualImpulse));
        const angularImpulseB = rB.cross(info.normal.scale(actualImpulse));
        
        bodyA.rotationVelocity += angularImpulseA * (isFinite(bodyA.inertia) ? 1 / bodyA.inertia : 0);
        bodyB.rotationVelocity += angularImpulseB * (isFinite(bodyB.inertia) ? 1 / bodyB.inertia : 0);*/
    }
}
