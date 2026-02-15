import { Vector2 } from "./vector";
export class Input {
    canvas;
    keys = new Set(); // Key on hold
    keysPressed = new Set(); // Key pressed
    keysReleased = new Set(); // Key released
    pointer = new Vector2(0, 0);
    pointers = new Set(); // Mouse/touch on hold
    pointersPressed = new Set(); // Mouse/touch pressed 
    pointersReleased = new Set(); // Mouse/touch released
    constructor(options) {
        this.canvas = options.canvas;
        // Keyboard
        window.addEventListener("keydown", (e) => {
            if (!this.keys.has(e.key)) {
                this.keysPressed.add(e.key);
            }
            this.keys.add(e.key);
        });
        window.addEventListener("keyup", (e) => {
            this.keys.delete(e.key);
            this.keysReleased.add(e.key);
        });
        // Mouse and touch
        this.canvas.addEventListener("mousemove", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.pointer.x = e.clientX - rect.left;
            this.pointer.y = e.clientY - rect.top;
        });
        this.canvas.addEventListener("mousedown", (e) => {
            if (!this.pointers.has(e.button)) {
                this.pointersPressed.add(e.button);
            }
            this.pointers.add(e.button);
        });
        this.canvas.addEventListener("mouseup", (e) => {
            this.pointers.delete(e.button);
            this.pointersReleased.add(e.button);
        });
        this.canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.pointer.x = touch.clientX - rect.left;
            this.pointer.y = touch.clientY - rect.top;
        });
        this.canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            if (!this.pointers.has(2)) {
                this.pointersPressed.add(2);
            }
            this.pointers.add(2);
        });
        this.canvas.addEventListener("touchend", (e) => {
            e.preventDefault();
            this.pointers.delete(2);
            this.pointersReleased.add(2);
        });
        // Prevent right-click menu
        this.canvas.addEventListener("contextmenu", (e) => {
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
    isKeyDown(key) {
        return this.keys.has(key);
    }
    isKeyPressed(key) {
        return this.keysPressed.has(key);
    }
    isKeyReleased(key) {
        return this.keysReleased.has(key);
    }
    isPointerDown(button = 0) {
        return this.pointers.has(button);
    }
    isPointerPressed(button = 0) {
        return this.pointersPressed.has(button);
    }
    isPointerReleased(button = 0) {
        return this.pointersReleased.has(button);
    }
}
