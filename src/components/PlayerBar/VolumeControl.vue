<script setup lang="ts">
const props = defineProps<{ volume: number; muted: boolean }>();
const emit = defineEmits<{
  (e: 'update:volume', v: number): void;
  (e: 'toggle-mute'): void;
}>();
</script>

<template>
  <div class="vol">
    <button class="icon" @click="emit('toggle-mute')">
      {{ muted ? '🔇' : '🔊' }}
    </button>
    <input
        type="range"
        min="0" max="1" step="0.01"
        :value="volume"
        @input="(e:any)=>emit('update:volume', Number(e.target.value))"
    />
  </div>
</template>

<style scoped>
.vol { display:flex; align-items:center; gap:8px; }
.icon { border:1px solid var(--border); border-radius:10px; background:var(--surface-2); padding:4px 8px; }
</style>
