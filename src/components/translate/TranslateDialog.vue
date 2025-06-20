<template>
  <div class="translate-dialog-overlay">
    <div class="translate-dialog">
      <div class="translate-header">
        <div class="translate-text">번역</div>
        <button class="close-button" @click="close">
          <Icon icon="mdi:close" width="24" height="24" />
        </button>
      </div>

      <div class="lang-toggle">
        <button :class="{ active: direction === 'ko-ja' }" @click="direction = 'ko-ja'" style="font-weight: bold">한국어 → 일본어</button>
        <button :class="{ active: direction === 'ja-ko' }" @click="direction = 'ja-ko'" style="font-weight: bold">일본어 → 한국어</button>
      </div>

      <textarea class="output-textarea" v-model="inputText" placeholder="번역할 내용을 입력하세요..." />

      <textarea class="output-textarea" :value="loadingText || translatedText" readonly placeholder="번역 결과가 여기에 표시됩니다." />

      <button class="translate-run-button" @click="runTranslation">
        번역하기
      </button>

      <div class="translate-section" v-if="words.length">
        <div class="translate-title">단어</div>
        <ul>
          <li v-for="(word, i) in words" :key="i">
            {{ word.text }} ({{ word.reading }}) - {{ word.meaning }}
          </li>
        </ul>
      </div>

      <div class="translate-section" v-if="grammar.length">
        <div class="translate-title">문법</div>
        <ul>
          <li v-for="(g, i) in grammar" :key="i">
            {{ g.text }} - {{ g.meaning }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {fetchTranslation} from "@/api/chat.js";
import {Icon} from "@iconify/vue";

const props = defineProps({
  onClose: Function
})

const inputText = ref('')
const translatedText = ref('')
const words = ref([])
const grammar = ref([])
const direction = ref('ko-ja')
const loadingText = ref('')
let loadingInterval = null

function close() {
  props.onClose()
}

async function runTranslation() {
  translatedText.value = ''
  words.value = []
  grammar.value = []
  loadingText.value = '번역중 .'
  let dotCount = 1

  loadingInterval = setInterval(() => {
    dotCount = (dotCount % 3) + 1
    loadingText.value = '번역중 ' + '. '.repeat(dotCount).trim()
  }, 400)

  try {
    const result = await fetchTranslation({
      text: inputText.value,
      direction: direction.value
    })

    translatedText.value = result.translation
    words.value = result.words || []
    grammar.value = result.explanation?.grammar || []
  } catch (error) {
    translatedText.value = '번역 실패'
  } finally {
    clearInterval(loadingInterval)
    loadingInterval = null
    loadingText.value = ''
  }
}

</script>

<style scoped>
.translate-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.translate-dialog {
  width: 90%;
  max-width: 500px;
  overflow-y: auto;
  max-height: 90dvh;
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem;
}

.translate-dialog::-webkit-scrollbar {
  width: 6px;
}

.translate-dialog::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.translate-dialog::-webkit-scrollbar-track {
  background: transparent;
}


.translate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.translate-text {
  font-size: 1.25rem;
  font-weight: bold;
}

.lang-toggle {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.lang-toggle button {
  padding: 0.4rem 1rem;
  border: 1px solid #ccc;
  background: #f0f0f0;
  border-radius: 0.5rem;
  cursor: pointer;
}

.lang-toggle .active {
  background: #5869ff;
  color: white;
  border-color: #5869ff;
}

textarea {
  resize: none;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-family: inherit;
  min-height: 100px;
  flex-shrink: 0;
}

.output-textarea {
  height: 100px;
  background-color: #f9f9f9;
  color: #333;
}

.translate-run-button {
  width: 100%;
  background-color: #5869ff;
  color: white;
  padding: 0.6rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}

.translate-section h4 {
  margin: 0.5rem 0 0.2rem;
  font-size: 0.95rem;
}

.translate-section ul {
  list-style: none;
  padding-left: 1rem;
}

.translate-section li {
  margin-bottom: 0.3rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  color: #3e3e3e;
}

.translate-title {
  font-size: 1.125rem;
  font-weight: bold;
}
</style>
