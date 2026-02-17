import { Game, Scene, Entity, Sprite, RigidBody, Vector2, CircleCollider, BoxCollider } from "../index.js";

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
        super();
        this.player = player;
    }

    update(dt) {
        this.player.body.force.y += 980;

        if (input.isKeyDown("d")) {
            console.log(this.player.body.velocity);
            this.player.body.velocity.x = 200;
        } 
        if (input.isKeyDown("a")) {
            this.player.body.velocity.x = -200;
        }
    }
}

// Initialize player
const ball = new Entity({
    sprite: new Sprite({
        width: 40,
        height: 40,
        texture: await createImageBitmap(await (await fetch("./bird.png")).blob())
    }),
    position: new Vector2(300, 100),
    body: new RigidBody({
        velocity: new Vector2(0, 0),
        restitution: 0.8
    }),
    collider: new CircleCollider({ radius: 20 })
});

// Floor - infinite mass
const floor = new Entity({
    sprite: new Sprite({
        width: 600,
        height: 600,
        texture: await createImageBitmap(await (await fetch("./bird.png")).blob())
    }),
    position: new Vector2(300, 550),
    body: new RigidBody({ mass: Infinity }),
    collider: new BoxCollider({ width: 600, height: 600 })
});

// Create scene and add player
const scene = new MainScene(ball, floor);
scene.addEntity(ball);
scene.addEntity(floor);

// Set scene and start game loop
game.setScene(scene);
game.start();
