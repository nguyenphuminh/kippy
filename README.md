## Kippy

Kippy is a 2D JS game engine written purely for fun and simplicity. It currently utilizes the Canvas 2D context for rendering and aims to have a small set of APIs viable for game dev, but do expect a lot of components to change in the future.

## Setup

Install through npm:
```
npm install kippy
```

## Tutorial

Here is a vaguely-written tutorial for now:

### Initialize game

First, prepare a canvas tag in your html file:
```html
<canvas></canvas>
```

Then mount your game there:
```js
import { Game } from "kippy";

const canvas = document.querySelector("canvas");
const game = new Game({
    canvas
});

// Start the game loop
game.start();

// You can also swap canvas if you want
// game.setCanvas(someOtherCanvas);
```

### Create a scene

Here is how you can create a scene and load that scene into your game object:
```js
import { Scene } from "kippy";

class Main extends Scene {
    // Runs when this scene gets loaded into a game
    init() {}
    // Runs on every frame, dt is the time between each frame
    update(dt) {}
    // Runs when another scene replaces this scene in a game
    exit() {}
}

// Create scene and load into game
const main = new Main();
game.setScene(main);
```

### Create an entity

A scene can have multiple entities like players, mobs, obstacles, etc in it. This is how you can create an entity:
```js
import { Entity } from "kippy";

const entity = new Entity({
    sprite, // Entity's sprite to be rendered, type Sprite
    position, // Entity's position (centered), type Vector2
    rotation, // Entity's rotation in radians, type number
    body, // Entity's physical body, type EntityBody
});

// Add it to a scene
scene.addEntity(entity);
// Remove it from a scene
scene.removeEntity(entity);

// These props contain movement info and you can mutate them to edit its position
entity.position; // Initialized from the "position" param above, Vector2(0, 0) if not specified
// You can mutate these directly:
entity.position.x;
entity.position.y;
entity.rotation; // Initialized from the "rotation" param above, 0 if not specified
```

### Create a sprite

A sprite represents what an entity looks like (the "graphics part"), and you can create a sprite like this:
```js
import { Sprite } from "kippy";

const sprite = new Sprite({
    texture, // Sprite's texture - HTMLImageElement, HTMLCanvasElement, OffscreenCanvas, ImageBitmap
    width, // Sprite's width, type number
    height // Sprite's height, type number
});

// Set sprite for an entity
entity.sprite = sprite;
```

### Add controls

Game controls like mouse presses, key presses, touch, and cursor tracking (in the game canvas, not the web window) can be done by using the input handler from your `game` instance:
```js
const input = game.input;
```

Then in a scene's `update` method, you can use these utilities to check for key presses:
```js
// Keyboard
input.isKeyDown(/* Character/key here */); // true if key is held, false otherwise
input.isKeyPressed(/* Character/key here */); // true if key is pressed, false otherwise
input.isKeyReleased(/* Character/key here */); // true if key is released, false otherwise
// Mouse/touch
input.isPointerDown(/* 0 for left, 1 for right, 2 for touch */); // true if held, false otherwise
input.isPointerPressed(/* 0 for left, 1 for right, 2 for touch */); // true if pressed, false otherwise
input.isPointerReleased(/* 0 for left, 1 for right, 2 for touch */); // true if released, false otherwise
// Mouse/touch position
input.pointer; // Pointer's position vector
input.pointer.x; // Current X position of mouse/touch
input.pointer.y; // Current Y position of mouse/touch
```

### Vectors

To work with positions and movements in Kippy, it is best to know about `Vector2` first. Positions, velocities, forces, etc are all represented as vectors in Kippy. And here are how you can create a 2D vector and some vector math utilities that come along with it:
```js
import { Vector2 } from "kippy";

const vect = new Vector2(/* x coordinate, number */, /*y coordinate, number */);

// Props
vect.x; // X coordinate
vect.y; // Y coordinate

// Utilities
vect.add(otherVect); // Add another vector and return the result vector
vect.sub(otherVect); // Subtract another vector and return the result vector
vect.scale(scale); // Multiply with scale and return the result vector
vect.magnitude(); // Return the magnitude/length of vector
vect.normalize(); // Return the normalized vector by magnitude
vect.dot(otherVect); // Return dot product with another vector
vect.distance(otherVect); // Return distance to another vector
vect.copy(); // Return a copy (same coordinates, different reference)
vect.lerp(otherVect, scale); // Apply linear interpolation and return
vect.clamp(maxLength); // Clamp vector to have length below maxLength
vect.rotate(angle); // Return rotated vector by provided angle
vect.angle(); // Return angle of vector.
vect.angleTo(otherVec); // Return angle between this and another vector
vect.reflect(otherVect); // Return reflection/bounce back vector
vect.equals(otherVect); // Check if two vectors are equal

// Useful constants
Vector2.ZERO; // Vector2(0, 0)
Vector2.ONE; // Vector2(1, 1);
Vector2.UP; // Vector2(0, -1);
Vector2.DOWN; // Vector2(0, 1);
Vector2.LEFT; // Vector2(-1, 0);
Vector2.RIGHT; // Vector2(1, 0);
```

### Physics

For movements, currently you can create a `RigidBody`:
```js
// Create a rigid body
const rigidBody = new RigidBody({
    velocity, // Entity's velocity vector, type Vector2
    rotationVelocity, // Entity's angular/rotation velocity, type number
    mass, // Entity's mass, type number
    inertia, // Entity's inertia, type number
    force, // Entity's force vector, type Vector2
    torque, // Entity's torque/rotational force, type number
});

// Attach body to an entity
entity.body = rigidBody;

// And you can mutate these props to update movement every frame
entity.body.velocity; // Set with the matching parameter above, default is Vector2(0, 0)
entity.body.rotationVelocity; // Set with the matching parameter above, default is 0
entity.body.mass; // Set with the matching parameter above, default is 1
entity.body.inertia; // Set with the matching parameter above, default is 1
// Note that forces are reset after every frame
entity.body.force; // Set with the matching parameter above, default is Vector2(0, 0)
entity.body.torque; // Set with the matching parameter above, default is 0
```

Collisions to be added.

### Camera

The camera decides what part of your game world gets rendered. Note that unlike most camera implementations of which positions are centered, Kippy's camera position is at the top-left of the camera. For example, camera at (0,0) and entity at (0,0) in Godot would show the entity at the center, while the same setup in Kippy would show the entity at the top-left. This is to be more aligned with how web and canvas positioning works.

The camera is available for use through every scene object:
```js
// Get camera
const camera = scene.camera;

// The camera has these props to manage it:
camera.position; // The position vector of the camera, default is Vector2(0, 0)
camera.rotation; // Rotation of the camera, default is 0
camera.zoom // Camera zoom level, default is 1

// Convert a screen-based vector (mouse position for example) to world-based vector
camera.screenToWorld(input.pointer); // Return new vector
```

### Animation

To be added, for now mutate `entity.sprite` to swap sprites and create animations manually.

### Audio

To be added, for now use web's built-in `Audio` class.

### Asset management

To be added.

## Copyrights and License

Copyrights © 2026 Nguyen Phu Minh.

This project is licensed under the Apache 2.0 license.
