<script setup lang="ts">
import { ref } from 'vue';
import { searchTracks } from '@/services/jamendo.api';
import TrackList from '@/components/Tracks/TrackList.vue';

const q = ref('');
const loading = ref(false);
const results = ref([]);

async function doSearch() {
  loading.value = true;
  try {
    const { items } = await searchTracks(q.value, 1, 24);
    results.value = items;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="page">
    <h1>Search</h1>
    <form @submit.prevent="doSearch" class="search">
      <input v-model="q" placeholder="Track or artist…" />
      <button :disabled="!q || loading">Search</button>
    </form>

    <p v-if="!loading && !results.length">Try searching Jamendo catalog.</p>
    <p v-if="loading">Loading…</p>

    <TrackList v-if="results.length" :tracks="results" />
  </section>
</template>

<style scoped>
.search { display:flex; gap:8px; margin: 12px 0; }
.page { padding: 16px; }
</style>
