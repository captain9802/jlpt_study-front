<template>
  <div class="chat-wrapper">
    <div class="chat-container">
      <div :class="['chat-set', { center: showSetting }]">
        <Aiset v-if="showSetting" @complete="handleSettingComplete" />
        <div v-else class="chat-content">
          <transition-group name="chat" tag="div" class="chat-messages">
            <div
                v-for="(msg, index) in messages"
                :key="index"
                :class="['chat-bubble', msg.from === 'me' ? 'me' : 'ai']"
            >
              <img :src="msg.avatar" class="avatar" />
              <div class="bubble">
                <p>{{ msg.text }}</p>
                <button
                    v-if="msg.from === 'ai'"
                    class="plus-btn"
                    @click="toggleTooltip(index)"
                >+</button>
                <div v-if="msg.showTooltip" class="tooltip">
                  <div class="tooltip-buttons">
                    <button @click="toggleInfo(index)">
                      <i :class="['icon', msg.showInfo ? 'active' : '']">ℹ️</i>
                    </button>
                    <button @click="toggleFavorite(index)">
                      <i :class="['icon', msg.favorite ? 'active' : '']">★</i>
                    </button>
                    <button><i class="icon">🔊</i></button>
                    <button><i class="icon">🌐</i></button>
                    <button @click="closeTooltip(index)">
                      <i class="icon">❌</i>
                    </button>
                  </div>
                  <div v-if="msg.showInfo" class="tooltip-info">
                    <p><strong>단어 정보:</strong></p>
                    <ul>
                      <li v-for="(word, i) in msg.words" :key="i">
                        {{ word }}
                        <button @click="toggleWordFavorite(index, word)">
                          <span :style="{ color: msg.wordFavorites?.[word] ? '#FFD700' : '#ccc' }">★</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
          <div class="chat-input-box">
            <textarea
                v-model="message"
                class="chat-textarea"
                :placeholder="placeholder"
                @keydown.enter.exact.prevent="sendMessage"
            />
            <button class="send-button" @click="sendMessage">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="white"
                  class="arrow-icon"
              >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import Aiset from '@/components/ai/Aiset.vue'

const showSetting = ref(true)
const message = ref('')

const placeholder = '여기에 메세지를 입력해주세요.\n(ここにメッセージを入力してください.)'

const messages = ref([])

function handleSettingComplete() {
  showSetting.value = false

  setTimeout(() => {
    messages.value.push({
      from: 'ai',
      text: '안녕! 나는 🐊이야. 반가워!',
      avatar: '/악어.png',
      showTooltip: false
    })
    scrollToBottom()
  }, 100)

  setTimeout(() => {
    messages.value.push({
      from: 'ai',
      text: '이름은 뭐라고 불러주면 될까?',
      avatar: '/악어.png',
      showTooltip: false
    })
    scrollToBottom()
  }, 600)
}

function sendMessage() {
  if (message.value.trim()) {
    messages.value.push({
      from: 'me',
      text: message.value,
      avatar: '/다람쥐.jpeg'
    })
    message.value = ''
    scrollToBottom()
  }
}

function closeTooltip(index) {
  messages.value[index].showTooltip = false
}

function toggleFavorite(index) {
  messages.value[index].favorite = !messages.value[index].favorite
}

function toggleInfo(index) {
  messages.value[index].showInfo = !messages.value[index].showInfo

  if (!messages.value[index].words) {
    const words = messages.value[index].text.split(' ')
    messages.value[index].words = words
    messages.value[index].wordFavorites = {}
  }
}

function toggleWordFavorite(index, word) {
  const wordFavorites = messages.value[index].wordFavorites
  wordFavorites[word] = !wordFavorites[word]
}

function toggleTooltip(index) {
  messages.value[index].showTooltip = !messages.value[index].showTooltip
}

function scrollToBottom() {
  nextTick(() => {
    const container = document.querySelector('.chat-messages')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}
</script>

<style scoped>
.chat-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  background-color: #5869FF;
  max-width: 500px;
  margin: 0 auto;
  height: calc(100vh - 70px);
  border-left: 10px solid #5869FF;
  border-right: 10px solid #5869FF;
  border-bottom: 10px solid #5869FF;
  position: relative;
  padding-bottom: 16px;
}

.chat-container {
  width: 100%;
  max-width: 500px;
  background-color: white;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.chat-set {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}


.chat-set.center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: unset;
}

.chat-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  height: 100%;
}

.chat-input-box {
  max-width: 460px;
  height: 105px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.10);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  position: relative;
}

.chat-textarea {
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: #000;
  background: transparent;
  font-family: inherit;
  line-height: 1.4;
  white-space: pre-line;
}

.chat-textarea::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.send-button {
  width: 40px;
  height: 40px;
  background-color: #5869FF;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.arrow-icon {
  width: 20px;
  height: 20px;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 8px 4rem 0;
  box-sizing: content-box;
}

.chat-bubble {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.chat-bubble.me {
  flex-direction: row-reverse;
  text-align: right;
}

.bubble {
  background-color: #e0f0ff;
  padding: 0 1rem;
  border-radius: 12px;
  max-width: 80%;
  position: relative;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.plus-btn {
  position: absolute;
  right: -10px;
  bottom: -10px;
  width: 24px;
  height: 24px;
  background-color: #5869FF;
  color: white;
  border-radius: 50%;
  border: none;
  cursor: pointer;
}

.tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  color: #333;
  border: 1px solid #ccc;
  padding: 6px 12px;
  font-size: 0.85rem;
  margin-top: 4px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  z-index: 100;
}

.tooltip-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.tooltip-info {
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 8px;
  font-size: 0.85rem;
  color: #333;
}

.icon {
  font-size: 1.1rem;
  cursor: pointer;
  background: none;
  border: none;
  padding: 4px;
  transition: 0.2s;
}

.icon.active {
  color: #5869FF;
}

.tooltip-info button {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

.chat-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.chat-enter-active {
  transition: all 0.4s ease;
}
.chat-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}
</style>
