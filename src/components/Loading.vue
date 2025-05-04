<template>
  <div v-if="visible" class="loader-overlay">
    <div class="spinner">
      <div class="spinner-bar" v-for="i in 12" :key="i" :style="barStyle(i)"></div>
    </div>
    <div class="loading-text">Loading...</div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean
})

const barStyle = (i) => {
  const rotate = (i - 1) * 30 // 360 / 12
  const delay = (i - 1) * 0.1
  return {
    transform: `rotate(${rotate}deg) translate(0, -10px)`,
    animationDelay: `${delay}s`,
  }
}
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-bar {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 18px;
  background-color: #5869ff;
  border-radius: 3px;
  transform-origin: center -20px;
  opacity: 0.2;
  animation: fade 1.2s linear infinite;
}

@keyframes fade {
  0% { opacity: 1; }
  100% { opacity: 0.2; }
}

.loading-text {
  color: white;
  margin-top: 16px;
  font-size: 16px;
  font-weight: bold;
}
</style>
