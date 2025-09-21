import { defineStore } from 'pinia';
import type { Track } from '@/types/player';
import { usePlayerStore } from './player.store';

export const useQueueStore = defineStore('queue', {
    state: () => ({
        items: [] as Track[],
        index: -1,
    }),
    getters: {
        current(state) {
            return state.items[state.index] || null;
        },
        hasPrev(state) {
            return state.index > 0;
        },
        hasNext(state) {
            return state.index >= 0 && state.index < state.items.length - 1;
        },
    },
    actions: {
        enqueue(t: Track) {
            this.items.push(t);
        },
        enqueueMany(list: Track[]) {
            this.items.push(...list);
        },
        clear() {
            this.items = []; this.index = -1;
        },
        remove(i: number) {
            this.items.splice(i, 1);
            if (i <= this.index) this.index = Math.max(0, this.index - 1);
        },
        jumpTo(i: number) {
            this.index = Math.max(0, Math.min(i, this.items.length - 1));
        },
        playNow(t: Track) {
            const player = usePlayerStore();
            const idx = this.items.findIndex((x) => x.id === t.id);
            if (idx === -1) {
                this.items.splice(this.index + 1, 0, t);
                this.index += 1;
            } else {
                this.index = idx;
            }
            player.play(t);
        },
        shuffleInPlace() {
            for (let i = this.items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.items[i], this.items[j]] = [this.items[j], this.items[i]];
            }
            this.index = Math.min(this.index, this.items.length - 1);
        },
        next(opts?: { fromEnded?: boolean; shuffle?: boolean }): boolean {
            const player = usePlayerStore();

            if (opts?.shuffle && this.items.length > 1) {
                // Pick a random other index
                let nextIdx = this.index;
                while (nextIdx === this.index) {
                    nextIdx = Math.floor(Math.random() * this.items.length);
                }
                this.index = nextIdx;
                player.play(this.items[this.index]);
                return true;
            }

            if (this.index < this.items.length - 1) {
                this.index += 1;
                player.play(this.items[this.index]);
                return true;
            }

            // end of queue
            return false;
        },
        prev() {
            const player = usePlayerStore();
            if (this.index > 0) {
                this.index -= 1;
                player.play(this.items[this.index]);
            } else {
                // restart current
                player.seek(0);
            }
        },
    },
});
