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
    x, // Entity's x position (centered), type number
    y, // Entity's y position (centered), type number
    rotation, // Entity's rotation in radians, type number
    body, // Entity's physical body, type EntityBody
});

// Add it to a scene
scene.addEntity(entity);
// Remove it from a scene
scene.removeEntity(entity);

// These props contain movement info and you can mutate them to edit its position
entity.x; // Initialized from the "x" param above, 0 if not specified
entity.y; // Initialized from the "y" param above, 0 if not specified
entity.rotation; // Initialized from the "rotation" param above, 0 if not specified
```

### Create a sprite

A sprite represents what an entity looks like, the "graphics part", you can create a sprite like this:
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

Game controls like mouse presses, key presses, and mouse cursor traking (in the game canvas, not the web window) can be done by using the input handler from your `game` instance:
```js
const input = game.input;
```

Then in a scene's `update` method, you can use these utilities to check for key presses:
```js
// Keyboard
input.isKeyDown(/* Character/key here */); // true if key is held, false otherwise
input.isKeyPressed(/* Character/key here */); // true if key is pressed, false otherwise
input.isKeyReleased(/* Character/key here */); // true if key is released, false otherwise
// Mouse
input.isPointerDown(/* 0 for left, 1 for right, 2 for touch */); // true if held, false otherwise
input.isPointerPressed(/* 0 for left, 1 for right, 2 for touch */); // true if pressed, false otherwise
input.isPointerReleased(/* 0 for left, 1 for right, 2 for touch */); // true if released, false otherwise
input.mouseX; // Current X position of mouse
input.mouseY; // Current Y position of mouse
```

### Physics

For movements, currently you can create a `RigidBody`:
```js
// Create a rigid body
const rigidBody = new RigidBody({
    velocityX, // X velocity, type number
    velocityY, // Y velocity, type number
    rotationVelocity, // Angular/rotation velocity, type number
    mass, // Entity's mass, type number
    inertia, // Entity's inertia, type number
    forceX, // Entity's force on X axis, type number
    forceY, // Entity's force on Y axis, type number
    torque, // Entity's torque/rotational force, type number
});

// Attach body to an entity
entity.body = rigidBody;

// And you can mutate these props to update movement every frame
entity.body.velocityX; // Set with the matching parameter above, default is 0
entity.body.velocityY; // Set with the matching parameter above, default is 0
entity.body.rotationVelocity; // Set with the matching parameter above, default is 0
entity.body.mass; // Set with the matching parameter above, default is 1
entity.body.inertia; // Set with the matching parameter above, default is 1
entity.body.forceX; // Set with the matching parameter above, default is 0
entity.body.forceY; // Set with the matching parameter above, default is 0
entity.body.torque; // Set with the matching parameter above, default is 0
```

Collisions to be added.

### Animation

To be added, for now mutate `entity.sprite` to swap sprites and create animations manually.

### Audio

To be added, for now use web's built-in `Audio` class.

## Copyrights and License

Copyrights © 2026 Nguyen Phu Minh.

This project is licensed under the Apache 2.0 license.
