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
          <img :src="user.avatar" alt="프로필 사진" class="avatar" />
          <div class="nickname">{{ user.nickname }} 님</div>
          <ul>
            <li v-for="item in menuItems" :key="item.label">
              <router-link
                  v-if="item.to"
                  :to="item.to"
                  :class="{ active: $route.path === item.to }"
                  @click="handleMenuClick(item)"
              >
                {{ item.icon }} {{ item.label }}
              </router-link>
              <a
                  v-else
                  href="#"
                  @click.prevent="handleMenuClick(item)"
              >
                {{ item.icon }} {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const showMenu = ref(false)
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const handleMenuClick = (item) => {
  if (item.label === '챗 설정') {
    sessionStorage.removeItem('Aiset')
    showMenu.value = false
    if (window.location.pathname === '/chat') {
      window.location.reload()
    } else {
      window.location.href = '/chat'
    }
  } else {
    showMenu.value = false
  }
}

const menuItems = [
  { to: '/chat', label: '채팅', icon: '💬' },
  { to: '/word_favorites', label: '단어 즐겨찾기', icon: '🌟' },
  { to: '/grammar_favorites', label: '문법 즐겨찾기', icon: '📚' },
  { to: '/sentence_favorites', label: '문장 즐겨찾기', icon: '📝' },
  { to: null, label: '챗 설정', icon: '⚙️' },
  { to: '/ai_clean', label: '챗 초기화', icon: '🧹' }
]

const user = {
  nickname: '손우성',
  avatar: '/악어.png'
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
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}

.menu {
  cursor: pointer;
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
  position: fixed;
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
  cursor: pointer;
}

@media (min-width: 1024px) {
  .side-menu {
    right: calc((100vw - 1020px) / 2);
  }
}

.side-menu-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: white;
  object-fit: cover;
  border: 2px solid #5869ff;
  margin-bottom: 0.5rem;
}

.nickname {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
}

.side-menu-inner ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.side-menu-inner li {
  margin-bottom: 0.8rem;
  width: 100%;
}

.side-menu-inner a {
  display: block;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  color: #333;
  text-decoration: none;
  transition: all 0.2s ease;
}

.side-menu-inner a:hover {
  background-color: #e0e7ff;
  color: #5869ff;
  transform: translateX(4px);
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

.slide-right-enter-active,
.slide-right-leave-active {
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

.side-menu-inner a.active {
  background-color: #e0e7ff;
  color: #5869ff;
  transform: translateX(4px);
}
</style>
