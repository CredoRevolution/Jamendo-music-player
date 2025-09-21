<script setup lang="ts">
import type { Track } from '@/types/player';
import TrackCard from './TrackCard.vue';
defineProps<{ tracks: Track[] }>();
</script>

<template>
  <div class="grid">
    <TrackCard v-for="t in tracks" :key="t.id" :track="t" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}
</style>
