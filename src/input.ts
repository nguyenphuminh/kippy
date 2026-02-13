export interface InputOptions {
    canvas: HTMLCanvasElement;
}

export class Input {
    public canvas: HTMLCanvasElement;

    public keys = new Set<string>(); // Key on hold
    public keysPressed = new Set<string>(); // Key pressed
    public keysReleased = new Set<string>(); // Key released

    public mouseX = 0; // Mouse coord x in canvas
    public mouseY = 0; // Mouse coord y in canvas

    public mouseButtons = new Set<number>(); // Mouse button on hold
    public mousePressed = new Set<number>(); // Mouse button pressed 
    public mouseReleased = new Set<number>(); // Mouse button released

    constructor(options: InputOptions) {
        this.canvas = options.canvas;

        // Keyboard
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (!this.keys.has(e.key)) {
                this.keysPressed.add(e.key);
            }
            this.keys.add(e.key);
        })

        window.addEventListener("keyup", (e: KeyboardEvent) => {
            this.keys.delete(e.key);
            this.keysReleased.add(e.key);
        })

        // Mouse
        this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        })

        this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            if (!this.mouseButtons.has(e.button)) {
                this.mousePressed.add(e.button);
            }
            this.mouseButtons.add(e.button);
        })

        this.canvas.addEventListener("mouseup", (e: MouseEvent) => {
            this.mouseButtons.delete(e.button);
            this.mouseReleased.add(e.button);
        })

        // Prevent right-click menu
        this.canvas.addEventListener("contextmenu", (e: MouseEvent) => {
            e.preventDefault();
        })
    }

    // Called every frames
    update() {
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.mousePressed.clear();
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

    isMouseDown(button = 0): boolean {
        return this.mouseButtons.has(button);
    }

    isMousePressed(button = 0): boolean {
        return this.mousePressed.has(button);
    }

    isMouseReleased(button = 0): boolean {
        return this.mouseReleased.has(button);
    }
}
