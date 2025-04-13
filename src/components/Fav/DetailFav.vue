<template>
  <div class="fav-detail-page">
    <div class="header">
      <h2 class="title">{{ folderName }}</h2>
    </div>
    <div class="word-list">
      <div
          v-for="(word, i) in wordList"
          :key="i"
          class="word-item"
      >
        <div class="word-header">
          <span class="word-text">{{ word.text }}（{{ word.reading || 'よみ' }}）</span>
          <button class="tts-btn" @click="speak(word.text)">
            <Icon icon="mdi:volume-high" width="20" />
          </button>
          <button class="fav-btn" @click="toggleFavorite(i)">
            <Icon :icon="word.favorite ? 'mdi:star' : 'mdi:star-outline'" width="20" />
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
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const folderName = route.params.name || '단어장 이름'

const wordList = ref([
  {
    text: '明日',
    reading: 'あした',
    meaning: '내일',
    onyomi: 'メイニチ',
    kunyomi: 'あした / あす',
    favorite: true,
    showDetail: false,
    examples: ['明日会いましょう – 내일 만나자'],
    breakdown: [
      { kanji: '明', onyomi: 'メイ', kunyomi: 'あか・あき・あけ' },
      { kanji: '日', onyomi: 'ニチ', kunyomi: 'ひ・か' }
    ]
  },
  {
    text: '勉強',
    reading: 'べんきょう',
    meaning: '공부',
    onyomi: 'ベン・キョウ',
    kunyomi: '',
    favorite: false,
    showDetail: false,
    examples: ['毎日勉強しています – 매일 공부하고 있어요'],
    breakdown: [
      { kanji: '勉', onyomi: 'ベン', kunyomi: '' },
      { kanji: '強', onyomi: 'キョウ', kunyomi: 'つよ・し' }
    ]
  },
  {
    text: '病院',
    reading: 'びょういん',
    meaning: '병원',
    onyomi: 'ビョウ・イン',
    kunyomi: '',
    favorite: false,
    showDetail: false,
    examples: ['病院に行きます – 병원에 갑니다'],
    breakdown: [
      { kanji: '病', onyomi: 'ビョウ', kunyomi: 'や・やまい' },
      { kanji: '院', onyomi: 'イン', kunyomi: '' }
    ]
  },
  {
    text: '試験',
    reading: 'しけん',
    meaning: '시험',
    onyomi: 'シ・ケン',
    kunyomi: '',
    favorite: false,
    showDetail: false,
    examples: ['試験を受けます – 시험을 봅니다'],
    breakdown: [
      { kanji: '試', onyomi: 'シ', kunyomi: 'こころ・ため' },
      { kanji: '験', onyomi: 'ケン', kunyomi: 'ため' }
    ]
  },
  {
    text: '図書館',
    reading: 'としょかん',
    meaning: '도서관',
    onyomi: 'ト・ショ・カン',
    kunyomi: '',
    favorite: false,
    showDetail: false,
    examples: ['図書館で本を借りました – 도서관에서 책을 빌렸어요'],
    breakdown: [
      { kanji: '図', onyomi: 'ト', kunyomi: 'はか' },
      { kanji: '書', onyomi: 'ショ', kunyomi: 'か・しょ' },
      { kanji: '館', onyomi: 'カン', kunyomi: '' }
    ]
  }
])


const toggleDetail = (index) => {
  wordList.value[index].showDetail = !wordList.value[index].showDetail
}

const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  speechSynthesis.speak(utterance)
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

</style>
