<template>
  <div class="quiz-result">
    <div class="summary">
      <div class="summary-left">
        <div class="cross">오답<Icon icon="mdi:close-circle" color="#f44336" width="24" /></div>
        <div class="number">{{ wrongAnswers.length }}개</div>
      </div>
      <div class="divider"></div>
      <div class="summary-right">
        <div class="correct">정답<Icon icon="mdi:check-circle" color="#4caf50" width="24" /></div>
        <div class="number">{{ correctAnswers.length }}개</div>
      </div>
    </div>
    <div class="expand-section">
      <div class="expand-container">
        <div :class="['expand-wrong', { open: wrongExpanded }]">
          <div class="expand-header" @click="toggleWrong">
            <Icon
                :icon="wrongExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                class="arrow-icon"
            />
            {{ wrongExpanded ? '오답 문제 접기' : '오답 문제 펼쳐보기' }}
          </div>
          <div v-show="wrongExpanded" class="word-list">
            <div v-for="(word, i) in wrongAnswers" :key="i" class="word-item">
              <div class="word-header">
                <span class="word-text">{{ word.ja }}</span>
                <button class="tts-btn" @click="speak(word.ja)">
                  <Icon icon="mdi:volume-high" width="20" />
                </button>
              </div>
              <div class="word-info">뜻: {{ word.ko }}</div>
            </div>
          </div>
        </div>
        <div :class="['expand-correct', { open: correctExpanded }]">
          <div class="expand-header" @click="toggleCorrect">
            <Icon
                :icon="correctExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                class="arrow-icon"
            />
            {{ correctExpanded ? '정답 문제 접기' : '정답 문제 펼쳐보기' }}
          </div>
          <div v-show="correctExpanded" class="word-list">
            <div v-for="(word, i) in correctAnswers" :key="i" class="word-item">
              <div class="word-header">
                <span class="word-text">{{ word.ja }}</span>
                <button class="tts-btn" @click="speak(word.ja)">
                  <Icon icon="mdi:volume-high" width="20" />
                </button>
              </div>
              <div class="word-info">뜻: {{ word.ko }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="action-buttons">
      <button class="retry-btn" @click="retryWrong">오답문제 풀기</button>
      <button class="back-btn" @click="goBack">즐겨찾기 목록</button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import router from '@/router'

const correctAnswers = ref([])
const wrongAnswers = ref([])

onMounted(() => {
  const quizData = JSON.parse(sessionStorage.getItem('quizData') || '[]')
  const answers = JSON.parse(sessionStorage.getItem('answers') || '[]')

  quizData.forEach((question, index) => {
    const user = answers[index] || {}
    const selected = user.selectedIndex

    const isCorrect = selected === question.answer
    const target = isCorrect ? correctAnswers.value : wrongAnswers.value

    const answerOption = question.options[question.answer]

    const isKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(question.jp)

    const jpText = isKorean ? answerOption.text : question.jp
    const koText = isKorean ? question.jp : answerOption.text

    target.push({
      ja: jpText,
      ko: koText
    })
  })
  console.log(quizData);
})

const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  speechSynthesis.speak(utterance)
}

const retryWrong = () => {
  const listId = parseInt(sessionStorage.getItem('lastListId'))
  if (!listId || isNaN(listId)) {
    alert('리스트 정보가 없습니다.')
    return
  }
  const quizData = wrongAnswers.value.map((item) => {
    const direction = Math.random() < 0.5 ? 'jp-ko' : 'ko-jp'

    const questionText = item.ja
    const correctText = direction === 'jp-ko' ? item.ko : item.ja
    const correct = {
      text: correctText,
      translation: direction === 'jp-ko' ? item.ja : item.ko,
      explanation: item.explanation ?? ''
    }

    const wrongOptions = wrongAnswers.value
        .filter(w => w.ja !== item.ja)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(opt => ({
          text: direction === 'jp-ko' ? opt.ko : opt.ja,
          translation: direction === 'jp-ko' ? opt.ja : opt.ko,
          explanation: opt.explanation ?? '틀린 문법입니다'
        }))

    const options = [...wrongOptions, correct].sort(() => Math.random() - 0.5)
    const answerIndex = options.findIndex(
        opt => opt.text === correct.text && opt.translation === correct.translation
    )

    return {
      jp: questionText,
      options,
      answer: answerIndex
    }
  })

  const shuffled = quizData.sort(() => Math.random() - 0.5)
  sessionStorage.setItem('quizData', JSON.stringify(shuffled))
  sessionStorage.setItem('answers', JSON.stringify([]))
  router.push({
    path: '/grammar_quiz',
    query: {
      listId: listId,
      order: 'shuffle'
    }
  })
}

const goBack = () => {
  sessionStorage.removeItem('quizData')
  sessionStorage.removeItem('answers')
  sessionStorage.removeItem('currentIndex')
  router.push('/grammar_favorites')
}


const correctExpanded = ref(true)
const wrongExpanded = ref(true)

const toggleCorrect = () => {
  correctExpanded.value = !correctExpanded.value
}
const toggleWrong = () => {
  wrongExpanded.value = !wrongExpanded.value
}
</script>

<style scoped>
.expand-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.quiz-result {
  max-width: 1024px;
  margin: 67px auto;
  padding: 1rem;
}

.summary {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 2rem;
  margin-bottom: 2rem;
}

.cross,
.correct {
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.number {
  font-weight: 600;
  font-size: 1.5rem;
  padding-top: 1rem;
}

.summary-left,
.summary-right {
  flex: 1 1 450px;
  max-width: 350px;
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.summary-left {
  background-color: #ffe0e0;
  border: 1px solid #ff6b6b;
  color: #d12a2a;
}

.summary-right {
  background-color: #d2eaff;
  border: 1px solid #1d5fd0;
  color: #1d5fd0;
}

.divider {
  width: 3px;
  background-color: #ccc;
  height: auto;
  align-self: center;
  min-height: 150px;
  border-radius: 10px;
}

.expand-section details {
  margin-bottom: 1rem;
  background: #f4f4f4;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.expand-section ul {
  padding-left: 1rem;
}

.expand-container details {
  flex: 1;
  min-width: 300px;
  padding: 1rem;
  background: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .expand-container {
    flex-direction: column;
  }
  .expand-container details {
    width: 100%;
  }
}

.word-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.word-item {
  background: white;
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

.tts-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #3e3e3e;
  display: flex;
  align-items: center;
}

.word-info {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #3e3e3e;
}

.word-reading {
  font-size: 0.85rem;
  color: #3e3e3e;
}

.detail-btn {
  background: none;
  border: none;
  color: #5869ff;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  cursor: pointer;
}

.word-example,
.word-breakdown {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: #444;
}

.word-example ul,
.word-breakdown ul {
  margin: 0.25rem 0 0 1rem;
  padding: 0;
}

.expand-wrong,
.expand-correct {
  flex: 1 1 100%;
  background: #f4f4f4;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  min-width: 300px;
  box-sizing: border-box;

}

.expand-wrong {
  background-color: #ffe0e0;
}

.expand-correct {
  background-color: #d2eaff;
}

.expand-header {
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  position: relative;
  display: flex;
  align-items: center;
}

.arrow-icon {
  vertical-align: middle;
  font-size: 1.5rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.retry-btn,
.back-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-btn,
.retry-btn{
  background-color: rgba(219, 228, 255, 0.8);
  color: #3e3e3e;
}
</style>
