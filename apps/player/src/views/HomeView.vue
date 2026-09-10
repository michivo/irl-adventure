<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import { gamesCollection } from '../firebase';
import { useCollection } from 'vuefire';
import { Geolocation, type Position } from '@capacitor/geolocation';
import { useLocationTracking } from '../composables/useLocationTracking';
import { toErrorMessage, useLogger } from '../composables/useLogger';
import LogPanel from '../components/LogPanel.vue';

const NYAN_CAT_LATITUDE_TRIGGER = 47.033;
const NYAN_CAT_PREVIEW_COOLDOWN_SECONDS = 30;

const games = useCollection(gamesCollection);
const currentPosition = ref<Position | null>(null);
const nyanCatAudio = useTemplateRef('nyan-cat-audio');
const { logError } = useLogger('HomeView');
const { isTracking, toggle: toggleLocationTracking } = useLocationTracking();
let lastAudioPlayTime = 0;
let locationWatchId: string | null = null;

onMounted(async () => {
  try {
    locationWatchId = await Geolocation.watchPosition({ enableHighAccuracy: true }, (position, error) => {
      if (error) {
        logError(`Geolocation error: ${toErrorMessage(error)}`);
        currentPosition.value = null;
        return;
      }
      currentPosition.value = position;
      if (currentPosition.value && currentPosition.value.coords.latitude < NYAN_CAT_LATITUDE_TRIGGER) {
        playNyanCatPreview();
      }
    });
  } catch (error) {
    logError(`Failed to watch position: ${toErrorMessage(error)}`);
  }
});

onBeforeUnmount(() => {
  if (locationWatchId) {
    Geolocation.clearWatch({ id: locationWatchId });
    locationWatchId = null;
  }
});

function playNyanCatPreview() {
  const justPlayed = (Date.now() - lastAudioPlayTime) / 1000 < NYAN_CAT_PREVIEW_COOLDOWN_SECONDS;
  if (!justPlayed) {
    nyanCatAudio.value?.play();
    lastAudioPlayTime = Date.now();
  }
}
</script>

<template>
  <main class="flex flex-col items-stretch justify-stretch min-h-screen">
    <h1>IRL Adventure</h1>
    <p>Your next real-world adventure starts here. Games:</p>
    <div class="flex flex-col items-stretch">
      <UButton @click="playNyanCatPreview()">Play Nyan Cat</UButton>
      <UButton @click="toggleLocationTracking()">{{ isTracking ? 'Stop Tracking' : 'Track Location' }}</UButton>
    </div>
    {{ games.length ?? 0 }} game(s) available.
    <ul>
      <li v-for="game in games" :key="game.id">{{ game.name }} - {{ game.id }}</li>
    </ul>
    <p v-if="currentPosition">Current Position: {{ currentPosition.coords.latitude }}, {{
      currentPosition.coords.longitude }}</p>
    <p v-else>Current Position: Not available</p>
    <figure>
      <figcaption>Listen to the Nyan Cat:</figcaption>
      <audio controls src="https://www.nyan.cat/music/original.mp3" ref="nyan-cat-audio"></audio>
      <a href="https://www.nyan.cat/music/original.mp3"> Download audio </a>
    </figure>
    <LogPanel />
  </main>
</template>
