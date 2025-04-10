<template>
  <header class="header-wrapper">
    <div class="header">
      <router-link to="/chat" class="logo">JLPT Mate</router-link>
      <div class="menu" @click="toggleMenu">
        <Icon :icon="showMenu ? 'mdi:close' : 'mdi:menu'" class="icon" color="white" width="24" height="24" />
      </div>
    </div>
    <transition name="slide-right">
      <div class="side-menu" v-if="showMenu">
        <div class="side-menu-inner">
          <ul>
            <li><router-link to="/chat">채팅</router-link></li>
            <li><router-link to="/favorites">즐겨찾기</router-link></li>
            <li><router-link to="/settings">설정</router-link></li>
          </ul>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const showMenu = ref(false)
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}
</script>

<style scoped>
.header-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: auto;
  position: relative;
}

.header {
  width: 100%;
  max-width: 1024px;
  background-color: #5869ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
  position: relative;
}

.logo {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.icon {
  width: 30px;
  height: 30px;
}

.side-menu {
  position: absolute;
  top: 67px;
  right: 0;
  width: 250px;
  background-color: #f5f5f5;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  box-sizing: border-box;
  z-index: 1000;
  max-width: 100%;
  border-radius: 10px;
}

@media (min-width: 1024px) {
  .side-menu {
    right: calc((100vw - 1020px) / 2);
  }
}

.side-menu-inner ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.side-menu-inner li {
  margin-bottom: 1rem;
}

.side-menu-inner a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 1024px) {
  .side-menu {
    margin-right: 10px;
  }
}

@media (max-width: 600px) {
  .side-menu {
    width: 200px;
    padding: 0.75rem;
  }
  .side-menu-inner a {
    font-size: 0.875rem;
  }
  .side-menu-inner li {
    margin-bottom: 0.75rem;
  }
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>