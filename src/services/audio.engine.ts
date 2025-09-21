// Simple wrapper over HTMLAudioElement with Media Session integration.
// Single shared <audio> instance, lazy-created.

import type { Track } from '@/types/player';
import { useQueueStore } from '@/stores/queue.store';
import { usePlayerStore } from '@/stores/player.store';

type Cbs = {
    onTime?: (current: number) => void;
    onDuration?: (dur: number) => void;
    onEnded?: () => void;
};

class AudioEngine {
    private audio?: HTMLAudioElement;
    private cbs: Cbs = {};

    private ensure(): HTMLAudioElement {
        if (!this.audio) {
            const a = new Audio();
            a.preload = 'metadata';
            a.crossOrigin = 'anonymous';

            a.addEventListener('loadedmetadata', () => {
                this.cbs.onDuration?.(isFinite(a.duration) ? a.duration : 0);
            });
            a.addEventListener('timeupdate', () => {
                this.cbs.onTime?.(a.currentTime || 0);
            });
            a.addEventListener('ended', () => {
                this.cbs.onEnded?.();
            });

            this.audio = a;
        }
        return this.audio;
    }

    setCallbacks(cbs: Cbs) {
        this.cbs = cbs;
    }

    load(url: string) {
        const a = this.ensure();
        if (a.src !== url) a.src = url;
    }

    async play() {
        const a = this.ensure();
        await a.play();
    }

    pause() {
        this.ensure().pause();
    }

    seek(seconds: number) {
        const a = this.ensure();
        a.currentTime = Math.max(0, Math.min(seconds, a.duration || seconds));
    }

    setVolume(v: number) {
        this.ensure().volume = Math.min(1, Math.max(0, v));
    }

    setMuted(m: boolean) {
        this.ensure().muted = m;
    }

    get currentTime() {
        return this.ensure().currentTime || 0;
    }

    get duration() {
        const d = this.ensure().duration;
        return Number.isFinite(d) ? d : 0;
    }

    /**
     * Configure Media Session metadata & handlers
     */
    setMediaSession(track: Track | null) {
        if (!('mediaSession' in navigator)) return;
        const queue = useQueueStore();
        const player = usePlayerStore();

        if (track) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (navigator as any).mediaSession.metadata = new (window as any).MediaMetadata(
                {
                    title: track.title,
                    artist: track.artist,
                    album: track.album,
                    artwork: track.image
                        ? [{ src: track.image, sizes: '200x200', type: 'image/jpeg' }]
                        : [],
                }
            );
        }

        navigator.mediaSession.setActionHandler?.('play', async () => {
            await player.play();
        });
        navigator.mediaSession.setActionHandler?.('pause', () => {
            player.pause();
        });
        navigator.mediaSession.setActionHandler?.('previoustrack', () => {
            queue.prev();
        });
        navigator.mediaSession.setActionHandler?.('nexttrack', () => {
            queue.next();
        });
        navigator.mediaSession.setActionHandler?.('seekto', (d: unknown) => {
            const detail = d as { seekTime?: number };
            if (typeof detail.seekTime === 'number') this.seek(detail.seekTime);
        });
    }
}

export const audioEngine = new AudioEngine();
