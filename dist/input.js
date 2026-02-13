export class Input {
    canvas;
    keys = new Set(); // Key on hold
    keysPressed = new Set(); // Key pressed
    keysReleased = new Set(); // Key released
    mouseX = 0; // Mouse coord x in canvas
    mouseY = 0; // Mouse coord y in canvas
    mouseButtons = new Set(); // Mouse button on hold
    mousePressed = new Set(); // Mouse button pressed 
    mouseReleased = new Set(); // Mouse button released
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
        // Mouse
        this.canvas.addEventListener("mousemove", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        this.canvas.addEventListener("mousedown", (e) => {
            if (!this.mouseButtons.has(e.button)) {
                this.mousePressed.add(e.button);
            }
            this.mouseButtons.add(e.button);
        });
        this.canvas.addEventListener("mouseup", (e) => {
            this.mouseButtons.delete(e.button);
            this.mouseReleased.add(e.button);
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
        this.mousePressed.clear();
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
    isMouseDown(button = 0) {
        return this.mouseButtons.has(button);
    }
    isMousePressed(button = 0) {
        return this.mousePressed.has(button);
    }
    isMouseReleased(button = 0) {
        return this.mouseReleased.has(button);
    }
}
