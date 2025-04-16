<template>
  <div class="dialog-wrapper">
    <div class="dialog">
      <h2 class="dialog-title">🧠 메모리 관리</h2>

      <div class="memory-list">
        <div
            v-for="(memo, index) in memoryList"
            :key="memo.id"
            class="memory-item"
        >
          <div class="memory-text">{{ memo.summary }}</div>
          <button class="delete-btn" @click="handleDelete(index)">
            <Icon icon="mdi:close" width="20" />
          </button>
        </div>
      </div>
      <p v-if="memoryList.length >= memoryLimit" class="limit-warning">
        메모리 공간이 가득 찼습니다. 더 이상 저장할 수 없습니다.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const memoryLimit = 10
const memoryList = ref([
  { id: 1, summary: '첫 번째 요약 내용입니다.' },
  { id: 2, summary: '두 번째 요약입니다. 내용이 여기에 나타납니다.' },
  { id: 3, summary: '두 번째 요약입니다. 내용이 여기에 나타납니다.' },
  { id: 4, summary: '두 번째 요약입니다. 내용이 여기에 나타납니다.' },
  { id: 5, summary: '두 번째 요약입니다. 내용이 여기에 나타납니다.' },
  { id: 6, summary: '두 번째 요약입니다. 내용이 여기에 나타납니다.' },
  { id: 7, summary: '두 번째 요약입니다. 내용이 여기에 나타납니다.' },
  { id: 8, summary: '두 번째 요약입니다. 내용이 여기에 나타납니다.' },
  { id: 9, summary: '두 번째 요약입니다. 내용이 여기에 나타납니다.' },
  { id: 10, summary: '두 번째 요약입니다. 내용이 여기에 나타납니다.' },
  { id: 11, summary: '두 번째 요약입니다. 내용이 여기에 나타납니다.' }
])

const handleDelete = (index) => {
  const confirmed = window.confirm('이 메모리를 삭제하시겠습니까?')
  if (confirmed) {
    memoryList.value.splice(index, 1)
  }
}
</script>

<style scoped>
.dialog-wrapper {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1024px;
  height: 100%;
  margin: 67px auto;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 800;
}

.dialog {
  width: 100%;
  background-color: #e6f2ff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}


.dialog-title {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
}

.memory-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.memory-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.memory-text {
  font-size: 0.95rem;
  flex: 1;
  margin-right: 8px;
}

.delete-btn {
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
}

.limit-warning {
  text-align: center;
  color: red;
  font-size: 0.9rem;
}
</style>
