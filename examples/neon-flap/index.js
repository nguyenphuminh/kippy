import { Game, Scene, Entity, RigidBody, CircleCollider, BoxCollider, Sprite, Vector2 } from "../../dist/bundle.min.js";

// Constants
const GRAVITY        = 1800;
const FLAP_VELOCITY  = -500;
const PIPE_SPEED     = 220;
const PIPE_GAP       = 190;
const PIPE_INTERVAL  = 1.7;
const BIRD_RADIUS    = 22;
const PIPE_WIDTH     = 80;

// Neon palette
const BIRD_COLOR = "#ffe14d";
const DEAD_COLOR = "#ff3355";
const PIPE_COLOR = "#00f0ff";

// Textures are drawn once with the canvas API, then used as sprites
function makeCircleTexture(radius, color) {
    const canvas = new OffscreenCanvas(radius * 2, radius * 2);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    ctx.fill();
    return canvas;
}

function makeRectTexture(width, height, stroke, fill) {
    const canvas = new OffscreenCanvas(Math.ceil(width), Math.ceil(height));
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);
    return canvas;
}

// UI refs
const scoreEl      = document.getElementById("score");
const overlayEl    = document.getElementById("overlay");
const titleEl      = document.getElementById("overlay-title");
const subtitleEl   = document.getElementById("overlay-subtitle");
const finalScoreEl = document.getElementById("final-score");
const bestScoreEl  = document.getElementById("best-score");

let bestScore = 0;

function showOverlay({ title, subtitle, finalScore = null }) {
    titleEl.textContent = title;
    subtitleEl.textContent = subtitle;
    overlayEl.classList.remove("hidden");
    scoreEl.classList.remove("visible");
    if (finalScore !== null) {
        finalScoreEl.style.display = "block";
        finalScoreEl.textContent = `SCORE: ${finalScore}`;
        bestScoreEl.style.display = "block";
        bestScoreEl.textContent = `BEST:  ${bestScore}`;
    } else {
        finalScoreEl.style.display = "none";
        bestScoreEl.style.display = "none";
    }
}

function hideOverlay() {
    overlayEl.classList.add("hidden");
    scoreEl.classList.add("visible");
}

function updateScore(n) {
    scoreEl.textContent = n;
}

// Scene
class FlappyScene extends Scene {
    constructor(gameRef) {
        super();
        this.gameRef = gameRef;
    }

    get W() { return this.gameRef.canvas.width; }
    get H() { return this.gameRef.canvas.height; }
    get input() { return this.gameRef.input; }

    init() {
        this.score      = 0;
        this.dead       = false;
        this.started    = false;
        this.canRestart = false;
        this.pipeTimer  = 0;
        this.pipePairs  = [];
        updateScore(0);

        const W = this.W, H = this.H;

        this.bird = new Entity({
            position: new Vector2(W * 0.25, H * 0.45),
            body: new RigidBody({ mass: 1, restitution: 0, sleepThreshold: 0 }),
            collider: new CircleCollider({ radius: BIRD_RADIUS }),
            sprite: new Sprite({ texture: makeCircleTexture(BIRD_RADIUS, BIRD_COLOR) }),
            glow: { color: BIRD_COLOR, bloom: 20, intensity: 2 },
        });
        this.bird.onCollisionEnter = () => { if (this.started) this.die(); };
        this.addEntity(this.bird);
    }

    spawnPipe() {
        const W = this.W, H = this.H;
        const minPipeH = 80;
        const minGapY  = minPipeH + PIPE_GAP / 2;
        const maxGapY  = H - minPipeH - PIPE_GAP / 2;
        const gapCentY = minGapY + Math.random() * (maxGapY - minGapY);

        const topH    = gapCentY - PIPE_GAP / 2;
        const bottomH = H - (gapCentY + PIPE_GAP / 2);
        const startX  = W + PIPE_WIDTH / 2 + 10;

        const makePipe = (y, h) => new Entity({
            position: new Vector2(startX, y),
            body: new RigidBody({ mass: Infinity, restitution: 0, sleepThreshold: 0, velocity: new Vector2(-PIPE_SPEED, 0) }),
            collider: new BoxCollider({ width: PIPE_WIDTH, height: h }),
            sprite: new Sprite({ texture: makeRectTexture(PIPE_WIDTH, h, PIPE_COLOR, "rgba(0, 240, 255, 0.1)"), width: PIPE_WIDTH, height: h }),
            glow: { color: PIPE_COLOR, bloom: 15, intensity: 2 },
        });

        const topPipe = makePipe(topH / 2, topH);
        const botPipe = makePipe(H - bottomH / 2, bottomH);

        this.addEntity(topPipe);
        this.addEntity(botPipe);
        this.pipePairs.push({ top: topPipe, bot: botPipe, scored: false });
    }

    die() {
        if (this.dead) return;
        this.dead = true;
        if (this.score > bestScore) bestScore = this.score;

        this.bird.sprite.texture = makeCircleTexture(BIRD_RADIUS, DEAD_COLOR);
        this.bird.glow = { color: DEAD_COLOR, bloom: 20, intensity: 2 };

        // Freeze everything so the bird stays on screen without a floor to land on
        this.bird.body.velocity = new Vector2(0, 0);
        for (const pair of this.pipePairs) {
            pair.top.body.velocity = new Vector2(0, 0);
            pair.bot.body.velocity = new Vector2(0, 0);
        }

        setTimeout(() => {
            this.canRestart = true;
            showOverlay({ title: "GAME OVER", subtitle: "PRESS SPACE OR TAP", finalScore: this.score });
        }, 600);
    }

    flap() {
        if (this.dead) return;
        if (!this.started) {
            this.started = true;
            hideOverlay();
        }
        this.bird.body.velocity = new Vector2(0, FLAP_VELOCITY);
    }

    update(dt) {
        const input   = this.input;
        const flapped = input.isKeyPressed("Space") || input.isPointerPressed(0);

        if (this.dead) {
            if (flapped && this.canRestart) {
                overlayEl.classList.add("hidden");
                this.gameRef.setScene(new FlappyScene(this.gameRef));
            }
            return;
        }

        if (flapped) this.flap();
        if (!this.started) return;

        // Touching the top or bottom edge kills the bird, snapped to the edge so it stays visible
        const y = this.bird.position.y;
        if (y - BIRD_RADIUS <= 0 || y + BIRD_RADIUS >= this.H) {
            this.bird.position.y = Math.min(Math.max(y, BIRD_RADIUS), this.H - BIRD_RADIUS);
            this.die();
            return;
        }

        this.bird.body.force = new Vector2(0, GRAVITY * this.bird.body.mass);

        this.pipeTimer += dt;
        if (this.pipeTimer >= PIPE_INTERVAL) {
            this.pipeTimer = 0;
            this.spawnPipe();
        }

        for (const pair of this.pipePairs) {
            if (!pair.scored && pair.top.position.x < this.bird.position.x) {
                pair.scored = true;
                this.score++;
                updateScore(this.score);
            }
        }

        this.pipePairs = this.pipePairs.filter(pair => {
            if (pair.top.position.x < -PIPE_WIDTH - 10) {
                this.removeEntity(pair.top);
                this.removeEntity(pair.bot);
                return false;
            }
            return true;
        });
    }
}

// Bootstrap
function main() {
    const canvas = document.getElementById("canvas");

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();

    const game = new Game({ canvas });

    window.addEventListener("resize", () => {
        resize();
        game.setScene(new FlappyScene(game));
        showOverlay({ title: "FLAPPY BIRD", subtitle: "PRESS SPACE OR TAP" });
    });

    game.setScene(new FlappyScene(game));
    game.start();

    showOverlay({ title: "FLAPPY BIRD", subtitle: "PRESS SPACE OR TAP" });
}

main();
