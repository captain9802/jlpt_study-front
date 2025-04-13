<template>
  <div class="quiz-page">
    <div class="quiz-top">
      <div class="quiz-index">{{ currentIndex + 1 }} / {{ totalQuestions }}</div>
    </div>
    <div class="quiz-card-section">
      <div class="quiz-card">
        <p>{{ currentQuestion.jp }}</p>
        <button class="tts-btn" @click="speak(currentQuestion.jp)"><Icon icon="mdi:volume-high" width="20" height="20" />
        </button>
      </div>
    </div>
    <div class="quiz-options-section">
      <div class="quiz-options">
        <button
            v-for="(option, i) in currentQuestion.options"
            :key="i"
            class="option-btn"
            :class="optionClass(i)"
            @click="selectOption(i)"
            :disabled="isAnswered"
        >
          {{ option }}
        </button>
      </div>
    </div>
    <div class="quiz-actions">
      <button class="action-btn" @click="goToPrev" :disabled="currentIndex === 0">이전 문제</button>
      <button class="action-btn" @click="goToNext">다음 문제</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {Icon} from "@iconify/vue";

const currentIndex = ref(0)
const selectedIndex = ref(null)

const quizData = [
  {
    jp: 'こんにちは',
    options: ['안녕하세요', '감사합니다', '잘 자요', '죄송합니다'],
    answer: 0
  },
  {
    jp: 'ありがとう',
    options: ['잘 가요', '감사합니다', '오랜만이에요', '괜찮아요'],
    answer: 1
  },
]

const totalQuestions = quizData.length
const currentQuestion = computed(() => quizData[currentIndex.value])
const isAnswered = computed(() => selectedIndex.value !== null)

const selectOption = (index) => {
  if (!isAnswered.value) {
    selectedIndex.value = index
  }
}

const optionClass = (i) => {
  if (!isAnswered.value) return ''
  if (i === currentQuestion.value.answer) return 'correct'
  if (i === selectedIndex.value) return 'wrong'
  return ''
}

const goToNext = () => {
  if (currentIndex.value < quizData.length - 1) {
    currentIndex.value++
    selectedIndex.value = null
  }
}

const goToPrev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedIndex.value = null
  }
}

const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  speechSynthesis.speak(utterance)
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
  font-size: 1.5rem;
  font-weight: 600;
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

.tts-btn {
  position: absolute;
  bottom: 12px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #3e3e3e;
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

</style>
