<script setup lang="ts">
import type { Track } from '@/types/player';
import { usePlayerStore } from '@/stores/player.store';
import { useQueueStore } from '@/stores/queue.store';
import { useLibraryStore } from '@/stores/library.store';

const props = defineProps<{
  track: Track;
  compact?: boolean;
}>();

const player = usePlayerStore();
const queue = useQueueStore();
const library = useLibraryStore();

function playNow() {
  // Put this track at current index and play
  queue.playNow(props.track);
}

function addToQueue() {
  queue.enqueue(props.track);
}

function toggleFav() {
  library.toggleFavorite(props.track);
}

const sourceUrl = props.track.shareUrl || props.track.albumShareUrl;
</script>

<template>
  <div class="track-card" :class="{ compact }">
    <img class="cover" :src="track.image" :alt="track.album || track.title" />
    <div class="meta">
      <div class="title" :title="track.title">{{ track.title }}</div>
      <div class="sub">
        <span class="artist">{{ track.artist }}</span>
        <span v-if="track.album" class="sep">·</span>
        <span v-if="track.album" class="album">{{ track.album }}</span>
      </div>

      <div class="actions">
        <button class="btn" @click="playNow">Play</button>
        <button class="btn" @click="addToQueue">Add to queue</button>
        <button class="btn" @click="toggleFav">
          {{ library.isFavorite(track.id) ? '★ Favorited' : '☆ Favorite' }}
        </button>
      </div>

      <div class="source">
        Source:
        <a v-if="sourceUrl" :href="sourceUrl" target="_blank" rel="noopener">
          Jamendo
        </a>
        <span v-else>Jamendo</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.track-card {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  align-items: center;

  &.compact {
    grid-template-columns: 56px 1fr;
    .title { font-size: 0.95rem; }
  }

  .cover {
    width: 72px; height: 72px; border-radius: 8px; object-fit: cover;
    box-shadow: 0 1px 2px rgba(0,0,0,.1);
  }
  .meta {
    display: grid; gap: 6px;
  }
  .title { font-weight: 600; }
  .sub { color: var(--muted); font-size: .9rem; }
  .sep { margin: 0 6px; }
  .actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .btn {
    padding: 6px 10px; border-radius: 10px; border: 1px solid var(--border);
    background: var(--surface-2); cursor: pointer;
  }
  .source { font-size: .85rem; color: var(--muted); }
}
</style>
