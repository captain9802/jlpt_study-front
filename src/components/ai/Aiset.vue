<template>
  <div class="dialog">
    <div class="dialog-header">
        <button class="arrow" @click="prevAvatar">
          <Icon icon="mdi:chevron-left" width="24" height="24" />
        </button>
        <div class="avatar-box">
          <img :src="currentAvatar.image" alt="avatar" class="avatar" />
          <div class="avatar-name">{{ currentAvatar.name }}</div>
        </div>
        <button class="arrow" @click="nextAvatar">
          <Icon icon="mdi:chevron-right" width="24" height="24" />
        </button>
      </div>

      <div class="dialog-content">
        <div
            v-for="(item, index) in optionList"
            :key="index"
            class="option-block"
        >
          <div class="option-title">{{ item.label }}</div>
          <div class="option-row">
            <button class="arrow" @click="prev(item.key)">
              <Icon icon="mdi:chevron-left" width="20" height="20" />
            </button>
            <div class="option-value">{{ currentOptions[item.key] }}</div>
            <button class="arrow" @click="next(item.key)">
              <Icon icon="mdi:chevron-right" width="20" height="20" />
            </button>
          </div>
        </div>
      </div>

    <div class="level-select">
      <p><strong>원하는 수준(話のレベル)</strong></p>
      <div class="levels">
        <label v-for="level in levels" :key="level">
          <input
              type="checkbox"
              :value="level"
              v-model="selectedLevels"
              @change="handleLevelChange(level)"
          />
          {{ level }}
        </label>
      </div>
    </div>
    <button class="complete-button" @click="onComplete">
      설정 완료
    </button>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import {Icon} from "@iconify/vue";

const avatarList = [
  { name: '악어', image: '/악어.png' },
  { name: '쿼카', image: '/쿼카.jpg' },
  { name: '다람쥐', image: '/다람쥐.jpeg' },
]
const currentAvatarIndex = ref(0)
const currentAvatar = computed(() => avatarList[currentAvatarIndex.value])

function prevAvatar() {
  currentAvatarIndex.value =
      (currentAvatarIndex.value - 1 + avatarList.length) % avatarList.length
}
function nextAvatar() {
  currentAvatarIndex.value =
      (currentAvatarIndex.value + 1) % avatarList.length
}

const emit = defineEmits(['complete'])


function onComplete() {
  sessionStorage.setItem('Aiset', 'true')
  console.log('🎉 설정 완료:', {
    avatar: currentAvatar.value,
    options: { ...currentOptions },
    levels: [...selectedLevels.value],
  })
  emit('complete')
}

const optionData = {
  personality: [
    '밝은(活発)',
    '차분한(冷静)',
    '명랑한(快活)',
    '진지한(真面目)',
    '장난기 있는(茶目っ気)'
  ],
  tone: [
    '친근한(親しみやすい)',
    '공손한(丁寧)',
    '차분한(落ち着いた)',
    '밝은(明るい)',
    '애교 있는(愛嬌のある)'
  ],
  voice: [
    '여성(女性)',
    '남성(男性)',
    '중성(中性的)',
    '아이 목소리(子供の声)',
    '로봇 스타일(ロボット風)'
  ]
}
const currentOptions = reactive({
  personality: optionData.personality[0],
  tone: optionData.tone[0],
  voice: optionData.voice[0],
})

const optionList = [
  { label: '성격(性格)', key: 'personality' },
  { label: '말투(口調)', key: 'tone' },
  { label: '목소리(声)', key: 'voice' },
]

function prev(key) {
  const list = optionData[key]
  const index = list.indexOf(currentOptions[key])
  currentOptions[key] = list[(index - 1 + list.length) % list.length]
}
function next(key) {
  const list = optionData[key]
  const index = list.indexOf(currentOptions[key])
  currentOptions[key] = list[(index + 1) % list.length]
}

const levels = ['N1', 'N2', 'N3', 'N4', 'N5']
const selectedLevels = ref(['N4', 'N5'])

function handleLevelChange(clickedLevel) {
  const clickedIndex = levels.indexOf(clickedLevel)
  selectedLevels.value = levels.slice(clickedIndex)
}

</script>

<style scoped>
.dialog {
  width: 100%;
  max-width: 400px;
  height: 540px;
  background-color: #e6f2ff;
  border-radius: 10px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dialog-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.avatar-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}
.avatar-name {
  font-size: 1rem;
  margin-top: 6px;
  font-weight: bold;
}

.arrow {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dialog-content {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.option-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
}

.option-title {
  font-weight: bold;
}

.option-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 10px;
  padding: 8px 12px;
  height: 27px;
}

.option-value {
  font-size: 0.95rem;
  flex-grow: 1;
  text-align: center;
}

.level-select {
  text-align: center;
}

.levels {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

input[type='checkbox'] {
  accent-color: #5869ff;
}

.complete-button {
  width: 100%;
  padding: 12px;
  margin-top: 16px;
  background-color: #5869ff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  :hover {
    opacity: 0.5%;
  }
}

.complete-button:hover {
  background-color: #4756d4;
}
</style>
