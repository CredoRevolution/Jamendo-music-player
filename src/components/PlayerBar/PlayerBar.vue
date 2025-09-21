<script setup lang="ts">
import { computed } from 'vue';
import { usePlayerStore } from '@/stores/player.store';
import { useQueueStore } from '@/stores/queue.store';
import ProgressBar from './ProgressBar.vue';
import VolumeControl from './VolumeControl.vue';
import { formatTime } from '@/utils/time';

const player = usePlayerStore();
const queue = useQueueStore();

const cover = computed(() => player.currentTrack?.image);
const title = computed(() => player.currentTrack?.title || 'Nothing playing');
const subtitle = computed(() => {
  const a = player.currentTrack?.artist;
  const b = player.currentTrack?.album;
  return [a, b].filter(Boolean).join(' · ');
});

const sourceUrl = computed(
    () => player.currentTrack?.shareUrl || player.currentTrack?.albumShareUrl
);

function toggleRepeat() {
  const next = player.repeat === 'off' ? 'one' : player.repeat === 'one' ? 'all' : 'off';
  player.setRepeat(next);
}
</script>

<template>
  <footer class="player-bar" role="contentinfo">
    <div class="left">
      <img v-if="cover" :src="cover" alt="cover" class="cover" />
      <div class="meta">
        <div class="title">{{ title }}</div>
        <div class="sub">{{ subtitle }}</div>
        <div class="source">
          Source:
          <a v-if="sourceUrl" :href="sourceUrl" target="_blank" rel="noopener">Jamendo</a>
          <span v-else>Jamendo</span>
        </div>
      </div>
    </div>

    <div class="center">
      <div class="controls">
        <button class="icon" @click="queue.prev()" :disabled="!queue.hasPrev">⏮</button>
        <button class="icon" @click="player.togglePlay()" :disabled="!player.currentTrack">
          {{ player.isPlaying ? '⏸' : '▶️' }}
        </button>
        <button class="icon" @click="queue.next()" :disabled="!queue.hasNext && player.repeat==='off'">⏭</button>
      </div>

      <div class="progress">
        <div class="time">{{ formatTime(player.currentTime) }}</div>
        <ProgressBar
            :current="player.currentTime"
            :duration="player.duration"
            @seek="player.seek"
        />
        <div class="time">{{ formatTime(player.duration) }}</div>
      </div>

      <div class="modes">
        <button class="chip" :class="{ active: player.shuffle }" @click="player.toggleShuffle()">Shuffle (S)</button>
        <button class="chip" :class="{ active: player.repeat!=='off' }" @click="toggleRepeat()">Repeat: {{ player.repeat.toUpperCase() }} (R)</button>
      </div>
    </div>

    <div class="right">
      <VolumeControl
          :volume="player.volume"
          :muted="player.muted"
          @update:volume="player.setVolume"
          @toggle-mute="player.toggleMute"
      />
    </div>
  </footer>
</template>

<style scoped lang="scss">
.player-bar {
  position: sticky; bottom: 0; inset-inline: 0;
  display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 12px;
  align-items: center;
  padding: 10px 14px;
  background: var(--bg);
  border-top: 1px solid var(--border);

  .left {
    display: flex; gap: 10px; align-items: center;
    .cover { width: 56px; height: 56px; border-radius: 10px; object-fit: cover; }
    .meta { display: grid; gap: 2px; }
    .title { font-weight: 600; }
    .sub { color: var(--muted); font-size: .9rem; }
    .source { color: var(--muted); font-size: .85rem; }
  }
  .center {
    display: grid; gap: 8px;
    .controls { display: flex; gap: 8px; justify-content: center; }
    .icon { padding: 6px 10px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface-2); }
    .progress { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 8px; }
    .time { font-variant-numeric: tabular-nums; font-size: .9rem; color: var(--muted); }
    .modes { display: flex; gap: 8px; justify-content: center; }
    .chip { padding: 4px 8px; border: 1px solid var(--border); border-radius: 999px; background: var(--surface); }
    .chip.active { border-color: var(--accent); }
  }
  .right { display: flex; justify-content: end; }
}
</style>
