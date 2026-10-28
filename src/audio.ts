// A volume group that sounds play through, e.g. "music" or "sfx"
export class AudioBus {
    public input: GainNode;
    private _volume = 1;
    private _muted = false;
 
    constructor(context: BaseAudioContext, destination: AudioNode) {
        this.input = context.createGain();
        this.input.connect(destination);
    }
 
    get volume() {
        return this._volume;
    }
 
    set volume(value: number) {
        this._volume = value;
        this.apply();
    }
 
    get muted() {
        return this._muted;
    }
 
    set muted(value: boolean) {
        this._muted = value;
        this.apply();
    }
 
    private apply() {
        this.input.gain.value = this._muted ? 0 : this._volume;
    }
}

// Shared audio output for the whole game: one AudioContext, a master bus, and named buses
export class AudioManager {
    private _context?: AudioContext;
    private _master?: AudioBus;
    public buses = new Map<string, AudioBus>();
    public unlocked = false;
    public paused = false;
    public hidden = false;
    public listening = false;
    public focused = true;

    public instances = new Set<SoundInstance>();

    // Created lazily so importing the engine never touches audio until it's needed
    get context(): AudioContext {
        if (!this._context) {
            this._context = new AudioContext();
            this._master = new AudioBus(this._context, this._context.destination);
            this.sync();
        }
 
        return this._context;
    }

    get master(): AudioBus {
        this.context;
        return this._master!;
    }

    sync() {
        const ctx = this._context;
        if (!ctx || ctx.state === "closed") return;
 
        const shouldRun = this.unlocked && !this.paused && !this.hidden && this.focused;
 
        if (shouldRun && ctx.state !== "running") {
            ctx.resume().catch(() => {});
        } else if (!shouldRun && ctx.state === "running") {
            ctx.suspend().catch(() => {});
        }
    }

    bus(name: string): AudioBus {
        let bus = this.buses.get(name);
 
        if (!bus) {
            bus = new AudioBus(this.context, this.master.input);
            this.buses.set(name, bus);
        }
 
        return bus;
    }

    get volume() {
        return this.master.volume;
    }
 
    set volume(value: number) {
        this.master.volume = value;
    }
 
    get muted() {
        return this.master.muted;
    }
 
    set muted(value: boolean) {
        this.master.muted = value;
    }
 
    get isPaused() {
        return this.paused;
    }

    pause() {
        this.paused = true;
        this.sync();
    }
 
    resume() {
        this.paused = false;
        this.sync();
    }
 
    stopAll() {
        for (const instance of [...this.instances]) instance.stop();
    }

    // Browsers only allow audio to start from inside a user input event
    unlock() {
        this.unlocked = true;
        this.context;
        this.sync();
    }
 
    // Unlock on the first interaction, and pause while the tab is hidden
    listen(target: EventTarget = window) {
        if (this.listening) return;
        this.listening = true;
 
        // Kept after the first unlock, since iOS can interrupt audio (e.g. a phone call)
        const onInput = () => this.unlock();
 
        for (const type of ["pointerdown", "keydown", "touchend"]) {
            target.addEventListener(type, onInput);
        }
 
        document.addEventListener("visibilitychange", () => {
            this.hidden = document.hidden;
            this.sync();
        });

        window.addEventListener("blur", () => { this.focused = false; this.sync(); });
        window.addEventListener("focus", () => { this.focused = true; this.sync(); });
    }
}

export const audio = new AudioManager();

export interface SoundOptions {
    src: string | AudioBuffer;
    volume?: number;
    loop?: boolean;
    bus?: string;
    maxInstances?: number;
}

export interface PlayOptions {
    volume?: number;
    pitch?: number;
    loop?: boolean;
    offset?: number;
    fadeIn?: number;
}

// User-facing class to create and play sounds, each sound played is a SoundInstance
export class Sound {
    public src: string | AudioBuffer;
    public volume: number;
    public loop: boolean;
    public bus: string;
    public maxInstances: number;
    public buffer?: AudioBuffer;

    public loading?: Promise<this>;

    public instances = new Set<SoundInstance>();

    constructor(options: SoundOptions) {
        this.src = options.src;
        this.volume = options.volume ?? 1;
        this.loop = options.loop ?? false;
        this.bus = options.bus ?? "sfx";
        this.maxInstances = options.maxInstances ?? 8;

        if (typeof options.src !== "string") {
            this.buffer = options.src;
        }
    }

    get loaded() {
        return typeof this.buffer !== "undefined";
    }

    load(): Promise<this> {
        if (this.buffer) return Promise.resolve(this);
 
        if (!this.loading) {
            this.loading = this.fetchBuffer().catch(error => {
                // Allow retrying after a failed load
                delete this.loading;
                throw error;
            });
        }
 
        return this.loading;
    }

    static loadAll(sounds: Sound[]) {
        return Promise.all(sounds.map(sound => sound.load()));
    }

    async fetchBuffer(): Promise<this> {
        const src = this.src as string;
        const response = await fetch(src);
 
        if (!response.ok) {
            throw new Error(`Failed to load sound "${src}" (${response.status})`);
        }
 
        this.buffer = await audio.context.decodeAudioData(await response.arrayBuffer());
 
        return this;
    }

    play(options: PlayOptions = {}): SoundInstance | null {
        if (!this.buffer) {
            console.warn(`Sound "${this.src}" was played before it finished loading`);
            return null;
        }
 
        // Sets keep insertion order, so the first instance is the oldest
        while (this.instances.size > 0 && this.instances.size >= this.maxInstances) {
            this.instances.values().next().value?.stop();
        }
 
        return new SoundInstance(this, options);
    }
 
    stopAll() {
        for (const instance of [...this.instances]) instance.stop();
    }
}

export type SoundState = "playing" | "paused" | "stopped";

// One playback of a Sound
export class SoundInstance {
    public sound: Sound;
    public onEnd?: () => void;

    public gain: GainNode;
    public loop: boolean;
    public source: AudioBufferSourceNode | null = null;
    public rate: number;
    public offset: number; // Position in seconds at the moment the current source started
    public startedAt = 0; // Context time when the current source started
    public fadingOut = false;
    private _volume: number;
    public state: SoundState = "playing";

    constructor(sound: Sound, options: PlayOptions = {}) {
        const ctx = audio.context;

        this.sound = sound;
        this.loop = options.loop ?? sound.loop;
        this.rate = options.pitch ?? 1;
        this.offset = options.offset ?? 0;
        this._volume = sound.volume * (options.volume ?? 1);

        this.gain = ctx.createGain();
        this.gain.connect(audio.bus(sound.bus).input);

        if (options.fadeIn) {
            this.gain.gain.setValueAtTime(0, ctx.currentTime);
            this.gain.gain.linearRampToValueAtTime(this._volume, ctx.currentTime + options.fadeIn);
        } else {
            this.gain.gain.value = this._volume;
        }
 
        sound.instances.add(this);
        audio.instances.add(this);
        this.start();
    }

    start() {
        const ctx = audio.context;
        const source = ctx.createBufferSource();
 
        source.buffer = this.sound.buffer ?? null;
        source.loop = this.loop;
        source.playbackRate.value = this.rate;
        source.connect(this.gain);
 
        source.onended = () => {
            if (this.source !== source) return;
 
            this.source = null;
            this.finish();
        };
 
        source.start(0, this.offset);
        this.startedAt = ctx.currentTime;
        this.source = source;
    }

    finish() {
        if (this.state === "stopped") return;
 
        this.state = "stopped";
        this.gain.disconnect();
        this.sound.instances.delete(this);
        audio.instances.delete(this);
        this.onEnd?.();
    }

    // Utilities
    get duration() {
        return this.sound.buffer!.duration;
    }

    get position() {
        let position = this.offset;
 
        if (this.state === "playing") {
            position += (audio.context.currentTime - this.startedAt) * this.rate;
        }
 
        return this.loop ? position % this.duration : Math.min(position, this.duration);
    }

    get volume() {
        return this._volume;
    }
 
    set volume(value: number) {
        const param = this.gain.gain;
        const now = audio.context.currentTime;
 
        param.cancelScheduledValues(now);
        param.setValueAtTime(value, now);
        this._volume = value;
    }

    get pitch() {
        return this.rate;
    }
 
    set pitch(value: number) {
        // Save the position first, since it advances at the old rate until now
        if (this.state === "playing") {
            this.offset = this.position;
            this.startedAt = audio.context.currentTime;
        }
 
        this.rate = value;
        if (this.source) this.source.playbackRate.value = value;
    }

    fadeTo(volume: number, duration: number) {
        const param = this.gain.gain;
        const now = audio.context.currentTime;
 
        param.cancelScheduledValues(now);
        param.setValueAtTime(param.value, now);
        param.linearRampToValueAtTime(volume, now + duration);
        this._volume = volume;
    }
 
    // Fade to silence, then stop
    fadeOut(duration: number) {
        if (this.state !== "playing" || !this.source) {
            this.stop();
            return;
        }
 
        this.fadingOut = true;
        this.fadeTo(0, duration);
        this.source.stop(audio.context.currentTime + duration);
    }

    pause() {
        if (this.state !== "playing") return;
 
        // A paused fade-out would otherwise resume as a silent, endless sound
        if (this.fadingOut) {
            this.stop();
            return;
        }
 
        this.offset = this.position;
        this.state = "paused";
        this.killSource();
    }
 
    resume() {
        if (this.state !== "paused") return;
 
        this.state = "playing";
        this.start();
    }
 
    stop() {
        if (this.state === "stopped") return;
 
        this.killSource();
        this.finish();
    }

    killSource() {
        const source = this.source;
        if (!source) return;
 
        // Cleared first so the onended handler ignores this stop
        this.source = null;
        source.onended = null;
        source.stop();
        source.disconnect();
    }
}
