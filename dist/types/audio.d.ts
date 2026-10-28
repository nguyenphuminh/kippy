export declare class AudioBus {
    input: GainNode;
    private _volume;
    private _muted;
    constructor(context: BaseAudioContext, destination: AudioNode);
    get volume(): number;
    set volume(value: number);
    get muted(): boolean;
    set muted(value: boolean);
    private apply;
}
export declare class AudioManager {
    private _context?;
    private _master?;
    buses: Map<string, AudioBus>;
    unlocked: boolean;
    paused: boolean;
    hidden: boolean;
    listening: boolean;
    focused: boolean;
    instances: Set<SoundInstance>;
    get context(): AudioContext;
    get master(): AudioBus;
    sync(): void;
    bus(name: string): AudioBus;
    get volume(): number;
    set volume(value: number);
    get muted(): boolean;
    set muted(value: boolean);
    get isPaused(): boolean;
    pause(): void;
    resume(): void;
    stopAll(): void;
    unlock(): void;
    listen(target?: EventTarget): void;
}
export declare const audio: AudioManager;
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
export declare class Sound {
    src: string | AudioBuffer;
    volume: number;
    loop: boolean;
    bus: string;
    maxInstances: number;
    buffer?: AudioBuffer;
    loading?: Promise<this>;
    instances: Set<SoundInstance>;
    constructor(options: SoundOptions);
    get loaded(): boolean;
    load(): Promise<this>;
    static loadAll(sounds: Sound[]): Promise<Sound[]>;
    fetchBuffer(): Promise<this>;
    play(options?: PlayOptions): SoundInstance | null;
    stopAll(): void;
}
export type SoundState = "playing" | "paused" | "stopped";
export declare class SoundInstance {
    sound: Sound;
    onEnd?: () => void;
    gain: GainNode;
    loop: boolean;
    source: AudioBufferSourceNode | null;
    rate: number;
    offset: number;
    startedAt: number;
    fadingOut: boolean;
    private _volume;
    state: SoundState;
    constructor(sound: Sound, options?: PlayOptions);
    start(): void;
    finish(): void;
    get duration(): number;
    get position(): number;
    get volume(): number;
    set volume(value: number);
    get pitch(): number;
    set pitch(value: number);
    fadeTo(volume: number, duration: number): void;
    fadeOut(duration: number): void;
    pause(): void;
    resume(): void;
    stop(): void;
    killSource(): void;
}
