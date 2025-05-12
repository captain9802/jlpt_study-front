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
      <div class="dialog-actions">
        <button @click="closeDialog">취소하기</button>
        <button class="start-btn" @click="startQuiz">시작하기</button>
      </div>
    </dialog>

    <div class="word-list">
      <div
          v-for="(item, i) in grammarList"
          :key="i"
          class="word-item"
      >
        <div class="word-header">
          <span class="word-text">{{ item.grammar }}</span>
          <button class="tts-btn" @click="speak(item.grammar)">
            <Icon icon="mdi:volume-high" width="20" />
          </button>
          <button class="fav-btn">
            <Icon
                :icon="isGrammarFavorite(item) ? 'mdi:star' : 'mdi:star-outline'"
                :color="isGrammarFavorite(item) ? '#FFD700' : '#ccc'"
                width="24"
                height="24"
                @click="handleGrammarFavoriteClick(item)"
                style="cursor: pointer;"
            />
          </button>
        </div>
        <div class="word-info">
          <div class="word-meaning">뜻: {{ item.meaning }}</div>
        </div>
        <button class="detail-btn" @click="item.showDetail = !item.showDetail">
          {{ item.showDetail ? '[간단히 보기]' : '[자세히 보기]' }}
        </button>

        <div v-if="item.showDetail && item.examples?.length" class="word-example">
          <strong>예시 문장:</strong>
          <ul>
            <li v-for="(ex, j) in item.examples" :key="j">
              {{ ex.ja }} — {{ ex.ko }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, toRaw} from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import {
  getGrammarsByList, getGrammarTexts,
  toggleGrammarFavorites
} from '@/api/fav.js'
import router from "@/router/index.js";
import {toast} from "vue3-toastify";

const route = useRoute()
const listId = route.params.id
const folderName = route.params.name || '문법장'
const grammarTexts = ref([])
const grammarList = ref([])

onMounted(async () => {
  const fetched = await getGrammarsByList(listId)
  grammarList.value = fetched.map(grammar => ({
    ...grammar,
    showDetail: false
  }))
})

onMounted(() => {
  loadFavoriteGrammar();
});

async function loadFavoriteGrammar() {
  const favorites = await getGrammarTexts();
  grammarTexts.value = favorites
}

const handleGrammarFavoriteClick = async (grammar) => {
  const raw = toRaw(grammar);

  const grammarText = raw.grammar || raw.text || '';
  const normalizedText = typeof grammarText === 'string' ? grammarText.trim() : '';

  try {
    const result = await toggleGrammarFavorites({
      list_id: raw.list_id,
      grammar: grammarText,
      meaning: raw.meaning
    });

    const label = `<span style="color:#5869ff;">${normalizedText}</span>`;
    if (result?.message?.includes('추가')) {
      favoriteGrammarSet.value.add(normalizedText);
      toast.success(`${label}가 즐겨찾기에 추가되었습니다.`, { dangerouslyHTMLString: true });
    } else {
      favoriteGrammarSet.value.delete(normalizedText);
      toast.error(`${label}가 즐겨찾기에서 삭제되었습니다.`, { dangerouslyHTMLString: true });
    }

    await loadFavoriteGrammar();
    await getGrammarsByList(listId);
  } catch (err) {
    toast.error('즐겨찾기 처리 중 오류가 발생했습니다.');
    console.error('❌ 즐겨찾기 토글 오류:', err);
  }
};


const favoriteGrammarSet = computed(() => {
  const set = new Set();

  for (const grammar of grammarTexts.value) {
    set.add(grammar);
  }

  return set;
});

function isGrammarFavorite(grammar) {
  const normalize = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/^〜/, '').trim();
  };

  const text = toRaw(grammar)?.grammar;
  const normalizedText = normalize(text);

  return [...favoriteGrammarSet.value].some(item => normalize(item) === normalizedText);
}



const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  speechSynthesis.speak(utterance)
}

const dialogRef = ref()
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
  sessionStorage.setItem('lastListId', listId)
  sessionStorage.removeItem('quizData')
  sessionStorage.removeItem('answers')
  sessionStorage.removeItem('currentIndex')

  router.push({
    name: 'Quiz_grammar',
    query: {
      listId,
      order: quizSettings.value.order
    }
  })
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

.radio-group {
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
  .radio-group {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }

  .radio-group label span {
    font-size: 0.85rem;
    padding: 0.4rem;
  }
}


.detail-btn {
  background: none;
  border: none;
  color: #5869ff;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  cursor: pointer;
}

.word-example {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: #444;
}

.word-example ul {
  margin: 0.25rem 0 0 1rem;
  padding: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
