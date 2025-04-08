<template>
  <div id="app">
    <Header v-if="showHeader" />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';

const route = useRoute();

const noHeaderRoutes = ['Login'];
const showHeader = computed(() => !noHeaderRoutes.includes(route.name));
</script>

<style>
body {
  margin: 0;
  font-family: 'Noto Sans JP', sans-serif;
  color: #3e3e3e;
}
</style>