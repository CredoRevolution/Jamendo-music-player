<script setup lang="ts">
const props = defineProps<{ current: number; duration: number }>();
const emit = defineEmits<{ (e: 'seek', value: number): void }>();

function onInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  emit('seek', val);
}
</script>

<template>
  <input
      class="progress"
      type="range"
      min="0"
      :max="Math.max(0, Math.floor(duration))"
      :value="Math.floor(current)"
      step="1"
      @input="onInput"
  />
</template>

<style scoped>
.progress { width: 100%; }
</style>
