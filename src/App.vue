<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts';
useKeyboardShortcuts();
</script>

<template>
  <div class="app">
    <header class="top">
      <nav>
        <RouterLink to="/search">Search</RouterLink>
        <RouterLink to="/now-playing">Now Playing</RouterLink>
        <RouterLink to="/queue">Queue</RouterLink>
        <RouterLink to="/playlists">Playlists</RouterLink>
        <RouterLink to="/favorites">Favorites</RouterLink>
        <RouterLink to="/settings">Settings</RouterLink>
      </nav>
    </header>

    <main class="content">
      <RouterView />
    </main>

    <PlayerBar />
  </div>
</template>

<style scoped lang="scss">
.top { position: sticky; top: 0; background: var(--bg); border-bottom: 1px solid var(--border); }
nav { display: flex; gap: 12px; padding: 10px 14px; flex-wrap: wrap; }
.content { padding-bottom: 84px; } /* space for player bar */
</style>
