<template>
  <div class="fav-page" style="margin-top: 66px;">
    <h2 class="title">JLPT 단어장</h2>
    <div class="card-grid">
      <div
          v-for="card in jlptLists"
          :key="card.id"
          class="word-card-wrapper"
      >
        <div
            class="word-card"
            :style="{ backgroundColor: card.color }"
            @click="goToDetail(card)"
        >
          <div class="card-main">{{ card.preview }}</div>
        </div>
        <div class="card-title">{{ card.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const jlptLists = [
  { id: 1, level: 'N1', label: 'JLPT N1 단어장', preview: '最上級', color: '#d32f2f' },
  { id: 2, level: 'N2', label: 'JLPT N2 단어장', preview: '重要な語彙', color: '#f57c00' },
  { id: 3, level: 'N3', label: 'JLPT N3 단어장', preview: '中級単語', color: '#fbc02d' },
  { id: 4, level: 'N4', label: 'JLPT N4 단어장', preview: '基本単語', color: '#388e3c' },
  { id: 5, level: 'N5', label: 'JLPT N5 단어장', preview: '初級単語', color: '#1976d2' }
]

const goToDetail = (card) => {
  router.push(`/jlpt_words/${card.level.toLowerCase()}`)
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
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.card-title {
  font-size: 0.95rem;
  font-weight: bold;
  margin-top: 0.75rem;
  text-align: center;
  color: #333;
}
</style>
