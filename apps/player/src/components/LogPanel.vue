<script setup lang="ts">
import { useLogEntries } from '../composables/useLogger';

const entries = useLogEntries();

const levelClasses: Record<string, string> = {
  info: 'text-gray-300',
  warn: 'text-yellow-400',
  error: 'text-red-400',
};
</script>

<template>
  <section class="flex flex-col border-t border-gray-700 mt-auto">
    <h2 class="text-sm font-semibold px-2 pt-2">Logs</h2>
    <p v-if="!entries.length" class="text-xs text-gray-500 px-2 pb-2">No log entries yet.</p>
    <ul v-else class="flex flex-col-reverse overflow-y-auto max-h-40 font-mono text-xs px-2 pb-2">
      <li v-for="entry in entries" :key="entry.id" :class="levelClasses[entry.level]">
        {{ entry.timestamp.toLocaleTimeString() }} [{{ entry.source }}] {{ entry.message }}
      </li>
    </ul>
  </section>
</template>
