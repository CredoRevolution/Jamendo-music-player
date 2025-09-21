import { defineStore } from 'pinia';
import type { Track, RepeatMode } from '@/types/player';
import { audioEngine } from '@/services/audio.engine';
import { useQueueStore } from './queue.store';

export const usePlayerStore = defineStore('player', {
    state: () => ({
        currentTrack: null as Track | null,
        isPlaying: false,
        volume: 0.9,
        muted: false,
        repeat: 'off' as RepeatMode, // 'off' | 'one' | 'all'
        shuffle: false,
        currentTime: 0,
        duration: 0,
    }),
    actions: {
        /**
         * Load and play a specific track or resume current
         */
        async play(track?: Track) {
            if (track) {
                this.currentTrack = track;
                audioEngine.load(track.audioUrl);
                audioEngine.setMediaSession(track);
            } else if (!this.currentTrack) {
                // nothing to play
                return;
            }

            audioEngine.setVolume(this.muted ? 0 : this.volume);
            audioEngine.setMuted(this.muted);

            // hook callbacks once
            audioEngine.setCallbacks({
                onTime: (t) => (this.currentTime = t),
                onDuration: (d) => (this.duration = d),
                onEnded: () => this.onEnded(),
            });

            try {
                await audioEngine.play();
                this.isPlaying = true;
            } catch (e) {
                this.isPlaying = false;
                // eslint-disable-next-line no-console
                console.error('Audio play failed', e);
            }
        },
        pause() {
            audioEngine.pause();
            this.isPlaying = false;
        },
        togglePlay() {
            if (this.isPlaying) this.pause();
            else this.play();
        },
        seek(sec: number) {
            audioEngine.seek(sec);
            this.currentTime = sec;
        },
        setVolume(v: number) {
            this.volume = Math.min(1, Math.max(0, v));
            if (!this.muted) audioEngine.setVolume(this.volume);
        },
        toggleMute() {
            this.muted = !this.muted;
            audioEngine.setMuted(this.muted);
            if (!this.muted) audioEngine.setVolume(this.volume);
        },
        setRepeat(mode: RepeatMode) {
            this.repeat = mode;
        },
        toggleShuffle() {
            this.shuffle = !this.shuffle;
        },
        /**
         * Called when the current track naturally ends
         */
        onEnded() {
            const queue = useQueueStore();

            if (this.repeat === 'one') {
                this.seek(0);
                this.play();
                return;
            }

            // Next track logic
            const advanced = queue.next({ fromEnded: true, shuffle: this.shuffle });
            if (!advanced) {
                // queue ended
                if (this.repeat === 'all') {
                    queue.jumpTo(0);
                    this.play(queue.items[0]);
                } else {
                    this.isPlaying = false;
                    this.currentTime = 0;
                }
            }
        },
    },
});
