<script setup lang="ts">
import { gamesCollection } from '../firebase';
import { useCollection } from 'vuefire';

const games = useCollection(gamesCollection);
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
  </main>
</template>
