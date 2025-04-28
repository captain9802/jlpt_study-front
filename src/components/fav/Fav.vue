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
            @click="goToDetail(card)"
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
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from "@iconify/vue"
import { toast } from "vue3-toastify"
import {
  getWordLists,
  createWordList,
  updateWordList,
  deleteWordList, getGrammarLists, createGrammarList, updateGrammarList, deleteGrammarList
} from '@/api/fav'
import router from "@/router/index.js";

const route = useRoute()

const cardList = ref([])

const goToDetail = (card) => {
  if (route.path === '/word_favorites') {
    router.push(`/word_favorites/${card.id}`)
  } else if (route.path === '/grammar_favorites') {
    router.push(`/grammar_favorites/${card.id}`)
  }
}


const pageTitle = computed(() => {
  if (route.path === '/word_favorites') return '내 단어장'
  if (route.path === '/grammar_favorites') return '문법 즐겨찾기'
  if (route.path === '/sentence_favorites') return '문장 즐겨찾기'
  return '즐겨찾기'
})

const randomColor = () => {
  const palette = ['#8dafff', '#d0ebc4', '#ffe28c', '#f8b5e4', '#c1e0ff']
  return palette[Math.floor(Math.random() * palette.length)]
}

const fetchLists = async () => {
  if (route.path === '/word_favorites') {
    const lists = await getWordLists()
    cardList.value = lists.map(list => ({
      ...list,
      label: list.title,
      preview: '미리보기 없음',
      editing: false
    }))
  } else if (route.path === '/grammar_favorites') {
    const lists = await getGrammarLists()
    cardList.value = lists.map(list => ({
      ...list,
      label: list.title,
      preview: '미리보기 없음',
      editing: false
    }))
  }
}

const addCard = async () => {
  const color = randomColor()
  let newList

  if (route.path === '/word_favorites') {
    newList = await createWordList({ title: '새 단어장', color })
  } else if (route.path === '/grammar_favorites') {
    newList = await createGrammarList({ title: '새 문법장', color })
  }

  cardList.value.push({
    ...newList,
    label: newList.title,
    preview: '예시 항목',
    editing: false
  })
}


const stopEditing = async (card) => {
  card.editing = false

  if (route.path === '/word_favorites') {
    await updateWordList(card.id, { title: card.label, color: card.color })
  } else if (route.path === '/grammar_favorites') {
    await updateGrammarList(card.id, { title: card.label, color: card.color })
  }
}


const confirmDelete = async (card) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    if (route.path === '/word_favorites') {
      await deleteWordList(card.id)
    } else if (route.path === '/grammar_favorites') {
      await deleteGrammarList(card.id)
    }

    toast.error(
        `<span style="color:#5869ff;">${card.label}</span>(이)가 즐겨찾기에서 삭제되었습니다.`,
        { dangerouslyHTMLString: true }
    )

    cardList.value = cardList.value.filter(c => c.id !== card.id)
  }
}


const startEditing = (card) => {
  card.editing = true
}

onMounted(() => {
  fetchLists()
})
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
  cursor: pointer;
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
