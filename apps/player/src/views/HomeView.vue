<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import { gamesCollection } from '../firebase';
import { useCollection } from 'vuefire';
import { Geolocation, type Position } from '@capacitor/geolocation';

const games = useCollection(gamesCollection);
const currentPosition = ref<Position | null>(null);
const nyanCatAudio = useTemplateRef('nyan-cat-audio');

let locationWatchId = null as string | null;

onMounted(async () => {
  locationWatchId = await Geolocation.watchPosition({ enableHighAccuracy: true }, (position, err) => {
    if (err) {
      console.error(err);
      currentPosition.value = null;
      return;
    }
    currentPosition.value = position;
    if (currentPosition.value?.coords.latitude && currentPosition.value?.coords.latitude < 47.033) {
      nyanCatAudio.value?.play();
    }
  });
});

onBeforeUnmount(() => {
  if (locationWatchId) {
    Geolocation.clearWatch({ id: locationWatchId });
    locationWatchId = null;
  }
});
</script>

<template>
  <main>
    <h1>IRL Adventure</h1>
    <p>Your next real-world adventure starts here. Games:</p>
    <UAlert title="Ready to play?!" />
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
  </main>
</template>
