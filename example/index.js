import { Game, Scene, Entity, Sprite, RigidBody, Vector2 } from "../index.js";

// Initialize canvas
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize game
const game = new Game({
    canvas
});
// Get input handler from game
const input = game.input;

// Structure scene
class MainScene extends Scene {
    constructor(player) {
        super(player);
        this.player = player;
    }

    update(dt) {
        this.player.body.velocity = new Vector2(0, 0);
        // this.player.body.rotationVelocity = 0.01;

        if (input.isKeyDown("d")) {
            this.player.body.velocity.x = 1000 * dt;
        } 
        if (input.isKeyDown("a")) {
            this.player.body.velocity.x = -1000 * dt;
        } 
        if (input.isKeyDown("w")) {
            this.player.body.velocity.y = -1000 * dt;
        }
        if (input.isKeyDown("s")) {
            this.player.body.velocity.y = 1000 * dt;
        }
    }
}

// Initialize player
const player = new Entity({
    // Initialize sprite for player
    sprite: new Sprite({
        texture: await createImageBitmap(await (await fetch("./bird.png")).blob())
    }),
    // Initialize position for player to be in the middle of the screen
    position: new Vector2(window.innerWidth / 2, window.innerHeight / 2),
    // Initialize physical body
    body: new RigidBody()
});

// Create scene and add player
const scene = new MainScene(player);
scene.addEntity(player);

// Set scene and start game loop
game.setScene(scene);
game.start();
