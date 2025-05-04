<template>
  <div class="quiz-page" v-if="currentQuestion">
    <div class="quiz-top">
      <div class="quiz-index">{{ currentIndex + 1 }} / {{ totalQuestions }}</div>
    </div>

    <div class="quiz-card-section">
      <div class="quiz-card">
        <p style="margin-bottom: 0">{{ currentQuestion.jp }}</p>
        <p v-if="isAnswered" class="explanation ">
          {{ currentQuestion.question_ko }}
        </p>
        <p v-if="isAnswered" class="explanation">
          {{ currentQuestion.explanation }}
        </p>
        <button class="tts-btn" @click="speak(currentQuestion.jp)">
          <Icon icon="mdi:volume-high" width="20" height="20" />
        </button>
      </div>

      <div class="unknown-section">
        <button class="unknown-btn" @click="markAsUnknown" :disabled="isAnswered">
          잘 모르겠어요.
        </button>
      </div>
    </div>

    <div class="quiz-options">
      <button
          v-for="(option, i) in currentQuestion.options"
          :key="i"
          class="option-btn"
          :class="optionClass(i)"
          @click="selectOption(i)"
          :disabled="isAnswered"
      >
        {{ option.text }}
        <span v-if="isAnswered" class="translation">
          ({{ option.meaning }})
      </span>
      </button>
    </div>

    <div class="quiz-actions">
      <button class="action-btn" @click="goToPrev" :disabled="currentIndex === 0">이전 문제</button>
      <button
          v-if="currentIndex < totalQuestions - 1"
          class="action-btn"
          @click="goToNext"
      >
        다음 문제
      </button>
      <button
          v-else
          class="action-btn"
          @click="submitQuiz"
      >
        문제 제출
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import { getSentenceQuiz } from '@/api/fav.js'
const currentIndex = ref(0)
const answers = ref([])
const quizData = ref([])
const route = useRoute()

const listId = route.query.listId
const order = route.query.order || 'default'

watch(currentIndex, (val) => {
  sessionStorage.setItem('currentIndex', val)
})

watch(answers, (val) => {
  sessionStorage.setItem('answers', JSON.stringify(val))
}, { deep: true })


onMounted(async () => {
  const cached = JSON.parse(sessionStorage.getItem('quizData') || '[]')
  if (cached.length > 0) {
    quizData.value = cached
    answers.value = Array(cached.length).fill(null)
    return
  }

  const data = await getSentenceQuiz({ listId, order })
  quizData.value = data
  answers.value = Array(data.length).fill(null)
})


const currentQuestion = computed(() =>
    quizData.value.length > currentIndex.value ? quizData.value[currentIndex.value] : null
)

const selectedIndex = computed({
  get: () => answers.value[currentIndex.value]?.selectedIndex ?? null,
  set: (val) => {
    answers.value[currentIndex.value] = {
      ...(answers.value[currentIndex.value] || {}),
      selectedIndex: val
    }
  }
})

const markedUnknown = computed({
  get: () => answers.value[currentIndex.value]?.markedUnknown ?? false,
  set: (val) => {
    answers.value[currentIndex.value] = {
      ...(answers.value[currentIndex.value] || {}),
      markedUnknown: val
    }
  }
})

const totalQuestions = computed(() => quizData.value.length)

const isAnswered = computed(() => {
  const ans = answers.value[currentIndex.value]
  return ans && (ans.selectedIndex !== undefined || ans.markedUnknown === true)
})

const selectOption = (index) => {
  if (!isAnswered.value) {
    answers.value[currentIndex.value] = {
      ...(answers.value[currentIndex.value] || {}),
      selectedIndex: index
    }
  }
}

const markAsUnknown = () => {
  if (!isAnswered.value) {
    answers.value[currentIndex.value] = {
      ...(answers.value[currentIndex.value] || {}),
      markedUnknown: true
    }
  }
}

const optionClass = (i) => {
  if (!isAnswered.value) return ''
  if (i === currentQuestion.value.answer) return 'correct'
  if (i === selectedIndex.value || markedUnknown.value) return 'wrong'
  return ''
}

const goToNext = () => {
  if (
      quizData.value.length > 0 &&
      currentIndex.value < quizData.value.length - 1 &&
      isAnswered.value
  ) {
    currentIndex.value++
  }
}

const goToPrev = () => {
  if (quizData.value.length > 0 && currentIndex.value > 0) {
    currentIndex.value--
  }
}

const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  speechSynthesis.speak(utterance)
}

const submitQuiz = () => {
  try {
    sessionStorage.setItem('quizData', JSON.stringify(quizData.value))
    sessionStorage.setItem('answers', JSON.stringify(answers.value))
    router.push('/sentence-quiz_result')
  } catch (e) {
    console.error('❌ 퀴즈 제출 중 오류:', e)
  }
}
</script>

<style scoped>
.quiz-page {
  padding-top: 67px;
  height: 100dvh;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;
}

.quiz-top {
  text-align: center;
  margin-top: 1rem;
}

.quiz-index {
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
}

@media (max-width: 800px) {
  .quiz-top {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
}

.quiz-card-section {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.quiz-card {
  width: clamp(250px, 90vw, 400px);
  height: clamp(200px, 55vw, 355px);
  background-color: rgba(191, 229, 253, 0.5);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 600;
  flex-direction: column;
}

.tts-btn {
  position: absolute;
  bottom: 12px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #3e3e3e;
}

.unknown-section {
  margin-top: 0.5rem;
}

.unknown-btn {
  background-color: #eee;
  border: 1px solid #ccc;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

.quiz-options-section {
  margin-bottom: 1.5rem;
}

.quiz-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  justify-items: center;
}

.option-btn {
  width: clamp(100px, 40vw, 190px);
  height: clamp(60px, 28vw, 120px);
  border-radius: 10px;
  border: 2px solid rgba(130, 143, 255, 0.5);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background-color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
  color: #3e3e3e;
  position: relative;
}

.option-btn.correct {
  background-color: #d2eaff;
  border-color: #4da6ff;
  color: #1d5fd0;
  font-weight: bold;
}

.option-btn.wrong {
  background-color: #ffe0e0;
  border-color: #ff6b6b;
  color: #d12a2a;
}

.translation {
  display: block;
  margin-top: 4px;
  font-size: 0.85rem;
  color: #5869ff;
  font-weight: 500;
}

.quiz-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 1rem;
  margin-bottom: 1rem;
}

.action-btn {
  width: clamp(140px, 40vw, 190px);
  height: clamp(60px, 20vw, 50px);
  background-color: rgba(219, 228, 255, 0.8);
  border: none;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
}

.action-btn:disabled {
  background-color: #eee;
  cursor: not-allowed;
}

.explanation {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: #444;
}
</style>
