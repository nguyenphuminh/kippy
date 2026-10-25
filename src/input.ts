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

    private updatePointer(e: PointerEvent) {
        const rect = this.canvas.getBoundingClientRect();
        this.pointer.x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        this.pointer.y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    }

    // Called every frames
    update() {
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.pointersPressed.clear();
        this.pointersReleased.clear();
    }

    // Helper methods
    isKeyDown(key: string): boolean {
        return this.keys.has(key);
    }

    isKeyPressed(key: string): boolean {
        return this.keysPressed.has(key);
    }

    isKeyReleased(key: string): boolean {
        return this.keysReleased.has(key);
    }

    isPointerDown(button = 0): boolean {
        return this.pointers.has(button);
    }

    isPointerPressed(button = 0): boolean {
        return this.pointersPressed.has(button);
    }

    isPointerReleased(button = 0): boolean {
        return this.pointersReleased.has(button);
    }
}
