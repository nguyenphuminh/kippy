import { Vector2 } from "./vector";

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

        // Keyboard
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (!this.keys.has(e.key)) {
                this.keysPressed.add(e.key);
            }
            this.keys.add(e.key);
        });

        window.addEventListener("keyup", (e: KeyboardEvent) => {
            this.keys.delete(e.key);
            this.keysReleased.add(e.key);
        });

        // Mouse and touch
        this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            this.pointer.x = e.clientX - rect.left;
            this.pointer.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            if (!this.pointers.has(e.button)) {
                this.pointersPressed.add(e.button);
            }
            this.pointers.add(e.button);
        });

        this.canvas.addEventListener("mouseup", (e: MouseEvent) => {
            this.pointers.delete(e.button);
            this.pointersReleased.add(e.button);
        });

        this.canvas.addEventListener("touchmove", (e: TouchEvent) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.pointer.x = touch.clientX - rect.left;
            this.pointer.y = touch.clientY - rect.top;
        });

        this.canvas.addEventListener("touchstart", (e: TouchEvent) => {
            e.preventDefault();
            if (!this.pointers.has(2)) {
                this.pointersPressed.add(2);
            }
            this.pointers.add(2);
        });

        this.canvas.addEventListener("touchend", (e: TouchEvent) => {
            e.preventDefault();
            this.pointers.delete(2);
            this.pointersReleased.add(2);
        });

        // Prevent right-click menu
        this.canvas.addEventListener("contextmenu", (e: MouseEvent) => {
            e.preventDefault();
        });
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
