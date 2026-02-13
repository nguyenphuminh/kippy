import { Game, Scene, Entity, Sprite, Input } from "../index.js";

// Initialize canvas
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize input handler
const input = new Input({
    canvas
});

// Structure scene
class MainScene extends Scene {
    constructor(player) {
        super(player);
        this.player = player;
    }

    update(dt) {
        if (input.isKeyDown("d")) {
            this.player.x += 1000 * dt;
        }

        if (input.isKeyDown("a")) {
            this.player.x -= 1000 * dt;
        }

        if (input.isKeyDown("w")) {
            this.player.y -= 1000 * dt;
        }

        if (input.isKeyDown("s")) {
            this.player.y += 1000 * dt;
        }
    }
}

// Initialize sprite for player
const sprite = new Sprite({
    texture: await createImageBitmap(await (await fetch("./bird.png")).blob())
});

// Initialize player
const player = new Entity({
    sprite,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
});

// Create scene and add player
const scene = new MainScene(player);
scene.addEntity(player);

// Initialize game
const game = new Game({
    canvas,
    input
});

// Set scene and start game loop
game.setScene(scene);
game.start();
