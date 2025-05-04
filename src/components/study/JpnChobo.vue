<template>
  <div class="hiragana-page">
    <div class="header">
      <h2 v-if="!quizMode" class="title">{{ titleText }}</h2>
      <div v-else class="quiz-question">
        <div class="quiz-label">다음 글자를 맞혀보세요:</div>
        <div class="quiz-target">{{ currentTarget }}</div>
        <div class="quiz-info">
          <span>정답: {{ correctCount }} / 오답: {{ wrongCount }}</span>
          <span class="timer">
            <Icon icon="mdi:clock-time-four-outline" width="18" height="18" style="vertical-align: middle; margin-right: 4px;" />
          {{ elapsedTime }}초</span>
        </div>
      </div>
      <button
          class="quiz-button"
          v-if="!quizMode"
          @click="startQuiz"
      >
        테스트
      </button>
    </div>
    <div v-if="showResult" class="result-box">
      <h3>테스트 종료!</h3>
      <p>정답: {{ correctCount }}개</p>
      <p>오답: {{ wrongCount }}개</p>
      <p>소요 시간: {{ elapsedTime }}초</p>
      <button class="close-button" @click="closeResult">닫기</button>
    </div>

    <transition-group name="fade" tag="div" class="card-grid">
      <div
          v-for="(kana, index) in displayedList"
          :key="kana.char"
          class="kana-card"
          :class="getCardClass(kana)"
          @click="quizMode && !waiting && handleAnswer(kana)"
      >
        <div class="kana-char">{{ quizMode ? kanaDisplay(kana) : kana.char }}</div>
        <div class="kana-korean" v-if="!quizMode">{{ kana.korean }}</div>
      </div>
    </transition-group>
  </div>
</template>


<script setup>
import {computed, ref, watch} from 'vue'
import {Icon} from "@iconify/vue";
import {useRoute} from "vue-router";

const route = useRoute()

const katakanaList = [
  { char: 'ア', korean: '아' }, { char: 'イ', korean: '이' }, { char: 'ウ', korean: '우' }, { char: 'エ', korean: '에' }, { char: 'オ', korean: '오' },
  { char: 'カ', korean: '카' }, { char: 'キ', korean: '키' }, { char: 'ク', korean: '쿠' }, { char: 'ケ', korean: '케' }, { char: 'コ', korean: '코' },
  { char: 'サ', korean: '사' }, { char: 'シ', korean: '시' }, { char: 'ス', korean: '스' }, { char: 'セ', korean: '세' }, { char: 'ソ', korean: '소' },
  { char: 'タ', korean: '타' }, { char: 'チ', korean: '치' }, { char: 'ツ', korean: '츠' }, { char: 'テ', korean: '테' }, { char: 'ト', korean: '토' },
  { char: 'ナ', korean: '나' }, { char: 'ニ', korean: '니' }, { char: 'ヌ', korean: '누' }, { char: 'ネ', korean: '네' }, { char: 'ノ', korean: '노' },
  { char: 'ハ', korean: '하' }, { char: 'ヒ', korean: '히' }, { char: 'フ', korean: '후' }, { char: 'ヘ', korean: '헤' }, { char: 'ホ', korean: '호' },
  { char: 'マ', korean: '마' }, { char: 'ミ', korean: '미' }, { char: 'ム', korean: '무' }, { char: 'メ', korean: '메' }, { char: 'モ', korean: '모' },
  { char: 'ヤ', korean: '야' }, { char: 'ユ', korean: '유' }, { char: 'ヨ', korean: '요' },
  { char: 'ラ', korean: '라' }, { char: 'リ', korean: '리' }, { char: 'ル', korean: '루' }, { char: 'レ', korean: '레' }, { char: 'ロ', korean: '로' },
  { char: 'ワ', korean: '와' }, { char: 'ヲ', korean: '오' },
  { char: 'ン', korean: '응' }
]

const hiraganaList = [
  { char: 'あ', korean: '아' }, { char: 'い', korean: '이' }, { char: 'う', korean: '우' }, { char: 'え', korean: '에' }, { char: 'お', korean: '오' },
  { char: 'か', korean: '카' }, { char: 'き', korean: '키' }, { char: 'く', korean: '쿠' }, { char: 'け', korean: '케' }, { char: 'こ', korean: '코' },
  { char: 'さ', korean: '사' }, { char: 'し', korean: '시' }, { char: 'す', korean: '스' }, { char: 'せ', korean: '세' }, { char: 'そ', korean: '소' },
  { char: 'た', korean: '타' }, { char: 'ち', korean: '치' }, { char: 'つ', korean: '츠' }, { char: 'て', korean: '테' }, { char: 'と', korean: '토' },
  { char: 'な', korean: '나' }, { char: 'に', korean: '니' }, { char: 'ぬ', korean: '누' }, { char: 'ね', korean: '네' }, { char: 'の', korean: '노' },
  { char: 'は', korean: '하' }, { char: 'ひ', korean: '히' }, { char: 'ふ', korean: '후' }, { char: 'へ', korean: '헤' }, { char: 'ほ', korean: '호' },
  { char: 'ま', korean: '마' }, { char: 'み', korean: '미' }, { char: 'む', korean: '무' }, { char: 'め', korean: '메' }, { char: 'も', korean: '모' },
  { char: 'や', korean: '야' }, { char: 'ゆ', korean: '유' }, { char: 'よ', korean: '요' },
  { char: 'ら', korean: '라' }, { char: 'り', korean: '리' }, { char: 'る', korean: '루' }, { char: 'れ', korean: '레' }, { char: 'ろ', korean: '로' },
  { char: 'わ', korean: '와' }, { char: 'を', korean: '오' },
  { char: 'ん', korean: '응' }
]

const listType = computed(() =>
    route.path.includes('katakana') ? 'katakana' : 'hiragana'
)

const baseList = computed(() =>
    listType.value === 'katakana' ? katakanaList : hiraganaList
)

const displayedList = ref([])

watch(baseList, (newList) => {
  displayedList.value = [...newList]
}, { immediate: true })

watch(() => route.path, () => {
  resetToInitial()
})

const quizMode = ref(false)
const currentTarget = ref('')
const quizType = ref('jp-to-ko')
const selectedKana = ref(null)
const lastAnswerCorrect = ref(null)
const correctAnswerChar = ref('')
const correctCount = ref(0)
const wrongCount = ref(0)
const waiting = ref(false)
const showResult = ref(false)
const startTime = ref(null)
const elapsedTime = ref(0)
let timerInterval = null

const titleText = computed(() =>
    listType.value === 'katakana' ? '가타카나 연습' : '히라가나 연습'
)

function shuffle(array) {
  return array.map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
}

function startQuiz() {
  quizMode.value = true
  correctCount.value = 0
  wrongCount.value = 0
  selectedKana.value = null
  showResult.value = false
  elapsedTime.value = 0
  displayedList.value = shuffle([...baseList.value])
  quizType.value = Math.random() > 0.5 ? 'jp-to-ko' : 'ko-to-jp'
  pickNext()
  startTimer()
}

function closeResult() {
  showResult.value = false
  displayedList.value = [...baseList.value]
  selectedKana.value = null
  lastAnswerCorrect.value = null
  correctAnswerChar.value = ''
  correctCount.value = 0
  wrongCount.value = 0
  elapsedTime.value = 0
  quizMode.value = false
}

function pickNext() {
  const random = displayedList.value[Math.floor(Math.random() * displayedList.value.length)]
  currentTarget.value = quizType.value === 'jp-to-ko' ? random.char : random.korean
  correctAnswerChar.value = random.char
  selectedKana.value = null
  lastAnswerCorrect.value = null
}

function handleAnswer(kana) {
  selectedKana.value = kana

  const isCorrect =
      (quizType.value === 'jp-to-ko' && kana.char === currentTarget.value) ||
      (quizType.value === 'ko-to-jp' && kana.korean === currentTarget.value)

  lastAnswerCorrect.value = isCorrect

  if (isCorrect) {
    correctCount.value++
  } else {
    wrongCount.value++
  }

  waiting.value = true

  setTimeout(() => {
    if (isCorrect) {
      displayedList.value = displayedList.value.filter(k => k.char !== kana.char)
    } else {
      displayedList.value = displayedList.value.filter(k => k.char !== correctAnswerChar.value)
    }

    selectedKana.value = null
    lastAnswerCorrect.value = null
    correctAnswerChar.value = ''
    waiting.value = false

    if (displayedList.value.length > 0) {
      pickNext()
    } else {
      finishQuiz()
    }
  }, 2000)
}


function kanaDisplay(kana) {
  return quizType.value === 'jp-to-ko' ? kana.korean : kana.char
}

function finishQuiz() {
  clearInterval(timerInterval)
  quizMode.value = false
  showResult.value = true
}

function startTimer() {
  startTime.value = Date.now()
  elapsedTime.value = 0
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000)
  }, 1000)
}

function getCardClass(kana) {
  if (!selectedKana.value) return ''
  if (kana.char === selectedKana.value.char) {
    return lastAnswerCorrect.value ? 'card-correct' : 'card-wrong'
  }
  if (!lastAnswerCorrect.value && kana.char === correctAnswerChar.value) {
    return 'card-correct'
  }
  return ''
}

function resetToInitial() {
  quizMode.value = false
  showResult.value = false
  selectedKana.value = null
  lastAnswerCorrect.value = null
  correctAnswerChar.value = ''
  correctCount.value = 0
  wrongCount.value = 0
  elapsedTime.value = 0
  clearInterval(timerInterval)
  displayedList.value = [...baseList.value]
}

</script>

<style scoped>
.hiragana-page {
  max-width: 1024px;
  margin: 66px auto 0;
  padding: 0 1rem;
  text-align: center;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
  justify-items: center;
  box-sizing: border-box;
}

.kana-card {
  width: 100%;
  max-width: 140px;
  aspect-ratio: 1 / 1.1;
  background-color: #f2f4ff;
  border-radius: 12px;
  padding: 1rem;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  box-sizing: border-box;
}

.kana-card:hover {
  transform: scale(1.05);
}

.kana-korean {
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.25rem;
}


.kana-char {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quiz-button {
  background-color: #4a74f5;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.quiz-button:hover {
  background-color: #385cd0;
}

.quiz-question {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.quiz-label {
  color: #555;
  padding-top: 1rem;
}

.quiz-target {
  color: #4a74f5;
  font-size: 1.5rem;
}

.quiz-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #888;
  margin-top: 0.2rem;
  margin-bottom: 1rem;
}

.timer {
  font-weight: normal;
}
.card-correct {
  background-color: #d2eaff !important;
  border: 2px solid #4da6ff;
  color: #1d5fd0;
  font-weight: bold;
}

.card-wrong {
  background-color: #ffe0e0 !important;
  border: 2px solid #ff6b6b;
  color: #d12a2a;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.result-box {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 700;
  background-color: #f4faff;
  border: 2px solid #4da6ff;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 320px;
  width: calc(100% - 2rem);
  text-align: center;
  animation: fadeIn 0.4s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.result-box h3 {
  margin-bottom: 0.5rem;
  color: #1d5fd0;
  font-size: 1.3rem;
}

.result-box p {
  margin: 0.2rem 0;
  font-size: 1rem;
  color: #333;
}

.close-button {
  margin-top: 1rem;
  background-color: #4a74f5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background-color: #385cd0;
}
</style>
