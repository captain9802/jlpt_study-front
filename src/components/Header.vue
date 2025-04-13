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
            <li><router-link to="/chat">💬 채팅</router-link></li>
            <li><router-link to="/word_favorites">🌟 단어 즐겨찾기</router-link></li>
            <li><router-link to="/grammar_favorites">📚 문법 즐겨찾기</router-link></li>
            <li><router-link to="/sentence_favorites">📝 문장 즐겨찾기</router-link></li>
            <li><router-link to="/ai-set">⚙️ 챗 설정</router-link></li>
            <li><router-link to="/ai_clean">🧹 챗 초기화</router-link></li>
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

// ✅ 사용자 정보 객체
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
</style>
