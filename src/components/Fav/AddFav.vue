<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal">
      <h3>어떤 단어장에 추가할까요?</h3>
      <ul>
        <li
            v-for="book in wordbooks"
            :key="book.id"
            @click="select(book)"
        >
          {{ book.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  wordbooks: Array
})
const emit = defineEmits(['select', 'close'])

const select = (book) => emit('select', book)
const close = () => emit('close')
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 280px;
  text-align: center;
}
.modal h3 {
  margin-bottom: 12px;
}
.modal ul {
  list-style: none;
  padding: 0;
}
.modal li {
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}
.modal li:hover {
  background: #f0f0f0;
}
</style>
