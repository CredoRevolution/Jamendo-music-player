import { onMounted, onBeforeUnmount } from 'vue';
import { usePlayerStore } from '@/stores/player.store';

export function useKeyboardShortcuts() {
    const player = usePlayerStore();

    function onKey(e: KeyboardEvent) {
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

        switch (e.key) {
            case ' ':
                e.preventDefault();
                player.togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                player.seek(Math.max(0, player.currentTime - 10));
                break;
            case 'ArrowRight':
                e.preventDefault();
                player.seek(player.currentTime + 10);
                break;
            case 'ArrowUp':
                e.preventDefault();
                player.setVolume(Math.min(1, player.volume + 0.05));
                break;
            case 'ArrowDown':
                e.preventDefault();
                player.setVolume(Math.max(0, player.volume - 0.05));
                break;
            case 's':
            case 'S':
                player.toggleShuffle();
                break;
            case 'r':
            case 'R':
                player.setRepeat(player.repeat === 'off' ? 'one' : player.repeat === 'one' ? 'all' : 'off');
                break;
        }
    }

    onMounted(() => window.addEventListener('keydown', onKey));
    onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
}
