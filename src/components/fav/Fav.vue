<template>
  <div class="fav-page" style="margin-top: 66px;">
    <h2 class="title">{{ pageTitle }}</h2>
    <div class="card-grid">
      <div
          v-for="card in cardList"
          :key="card.id"
          class="word-card-wrapper"
      >
        <div
            class="word-card"
            :style="{ backgroundColor: card.color || '#eee' }"
        >
          <div class="card-main">{{ card.preview || '미리보기 없음' }}</div>

          <Icon
              v-if="cardList.length > 1"
              icon="mdi:close-circle"
              class="delete-icon"
              @click.stop="confirmDelete(card)"
          />
        </div>
        <div class="card-title" @click="startEditing(card)" v-if="!card.editing">
          {{ card.label }}
        </div>
        <input
            v-else
            class="card-input"
            v-model="card.label"
            @blur="stopEditing(card)"
            @keyup.enter="stopEditing(card)"
        />
      </div>

      <div class="word-card-wrapper">
        <div class="word-card add-card" @click="addCard">
          <div class="card-main"><Icon icon="mdi:plus" class="card-main" width="32" height="32" />
          </div>
        </div>
        <div class="card-title muted">새로운 단어장</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {Icon} from "@iconify/vue";
import {toast} from "vue3-toastify";

const route = useRoute();

const randomColor = () => {
  const palette = ['#8dafff', '#d0ebc4', '#ffe28c', '#f8b5e4', '#c1e0ff']
  return palette[Math.floor(Math.random() * palette.length)]
}

function confirmDelete(card) {
  if (confirm('정말 삭제하시겠습니까?')) {
    toast.error(
        `<span style="color:#5869ff;">${card.label}</span>(이)가 즐겨찾기에서 삭제되었습니다.`,
        {
          dangerouslyHTMLString: true
        }
    )
    cardList.value = cardList.value.filter(c => c.id !== card.id)
  }
}

const baseCards = {
  '/word_favorites': {
    title: '내 단어장',
    cards: [
      { id: 1, label: '저장 된 단어', color: '#8dafff', preview: 'ありがとう' },
      { id: 2, label: '일상생활용', color: '#d0ebc4', preview: 'ごはん' },
      { id: 3, label: 'N3 시험용', color: '#ffe28c', preview: '可能性' }
    ]
  },
  '/grammar_favorites': {
    title: '문법 즐겨찾기',
    cards: [
      { id: 1, label: '중요 문법', color: '#8dafff', preview: '〜ている' },
      { id: 2, label: '시험 대비', color: '#d0ebc4', preview: '〜ながら' },
      { id: 3, label: 'JLPT N3 문법', color: '#ffe28c', preview: '〜ことがある' }
    ]
  },
  '/sentence_favorites': {
    title: '문장 즐겨찾기',
    cards: [
      { id: 1, label: '좋아하는 문장', color: '#8dafff', preview: '明日は映画を見に行く予定です。' },
      { id: 2, label: '일본어 회화', color: '#d0ebc4', preview: 'お元気ですか？' },
      { id: 3, label: 'N3 듣기 예문', color: '#ffe28c', preview: '駅までどうやって行きますか？' }
    ]
  }
}

const pageTitle = computed(() => baseCards[route.path]?.title || '즐겨찾기')
const cardList = ref(baseCards[route.path]?.cards.map(card => ({ ...card, editing: false })) || [])

function addCard() {
  cardList.value.push({
    id: Date.now(),
    label: '새 단어장',
    color: randomColor(),
    preview: '예시 항목',
    editing: false
  })
}

function startEditing(card) {
  card.editing = true
}

function stopEditing(card) {
  card.editing = false
}
</script>

<style scoped>
.fav-page {
  max-width: 1024px;
  margin: 0 auto;
  padding: 1rem 1rem;
}

.title {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  margin-top: 0;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.5rem;
  width: 100%;
  justify-content: center;
}

.word-card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.word-card {
  position: relative;
  aspect-ratio: 2/3;
  border-radius: 12px;
  padding: 1rem 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 180px;
  color: #333;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.delete-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #d12a2a;
  cursor: pointer;
  font-size: 20px;
  transition: opacity 0.2s ease;
  background-color: white;
  border-radius: 50%;
}

.delete-icon:hover {
  opacity: 0.7;
}

.card-title {
  font-size: 0.95rem;
  font-weight: bold;
  margin-top: 0.75rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.card-title:hover {
  border-color: #1d5fd0;
}

.card-title.muted {
  color: #aaa;
}

.card-input {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
  border: none;
  border-bottom: 1px solid #aaa;
  outline: none;
  width: 100%;
  max-width: 140px;
  background: transparent;
}

.add-card {
  border: 2px dashed #ccc;
  background-color: transparent !important;
  color: #888;
  cursor: pointer;
}
</style>
