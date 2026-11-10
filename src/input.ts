import { Vector2 } from "./vector.js";

export interface InputOptions {
    canvas: HTMLCanvasElement;
}

export class Input {
    public canvas: HTMLCanvasElement;

    public keys = new Set<string>(); // Key on hold
    public keysPressed = new Set<string>(); // Key pressed
    public keysReleased = new Set<string>(); // Key released

    public pointer = new Vector2(0, 0);
    public pointers = new Set<number>(); // Mouse/touch on hold
    public pointersPressed = new Set<number>(); // Mouse/touch pressed 
    public pointersReleased = new Set<number>(); // Mouse/touch released

    public pads: (Gamepad | null)[] = [];
    public padPrev: boolean[][] = [];
    public padCurr: boolean[][] = [];
    public activePad = 0;


    constructor(options: InputOptions) {
        this.canvas = options.canvas;
        this.canvas.style.touchAction = "none"; // prevent scrolling/zooming while touching

        // Keyboard
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (!e.repeat) this.keysPressed.add(e.code);
            this.keys.add(e.code);
        });

        window.addEventListener("keyup", (e: KeyboardEvent) => {
            this.keys.delete(e.code);
            this.keysReleased.add(e.code);
        });

        // Mouse and touch
        this.canvas.addEventListener("pointermove", (e) => this.updatePointer(e));

        this.canvas.addEventListener("pointerdown", (e) => {
            this.updatePointer(e);
            this.canvas.setPointerCapture(e.pointerId);
            if (!this.pointers.has(e.button)) this.pointersPressed.add(e.button);
            this.pointers.add(e.button);
        });

        const release = (e: PointerEvent) => {
            this.updatePointer(e);
            this.pointers.delete(e.button);
            this.pointersReleased.add(e.button);
        };

        this.canvas.addEventListener("pointerup", release);
        this.canvas.addEventListener("pointercancel", release);

        // Prevent right-click menu
        this.canvas.addEventListener("contextmenu", (e: MouseEvent) => {
            e.preventDefault();
        });

        // If tab is switched, input handling must end immediately
        window.addEventListener("blur", () => {
            for (const k of this.keys) this.keysReleased.add(k);
            for (const b of this.pointers) this.pointersReleased.add(b);
            this.keys.clear();
            this.pointers.clear();
        });
    }

    updatePointer(e: PointerEvent) {
        const rect = this.canvas.getBoundingClientRect();
        this.pointer.x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        this.pointer.y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    }

    pollGamepads() {
        const pads = navigator.getGamepads?.() ?? [];
        this.padPrev = this.padCurr;
        this.padCurr = [];
        this.pads = [];


        for (const pad of pads) {
            if (!pad) continue;

            // Get active pad
            if (pad.buttons.some(b => b.pressed) || pad.axes.slice(0, 4).some(a => Math.abs(a) > 0.5)) {
                this.activePad = pad.index;
            }

            this.pads[pad.index] = pad;
            this.padCurr[pad.index] = pad.buttons.map(b => b.pressed);
        }

        if (!this.pads[this.activePad]) this.activePad = Math.max(0, this.pads.findIndex(p => p));
    }


    // Called every frames
    update() {
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.pointersPressed.clear();
        this.pointersReleased.clear();
    }


    // Keyboard APIs
    isKeyDown(key: string): boolean {
        return this.keys.has(key);
    }

    isKeyPressed(key: string): boolean {
        return this.keysPressed.has(key);
    }

    isKeyReleased(key: string): boolean {
        return this.keysReleased.has(key);
    }

    // Mouse/touch APIs
    isPointerDown(button = 0): boolean {
        return this.pointers.has(button);
    }

    isPointerPressed(button = 0): boolean {
        return this.pointersPressed.has(button);
    }

    isPointerReleased(button = 0): boolean {
        return this.pointersReleased.has(button);
    }

    // Gamepad APIs
    isButtonDown(button: number, padIndex = this.activePad) {
        return this.padCurr[padIndex]?.[button] ?? false;
    }

    isButtonPressed(button: number, padIndex = this.activePad) {
        return this.isButtonDown(button, padIndex) && !(this.padPrev[padIndex]?.[button] ?? false);
    }

    isButtonReleased(button: number, padIndex = this.activePad) {
        return !this.isButtonDown(button, padIndex) && (this.padPrev[padIndex]?.[button] ?? false);
    }

    getStick(side: "left" | "right", padIndex = this.activePad, deadzone = 0.15): Vector2 {
        const pad = this.pads[padIndex];

        if (!pad) return new Vector2(0, 0);

        const i = side === "left" ? 0 : 2;
        const x = pad.axes[i] ?? 0;
        const y = pad.axes[i + 1] ?? 0;
        const len = Math.hypot(x, y);

        if (len < deadzone) return new Vector2(0, 0);

        const scale = Math.min(1, (len - deadzone) / (1 - deadzone)) / len;

        return new Vector2(x * scale, y * scale);
    }
}

// Button to id map for gamepads
export const BUTTON = {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    LB: 4,
    RB: 5,
    LT: 6,
    RT: 7,
    SELECT: 8,
    START: 9,
    LS: 10,
    RS: 11,
    UP: 12,
    DOWN: 13,
    LEFT: 14,
    RIGHT: 15,
    HOME: 16
};
