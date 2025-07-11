<template>
  <div class="fav-detail-page">
    <div class="header">
      <h2 class="title">{{ folderName }}</h2>
      <button class="quiz-btn" @click="openDialog">
        <Icon icon="mdi:playlist-plus" width="22" /> 퀴즈 작성
      </button>
    </div>
    <dialog ref="dialogRef" class="quiz-dialog">
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
    <div class="word-list">
      <div
          v-for="(word, i) in wordList"
          :key="i"
          class="word-item"
      >
        <div class="word-header">
          <span class="word-text">{{ word.text }}（{{ word.reading || 'よみ' }}）</span>
          <button class="tts-btn" @click="() => speakText(word.text)">
            <Icon icon="mdi:volume-high" width="20" height="20"  :color="isPlaying ? '#42a5f5' : '#ccc'" />
          </button>
          <button class="fav-btn">
            <Icon
                :icon="isFavorite(word) ? 'mdi:star' : 'mdi:star-outline'"
                :color="isFavorite(word) ? '#FFD700' : '#ccc'"
                width="24"
                height="24"
                @click="handleWordFavoriteClick(word)"
                style="cursor: pointer;"
            />
          </button>
        </div>
        <div class="word-info">
          <div class="word-meaning">뜻: {{ word.meaning }}</div>
          <div class="word-reading">
            음독: {{ word.onyomi || 'なし' }} / 훈독: {{ word.kunyomi || 'なし' }}
          </div>
        </div>
        <button class="detail-btn" @click="toggleDetail(i)">
          {{ word.showDetail ? '[간단히 보기]' : '[자세히 보기]' }}
        </button>
        <div v-if="word.showDetail">
          <div v-if="word.examples?.length" class="word-example">
            <strong>예시:</strong>
            <ul>
              <li v-for="(ex, j) in word.examples" :key="j">{{ ex }}</li>
            </ul>
          </div>
          <div v-if="word.breakdown?.length" class="word-breakdown">
            <strong>한자 구성:</strong>
            <ul>
              <li v-for="(kanji, k) in word.breakdown" :key="k">
                {{ kanji.kanji }} - (음독: {{ kanji.onyomi }} / 훈독: {{ kanji.kunyomi }})
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, toRaw} from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import {
  getFavoriteWords,
  getWordsByList,
  toggleFavorites,
} from "@/api/fav.js";
import router from "@/router/index.js";
import {toast} from "vue3-toastify";
import {fetchTTS} from "@/api/chat.js";

const route = useRoute()
const listId = route.params.id
const folderName = route.params.name || '단어장'
const wordList = ref([])
const favoriteWords = ref([])
const isPlaying = ref(false)
const currentAudio = ref(null)

onMounted(async () => {
  const fetchedWords = await getWordsByList(listId)

  wordList.value = fetchedWords.map(word => ({
    ...word,
    favorite: true,
    showDetail: false
  }))
})

onMounted(() => {
  loadFavoriteWords();
});

async function loadFavoriteWords() {
  try {
    const favorites = await getFavoriteWords();
    favoriteWords.value = favorites;
  } catch (error) {
    console.error('즐겨찾기 단어 불러오기 실패:', error);
  }
}

const handleWordFavoriteClick = async (word) => {
  const raw = toRaw(word);

  try {
    const result = await toggleFavorites({
      list_id: raw.list_id,
      text: raw.text,
      reading: raw.reading,
      meaning: raw.meaning,
      onyomi: raw.onyomi,
      kunyomi: raw.kunyomi,
      examples: JSON.parse(JSON.stringify(raw.examples || [])),
      breakdown: JSON.parse(JSON.stringify(raw.breakdown || []))
    })

    const label = `<span style="color:#5869ff;">${raw.text}</span>`;
    if (result?.message?.includes('추가')) {
      favoriteSet.value.add(raw.text.trim());
      toast.success(`${label}가 즐겨찾기에 추가되었습니다.`, { dangerouslyHTMLString: true });
    } else {
      favoriteSet.value.delete(raw.text.trim());
      toast.error(`${label}가 즐겨찾기에서 삭제되었습니다.`, { dangerouslyHTMLString: true });
    }
    await loadFavoriteWords();
    await getWordsByList(listId);
  } catch (err) {
    toast.error('즐겨찾기 처리 중 오류가 발생했습니다.');
    console.error('❌ 즐겨찾기 토글 오류:', err);
  }
};

const favoriteSet = computed(() => {
  const set = new Set();

  for (const item of favoriteWords.value) {
    set.add(item.text);

    if (item.breakdown) {
      const kanji = item.breakdown.map(b => b.kanji).join('');
      if (kanji.length > 0) set.add(kanji);
    }
  }

  return set;
});


function isFavorite(word) {
  return favoriteSet.value.has(word.text);
}

const dialogRef = ref();
const quizSettings = ref({
  order: 'default',
  direction: 'jp-ko'
})

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
  const { order, direction } = quizSettings.value
  sessionStorage.setItem('lastListId', listId)
  router.push({
    name: 'Quiz_word',
    query: {
      listId,
      order: quizSettings.value.order,
      direction: quizSettings.value.direction,
    }
  })
}

const toggleDetail = (index) => {
  wordList.value[index].showDetail = !wordList.value[index].showDetail
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

const toggleFavorite = (i) => {
  wordList.value[i].favorite = !wordList.value[i].favorite
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

.tts-btn,
.fav-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #3e3e3e;
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

.dialog-actions button:first-child {
  background: #eee;
  color: #3e3e3e;
}

.start-btn {
  background: #5869ff;
  color: white;
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
