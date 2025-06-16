<template>
  <div class="fav-detail-page">
    <div class="header">
      <h2 class="title">{{ folderName }}</h2>
      <button class="quiz-btn" @click="openDialog">
        <Icon icon="mdi:playlist-plus" width="22" /> 퀴즈 작성
      </button>
    </div>

    <div class="word-list" ref="scrollContainer" @scroll="onScroll">
      <div v-for="(word, i) in wordList" :key="i" class="word-item">
        <div class="word-header">
          <span class="word-text">{{ word.word }}({{ word.kana }})</span>
          <button class="tts-btn" @click="() => speakText(word.word)">
            <Icon icon="mdi:volume-high" width="20" height="20"  :color="isPlaying ? '#42a5f5' : '#ccc'" />
          </button>
        </div>
        <div class="word-info">뜻: {{ word.meaning_ko }}</div>
      </div>
      <Loading :visible="isLoading" />
    </div>

    <dialog ref="dialogRef" class="quiz-dialog">
      <div class="dialog-section">
        <p>문제 수</p>
        <input
            type="number"
            min="1"
            :max="maxQuestionCount"
            v-model.number="quizSettings.count"
            class="question-input"
            placeholder="예: 10"
        />
        <span> / (최대 {{ maxQuestionCount }}문제)</span>
      </div>

      <div class="dialog-section">
        <p>문제 순서</p>
        <div class="radio-group two-columns">
          <label>
            <input type="radio" value="default" v-model="quizSettings.order" />
            <span>순서대로</span>
          </label>
          <label>
            <input type="radio" value="shuffle" v-model="quizSettings.order" />
            <span>무작위</span>
          </label>
        </div>
      </div>

      <div class="dialog-section">
        <p>문제 언어</p>
        <div class="radio-group three-columns">
          <label>
            <input type="radio" value="jp-ko" v-model="quizSettings.direction" />
            <span>일 → 한</span>
          </label>
          <label>
            <input type="radio" value="ko-jp" v-model="quizSettings.direction" />
            <span>한 → 일</span>
          </label>
          <label>
            <input type="radio" value="random" v-model="quizSettings.direction" />
            <span>무작위</span>
          </label>
        </div>
      </div>

      <div class="dialog-actions">
        <button @click="closeDialog">취소하기</button>
        <button class="start-btn" @click="startQuiz">시작하기</button>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { debounce } from 'lodash'
import {getWordsByLevel} from "@/api/jlpt.js";
import Loading from "@/components/Loading.vue";
import {fetchTTS} from "@/api/chat.js";

const route = useRoute()
const router = useRouter()
const level = route.params.level.toUpperCase()
const folderName = `JLPT ${level} 단어`
const isLoading = ref(true);

const wordList = ref([])
const page = ref(1)
const isLoadingMore = ref(false)
const hasMore = ref(true)
const scrollContainer = ref(null)

const isPlaying = ref(false)
const currentAudio = ref(null)

const maxQuestionCount = computed(() => {
  return maxQuestionMap[level] || 100
})

const fetchWords = async () => {
  if (isLoadingMore.value || !hasMore.value) return
  isLoadingMore.value = true
  try {
    const res = await getWordsByLevel(level, page.value)
    isLoading.value = false
    if (res.length === 0) {
      hasMore.value = false
    } else {
      wordList.value.push(...res)
      page.value++
    }
  } catch (err) {
    console.error('단어 불러오기 실패:', err)
  } finally {
    isLoadingMore.value = false
  }
}

const onScroll = debounce(() => {
  const el = scrollContainer.value
  if (!el) return
  const bottomReached = el.scrollTop + el.clientHeight >= el.scrollHeight - 50
  if (bottomReached) {
    fetchWords()
  }
}, 200)

onMounted(() => {
  fetchWords()
})

const dialogRef = ref()

const openDialog = () => {
  dialogRef.value?.showModal()
}

const closeDialog = () => {
  dialogRef.value?.close()
}

const startQuiz = () => {
  sessionStorage.removeItem('quizData')
  sessionStorage.removeItem('answers')
  sessionStorage.removeItem('currentIndex')
  sessionStorage.removeItem('quizCount')
  dialogRef.value?.close()
  const listId = level
  const { order, direction, count } = quizSettings.value
  sessionStorage.setItem('lastListId', listId)
  router.push({
    name: 'Quiz_word',
    query: {
      listId,
      order: quizSettings.value.order,
      direction: quizSettings.value.direction,
      count: quizSettings.value.count
    }
  })
}

const speakText = async (text) => {
  if (isPlaying.value) return

  try {
    isPlaying.value = true
    const blob = await fetchTTS(text)
    const audio = new Audio(URL.createObjectURL(blob))
    currentAudio.value = audio

    audio.onended = () => {
      isPlaying.value = false
      currentAudio.value = null
    }

    audio.onerror = () => {
      isPlaying.value = false
      currentAudio.value = null
      console.error('TTS 재생 실패')
    }

    audio.play()
  } catch (e) {
    isPlaying.value = false
    currentAudio.value = null
    console.error('TTS 재생 실패:', e)
  }
}

const quizSettings = ref({
  order: 'default',
  direction: 'jp-ko',
  count: 10,
})

const maxQuestionMap = {
  N1: 2929,
  N2: 3624,
  N3: 2232,
  N4: 659,
  N5: 701
}
</script>

<style scoped>

.fav-detail-page {
  max-width: 1024px;
  margin: 0 auto;
  padding: 67px 1rem 1rem 1rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: space-between;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
  text-align: left;
}

.word-list {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.word-item {
  background: #f5f7ff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.word-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.word-info {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #3e3e3e;
}

.loading-more {
  text-align: center;
  color: #999;
  margin-top: 1rem;
}
.quiz-btn {
  background-color: #5869ff;
  color: white;
  padding: 0.5rem 0.8rem;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 10px;
}

.quiz-dialog {
  padding: 2rem;
  border-radius: 14px;
  background: white;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: none;
  animation: fadeIn 0.25s ease;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
}

.dialog-section {
  margin-bottom: 1.75rem;
  text-align: center;
}

.dialog-section p {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

.radio-group {
  display: grid;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
}

.radio-group.two-columns {
  grid-template-columns: repeat(2, 1fr);
}

.radio-group.three-columns {
  grid-template-columns: repeat(3, 1fr);
}

.radio-group label {
  border-radius: 10px;
  padding: 0.6rem 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  color: #3e3e3e;
}

.radio-group input[type="radio"] {
  display: none;
}

.radio-group input[type="radio"]:checked + span {
  border: 1px solid #5869ff;
  background-color: white;
  color: #5869ff;
  font-weight: 600;
}

.radio-group label span {
  width: 100%;
  text-align: center;
  border-radius: 10px;
  padding: 0.4rem 0.3rem;
  display: inline-block;
  border: 1px solid #3e3e3e;
  font-weight: 500;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.dialog-actions button {
  padding: 0.5rem 1.2rem;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.tts-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #3e3e3e;
}

.dialog-actions button:first-child {
  background: #eee;
  color: #3e3e3e;
}

.start-btn {
  background: #5869ff;
  color: white;
}

.question-label {
  font-weight: bold;
  margin-bottom: 0.3rem;
  display: inline-block;
}

.question-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.question-input {
  width: 70px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  text-align: center;
  transition: border-color 0.2s;
}

.question-input:focus {
  border-color: #3b82f6;
}

.max-info {
  font-size: 0.95rem;
  color: #555;
}


@media (max-width: 480px) {
  .quiz-dialog {
    padding: 1.25rem;
  }

  .radio-group.two-columns,
  .radio-group.three-columns {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }

  .radio-group label span {
    font-size: 0.85rem;
    padding: 0.4rem;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
