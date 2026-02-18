import { Game, Scene, Entity, RigidBody, CircleCollider, BoxCollider, Sprite, Vector2 } from "../dist/bundle.min.js";

// ── Constants ────────────────────────────────────────────────────────────────
const GRAVITY        = 1800;
const FLAP_VELOCITY  = -500;
const PIPE_SPEED     = 220;
const PIPE_GAP       = 190;
const PIPE_INTERVAL  = 1.7;
const BIRD_RADIUS    = 22;
const PIPE_WIDTH     = 80;
const GROUND_H       = 80;

// ── Asset loading ────────────────────────────────────────────────────────────
function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

// ── UI refs ──────────────────────────────────────────────────────────────────
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

// ── Scene ────────────────────────────────────────────────────────────────────
class FlappyScene extends Scene {
    constructor(gameRef, assets) {
        super();
        this.gameRef = gameRef;
        this.assets  = assets;
    }

    get W() { return this.gameRef.canvas.width; }
    get H() { return this.gameRef.canvas.height; }
    get input() { return this.gameRef.input; }

    init() {
        this.score     = 0;
        this.dead      = false;
        this.started   = false;
        this.pipeTimer = 0;
        this.pipePairs = [];
        updateScore(0);

        const W = this.W, H = this.H;

        this.bird = new Entity({
            position: new Vector2(W * 0.25, H * 0.45),
            body: new RigidBody({ mass: 1, restitution: 0, sleepThreshold: 0 }),
            collider: new CircleCollider({ radius: BIRD_RADIUS }),
            sprite: this.assets.birdImg
                ? new Sprite({ texture: this.assets.birdImg, width: BIRD_RADIUS * 2, height: BIRD_RADIUS * 2 })
                : null,
        });
        this.bird.onCollisionEnter = () => { if (this.started) this.die(); };
        this.addEntity(this.bird);

        this.addEntity(new Entity({
            position: new Vector2(W / 2, H - GROUND_H / 2),
            collider: new BoxCollider({ width: W * 10, height: GROUND_H }),
        }));

        this.addEntity(new Entity({
            position: new Vector2(W / 2, -10),
            collider: new BoxCollider({ width: W * 10, height: 20 }),
        }));
    }

    spawnPipe() {
        const W = this.W, H = this.H;
        const playH    = H - GROUND_H;
        const minPipeH = 80;
        const minGapY  = minPipeH + PIPE_GAP / 2;
        const maxGapY  = playH - minPipeH - PIPE_GAP / 2;
        const gapCentY = minGapY + Math.random() * (maxGapY - minGapY);

        const topH    = gapCentY - PIPE_GAP / 2;
        const bottomH = H - (gapCentY + PIPE_GAP / 2);
        const startX  = W + PIPE_WIDTH / 2 + 10;
        const img     = this.assets.pipeImg;

        const makeFlippedImage = (source, w, h) => {
            const oc = new OffscreenCanvas(w, h);
            const octx = oc.getContext("2d");
            octx.scale(1, -1);
            octx.drawImage(source, 0, -h, w, h);
            return oc;
        };

        const makePipe = (x, y, h, flipY = false) => {
            const texture = flipY && img ? makeFlippedImage(img, PIPE_WIDTH, h) : img;
            const e = new Entity({
                position: new Vector2(x, y),
                body: new RigidBody({ mass: Infinity, restitution: 0, sleepThreshold: 0, velocity: new Vector2(-PIPE_SPEED, 0) }),
                collider: new BoxCollider({ width: PIPE_WIDTH, height: h }),
                sprite: texture ? new Sprite({ texture, width: PIPE_WIDTH, height: h }) : null,
            });
            return e;
        };

        const topPipe = makePipe(startX, topH / 2, topH, true);
        const botPipe = makePipe(startX, gapCentY + PIPE_GAP / 2 + bottomH / 2, bottomH, false);

        this.addEntity(topPipe);
        this.addEntity(botPipe);
        this.pipePairs.push({ top: topPipe, bot: botPipe, scored: false });
    }

    die() {
        if (this.dead) return;
        this.dead = true;
        if (this.score > bestScore) bestScore = this.score;
        this.bird.body.velocity = new Vector2(0, this.bird.body.velocity.y);
        setTimeout(() => {
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
        const flapped = input.isKeyPressed(" ") || input.isPointerPressed(0);

        if (this.dead) {
            if (flapped) {
                overlayEl.classList.add("hidden");
                this.gameRef.setScene(new FlappyScene(this.gameRef, this.assets));
            }
            return;
        }

        if (flapped) this.flap();
        if (!this.started) return;

        this.bird.body.force = new Vector2(0, GRAVITY * this.bird.body.mass);

        const vy = this.bird.body.velocity.y;
        this.bird.rotation = Math.max(-0.5, Math.min(1.2, vy / 500));

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

        if (this.bird.position.y - BIRD_RADIUS <= 0) this.die();
    }
}

// ── Bootstrap ────────────────────────────────────────────────────────────────
async function main() {
    const canvas = document.getElementById("canvas");

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();

    const game = new Game({ canvas });

    const [birdImg, pipeImg] = await Promise.all([
        loadImage("bird.png"),
        loadImage("pipe.png"),
    ]);
    const assets = { birdImg, pipeImg };

    window.addEventListener("resize", () => {
        resize();
        game.setScene(new FlappyScene(game, assets));
        showOverlay({ title: "FLAPPY BIRD", subtitle: "PRESS SPACE OR TAP" });
    });

    game.setScene(new FlappyScene(game, assets));
    game.start();

    showOverlay({ title: "FLAPPY BIRD", subtitle: "PRESS SPACE OR TAP" });
}

main();
