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
    rotation // Entity's rotation in radians, type number
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
const sprite = new Sprite({
    texture, // Sprite's texture, can be HTMLImageElement, HTMLCanvasElement, OffscreenCanvas, ImageBitmap
    width, // Sprite's width, type number
    height // Sprite's height, type number
});

// Set sprite for an entity
entity.setSprite(sprite);
```

### Add controls

Game controls like mouse presses, key presses, and mouse cursor traking (in the game canvas, not the web window) can be done with the `Input` class:
```js
const input = new Input({
    canvas
});

// You can assign it into a game during initialization
const game = new Game({
    // other stuff
    input
})
// or after
game.setInput(input);
```

Then in a scene's `update` method, you can use these utilities to check for key presses:
```js
// Keyboard
input.isKeyDown(/* Character/key here */); // Key hold
input.isKeyPressed(/* Character/key here */); // Key press
input.isKeyReleased(/* Character/key here */); // Key released
// Mouse
input.isMouseDown(/* 0 for left, 1 for right */); // Mouse hold
input.isMousePressed(/* 0 for left, 1 for right */); // Mouse press
input.isMouseReleased(/* 0 for left, 1 for right */); // Mouse released
input.mouseX; // Current X position of mouse
input.mouseY; // Current Y position of mouse
```

### Physics

To be added, will have rigidBody for entities with collision and movement-related stuff.

### Audio

To be added, for now use web's built-in `Audio` class.

## Copyrights and License

Copyrights © 2025 Nguyen Phu Minh.

This project is licensed under the Apache 2.0 license.
