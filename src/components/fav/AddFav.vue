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
  wordbooks: Array,
})

const emit = defineEmits(['select', 'close'])

const select = (book) => emit('select', book)
const close = () => emit('close')
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  background: #ffffff;
  padding: 24px 20px;
  border-radius: 12px;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.modal h3 {
  margin-bottom: 16px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}

.modal ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.modal li {
  padding: 10px 12px;
  margin-bottom: 6px;
  border-radius: 8px;
  background-color: #f5f7ff;
  color: #1d5fd0;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  border: 1px solid transparent;
}

.modal li:hover {
  background-color: #e0eaff;
  border-color: #5869ff;
  color: #1d3dc0;
}

</style>
