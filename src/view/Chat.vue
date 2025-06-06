<template>
  <div class="chat-wrapper" style="margin-top: 66px;">
    <Loading :visible="isLoading" />
    <div class="chat-container">
      <div :class="['chat-set', { center: showSetting }]">
        <Aiset v-if="showSetting === true" @complete="handleSettingComplete" />
        <div v-else class="chat-content">
          <div v-if="showLanguageDialog" class="language-dialog-overlay">
            <div class="language-dialog">
              <p class="question">어떤 방식으로 대화할까요?</p>
              <button @click="chooseLanguage('jp-only')">① 일본어로만</button>
              <button @click="chooseLanguage('ko')">② 일본어 + 한국어 혼합</button>
            </div>
          </div>
          <transition-group name="chat" tag="div" class="chat-messages">
            <div
                v-for="(msg, index) in messages"
                :key="index"
                :class="['chat-bubble', msg.from === 'me' ? 'me' : 'ai']"
            >
              <img :src="msg.avatar" class="avatar" />
              <div class="bubble-group">
                <div class="bubble">
                  <p v-if="msg.text" v-html="highlightFavorites(msg.text, msg)"></p>
                  <button
                      v-if="msg.from === 'ai'"
                      class="plus-btn"
                      @click="toggleTooltip(index)"
                  >
                    <Icon icon="mdi:plus" width="16" height="16" />
                  </button>
                </div>
                <div
                    v-if="msg.showTooltip"
                    class="tooltip"
                    :style="{
                      width: msg.showInfo || msg.showTranslation ? 'auto' : 'auto',
                      minWidth: msg.showInfo || msg.showTranslation ? '250px' : 'auto'
                    }"
                >
                  <div class="tooltip-buttons">
                    <Icon
                        icon="mdi:information-outline"
                        class="icon"
                        :color="msg.showInfo ? '#42a5f5' : '#ccc'"
                        width="24"
                        height="24"
                        @click="() => {
                          toggleInfo(index)
                          if (!msg.explanation || msg.words?.length === 0) {
                            handleTooltipClick(index, msg)
                          }
                        }"
                    />

                    <Icon
                        :icon="isSentenceFavorite(msg) ? 'mdi:star' : 'mdi:star-outline'"
                        :color="isSentenceFavorite(msg) ? '#FFD700' : '#ccc'"
                        width="24"
                        height="24"
                        @click="handleSentenceFavoriteClick(msg)"
                        style="cursor: pointer;"
                    />
                    <Icon
                        icon="mdi:volume-high"
                        class="icon"
                        color="#ccc"
                        width="24"
                        height="24"
                        @click="speakText(msg.text)"
                    />
                    <Icon
                        icon="mdi:translate"
                        class="icon"
                        width="24"
                        height="24"
                        @click="toggleTranslation(index)"
                        :color="msg.showTranslation ? '#42a5f5' : '#ccc'"
                    />
                    <Icon icon="mdi:close" class="icon" color="#ccc" width="24" height="24" @click="closeTooltip(index)" />
                  </div>
                  <div v-if="msg.showInfo" class="tooltip-info">
                    <p><strong>문장 해석:</strong> {{ msg.explanation.translation }}</p>
                    <p><strong>문법 표현:</strong></p>
                    <ul>
                      <li v-for="(g, gi) in msg.explanation.grammar" :key="gi">
                        <div class="tooltip-title">
                          {{ g.text }}: {{ g.meaning }}
                          <button @click="handleGrammarFavoriteClick(g)">
                            <Icon
                                :icon="isGrammarFavorite(g) ? 'mdi:star' : 'mdi:star-outline'"
                                :color="isGrammarFavorite(g) ? '#FFD700' : '#ccc'"
                                width="18"
                                height="18"
                            />
                          </button>
                        </div>
                      </li>
                    </ul>
                    <p><strong>주요 단어 해설:</strong></p>
                    <ul class="tooltip-ul">
                      <li v-for="(word, i) in msg.words" :key="i">
                        <div class="tooltip-title">
                          {{ word.text }}（{{ word.reading }}）: {{ word.meaning }}
                          <button @click="handleWordFavoriteClick(word)">
                            <Icon
                                :icon="isFavorite(word) ? 'mdi:star' : 'mdi:star-outline'"
                                :color="isFavorite(word) ? '#FFD700' : '#ccc'"
                                width="18"
                                height="18"
                            />
                          </button>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div v-if="msg.showTranslation" class="tooltip-info">
                    <p><strong>문장 해석:</strong> {{ msg.explanation.translation }}</p>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
          <div class="chat-input-box">
            <textarea
                v-model="message"
                class="chat-textarea"
                :placeholder="placeholder"
                :maxlength="maxLength"
                @input="checkLength"
                @keydown.enter.exact.prevent="sendMessage"
                :disabled="isSending"
            />
            <div class="chat-buttons">
              <button class="translate-button" @click="showTranslate = true">
                <Icon icon="mdi:translate" color="white" width="24" height="24" />
              </button>
              <TranslateDialog v-if="showTranslate" :onClose="() => showTranslate = false" />
              <button class="send-button" @click="sendMessage" :disabled="isSending || !message.trim()">
                <Icon icon="mdi:send" class="arrow-icon" color="white" width="24" height="24" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddFav
        v-if="showFavoriteSelectModal"
        :wordbooks="userWordbooks"
        @select="handleAddToBook"
        @close="closeFavModal"
    />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import {ref, nextTick, onMounted, watch, computed, toRaw} from 'vue'
import Aiset from '@/components/ai/Aiset.vue'
import { toast } from 'vue3-toastify'
import AddFav from "@/components/fav/AddFav.vue"
import {sendChat, getMemories, updateLanguageMode, fetchTooltipInfo } from '@/api/chat'
import {
  getFavoriteWords,
  getGrammarLists,
  getGrammarTexts, getSentenceLists, getSentenceTexts,
  getWordLists,
  toggleFavorites,
  toggleGrammarFavorites, toggleSentenceFavorites, fetchWordDetail
} from "@/api/fav.js";
import Loading from "@/components/Loading.vue";
import TranslateDialog from "@/components/translate/TranslateDialog.vue";
const loadingTooltips = ref({})
const showSetting = ref(false)
const message = ref('')

const placeholder = '여기에 메세지를 입력해주세요.\n(ここにメッセージを入力してください.)'
let res = null;
const messages = ref([])
const wordList = ref([])
const userInput = ref('')
const maxLength = 200
const favoriteWords = ref([])
const grammarTexts = ref([])
const grammarLists = ref([])
const sentenceList = ref([])
const sentenceTexts = ref([])
const userWordbooks = ref([])
const isLoading = ref(false)
const isSending = ref(false)
const selectedFavType = ref(null)
const selectedFavContent = ref(null)
const showFavoriteSelectModal = ref(false)

const languageMode = ref('')
const showLanguageChoice = ref(false)
const showLanguageDialog = ref(false)
const showTranslate = ref(false)
onMounted(async () => {
  await loadFavoriteWords()
  await loadFavoriteGrammar()
  await loadFavoriteSentence()
})

const speakText = (msg) => {
  const utterance = new SpeechSynthesisUtterance(msg)
  utterance.lang = 'ja-JP'
  utterance.rate = 1
  utterance.pitch = 1
  speechSynthesis.speak(utterance)
}

function isSentenceFavorite(sentenceObj) {
  const text = toRaw(sentenceObj)?.text;
  if (typeof text !== 'string') return false;

  const normalized = text.trim();
  return favoriteSentenceSet.value.has(normalized);
}

const favoriteSentenceSet = computed(() => {
  return new Set(sentenceTexts.value);
});

function isGrammarFavorite(grammar) {
  const normalize = (str) => str.replace(/^〜/, '').trim();
  const normalizedText = normalize(toRaw(grammar).text);

  return [...favoriteGrammarSet.value].some(item => normalize(item) === normalizedText);
}

const favoriteGrammarSet = computed(() => {
  const set = new Set();

  for (const grammar of grammarTexts.value) {
    set.add(grammar);
  }

  return set;
});

const handleSentenceFavoriteClick = (sentence) => {
  const raw = toRaw(sentence)

  if (isSentenceFavorite(sentence)) {
    selectedFavContent.value = {
      type: 'sentence',
      ...raw
    };
    handleAddToBook({ id: raw.list_id, title: '' }, true);
  } else {
    AddFavContent('sentence', {
      text: raw.text,
      meaning: raw.explanation.translation
    }, true);
  }
}


const handleGrammarFavoriteClick = (grammar) => {
  const raw = toRaw(grammar)

  if (isGrammarFavorite(grammar)) {
    selectedFavContent.value = {
      type: 'grammar',
      ...raw
    };
    handleAddToBook({ id: raw.list_id, title: '' }, true);
  } else {
    AddFavContent('grammar', {
      text: raw.text,
      meaning: raw.meaning
    }, true);
  }
}

const handleWordFavoriteClick = (word) => {
  const isFavorited = isFavorite(word);
  if (isFavorited) {
    selectedFavContent.value = word;
    handleAddToBook({ id: word.list_id, title: '' }, true);
  } else {
    AddFavContent('word', word, true);
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


const toggleInfo = async (index) => {
  const msg = messages.value[index]
  msg.showInfo = !msg.showInfo
  if (msg.showInfo && !msg.__fetchedTooltipData && !loadingTooltips.value[index]) {
    await handleTooltipClick(index, msg)
  }
}

const handleTooltipClick = async (index, msg) => {
  if (
      msg.__fetchedTooltipData ||
      loadingTooltips.value[index]
  ) return

  loadingTooltips.value[index] = true
  try {
    isLoading.value = true
    const data = await fetchTooltipInfo(msg.text)
    msg.explanation = {
      translation: msg.explanation?.translation ?? data.explanation.translation,
      grammar: data.explanation.grammar,
    }
    msg.words = data.words
    msg.__fetchedTooltipData = true
  } catch (err) {
    console.error('툴팁 정보 요청 실패:', err)
  } finally {
    isLoading.value = false
    loadingTooltips.value[index] = false
  }
}

function checkLength() {
  if (userInput.value.length > maxLength) {
    userInput.value = userInput.value.slice(0, maxLength)
  }
}

onMounted(() => {
  const stored = localStorage.getItem('ai-messages')
  if (stored) {
    messages.value = JSON.parse(stored)
  }
})


function handleAiMessage(message) {
  messages.value.push(message)
  saveMessagesToStorage()
}

function saveMessagesToStorage() {
  localStorage.setItem('ai-messages', JSON.stringify(messages.value))
}

onMounted(() => {
  window.chooseLangMode = async (mode) => {
    languageMode.value = mode
    showLanguageChoice.value = false
    try {
      await updateLanguageMode(mode)
      handleAiMessage({
        from: 'ai',
        text: '좋아요! 이제 일본어 공부를 시작해볼까요? ✨',
        avatar: '/악어.png'
      })
    } catch (e) {
      console.error('❌ 언어 모드 저장 실패:', e)
    }
  }
})

const chooseLanguage = async (mode) => {
  languageMode.value = mode
  showLanguageDialog.value = false
  try {
    await updateLanguageMode(mode)
    handleAiMessage({
      from: 'ai',
      text: '좋아요! 이제 일본어 공부를 시작해볼까요? ✨',
      avatar: '/악어.png'
    })
  } catch (e) {
    console.error('❌ 언어 모드 저장 실패:', e)
  }
}


onMounted(async () => {
  res = await getMemories()
  showSetting.value = true
  if (res.data.Aisetting) {
    languageMode.value = res.data.hasLanguageMode
    showSetting.value = false
    handleSettingComplete()
  }

  if (res?.data?.data?.length && !localStorage.getItem('ai-messages')) {
    handleAiMessage({
      from: 'ai',
      text: `다시 왔구나! 와줘서 기뻐~ 👋 `,
      avatar: '/악어.png'
    })
  }

  if (!languageMode.value) {
    showLanguageChoice.value = true
  }
})

onMounted(async () => {
  const wordRes = await getWordLists()
  const grammarRes = await getGrammarLists()
  const sentenceRes = await getSentenceLists()

  res.value = wordRes
  grammarLists.value = grammarRes
  sentenceList.value = sentenceRes

  updateUserWordbooks()
})

watch(selectedFavType, () => {
  updateUserWordbooks()
})

const updateUserWordbooks = () => {
  if (selectedFavType.value === 'word') {
    userWordbooks.value = res.value
  } else if (selectedFavType.value === 'grammar') {
    userWordbooks.value = grammarLists.value
  } else {
    userWordbooks.value = sentenceList.value
  }
}

function highlightFavorites(text, msg) {

  if (msg.isHtml) return text;

  if (typeof text !== 'string') return '';

  const favorites = [...favoriteSet.value];

  if (favorites.length === 0) return text;

  favorites.sort((a, b) => b.length - a.length);
  const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(${favorites.map(escapeRegExp).join('|')})`, 'g');

  return text.replace(pattern, '<span class="highlight">$1</span>');
}


function AddFavContent(type, content, isAdding) {
  selectedFavType.value = type
  selectedFavContent.value = {
    type,
    ...content
  }
  showFavoriteSelectModal.value = true
}

const loadFavoriteSentence = async () => {
  try {
    const data = await getSentenceTexts()
    sentenceTexts.value = data
  } catch (error) {
    console.error('즐겨찾기 문장 불러오기 실패:', error)
  }
}


const loadFavoriteGrammar = async () => {
  try {
    const data = await getGrammarTexts()
    grammarTexts.value = data
  } catch (error) {
    console.error('즐겨찾기 문법 불러오기 실패:', error);
  }
}

async function loadFavoriteWords() {
  try {
    const favorites = await getFavoriteWords();
    favoriteWords.value = favorites;
  } catch (error) {
    console.error('즐겨찾기 단어 불러오기 실패:', error);
  }
}

async function handleAddToBook(book, forceDelete = false) {
  const content = selectedFavContent.value;
  const type = content.type || 'word';

  isLoading.value = true;

  try {
    let result;
    showFavoriteSelectModal.value = false;
    if (type === 'word') {
      const wordInfo = await fetchWordDetail(content.text);
      result = await toggleFavorites({
        list_id: book.id,
        text: content.text,
        reading: content.reading,
        meaning: content.meaning,
        onyomi: wordInfo.onyomi,
        kunyomi: wordInfo.kunyomi,
        examples: JSON.parse(JSON.stringify(wordInfo.examples || [])),
        breakdown: JSON.parse(JSON.stringify(wordInfo.breakdown || []))
      });
    } else if (type === 'grammar') {
      result = await toggleGrammarFavorites({
        list_id: book.id,
        grammar: content.grammar || content.text,
        meaning: content.meaning
      });
    } else if (type === 'sentence') {
      result = await toggleSentenceFavorites({
        list_id: book.id,
        text: content.text,
        meaning: content.meaning,
        examples: JSON.parse(JSON.stringify(content.examples || []))
      });
    }

    const label = `<span style="color:#5869ff;">${content.text}</span>`;
    const list = `<span style="color:#5869ff;">${book.title}</span>`;

    if (result?.message?.includes('추가')) {
      toast.success(`${label}가 ${list}에 추가되었습니다.`, { dangerouslyHTMLString: true });
    } else {
      toast.error(`${label}가 즐겨찾기에서 삭제되었습니다.`, { dangerouslyHTMLString: true });
    }
  } catch (err) {
    toast.error('즐겨찾기 처리 중 오류가 발생했습니다.');
    console.error('❌ 즐겨찾기 토글 오류:', err);
  } finally {
    if (type === 'word') await loadFavoriteWords();
    else if (type === 'grammar') await loadFavoriteGrammar();
    else if (type === 'sentence') await loadFavoriteSentence();

    isLoading.value = false;
  }
}


function closeFavModal() {
  showFavoriteSelectModal.value = false
}

const handleSettingComplete = () => {
  showSetting.value = false
  const avatarName = document.querySelector('.avatar-name')?.innerText || 'AI'
  const stored = JSON.parse(sessionStorage.getItem('Aiset') || '{}')

  const settings = {
    name: avatarName,
    personality: stored.options?.personality,
    tone: stored.options?.tone,
    voice: stored.options?.voice,
    level: stored.levels?.[0] || 'N5'
  }

  sessionStorage.setItem('AiSettings', JSON.stringify(settings))

  if (!languageMode.value) {
    showLanguageDialog.value = true
  }}

async function sendMessage() {
  const userText = message.value.trim()
  if (!userText) return

  isSending.value = true
  handleAiMessage({ from: 'me', text: userText, avatar: '/다람쥐.jpeg' })
  message.value = ''
  scrollToBottom()

  try {
    const res = await sendChat({
      message: userText,
      language: languageMode.value
    })

    const { text, translation } = res.data

    if (!text) {
      throw new Error('text 필드가 응답에 없음')
    }

    handleAiMessage({
      from: 'ai',
      text: text,
      avatar: '/악어.png',
      explanation: {
        translation: translation || ''
      },
      words: [],
      showTooltip: false,
      showInfo: false,
      showTranslation: false,
      favorite: false,
      wordFavorites: {},
      grammarFavorites: {}
    })

  } catch (err) {
    console.error('GPT 응답 처리 오류:', err)
    handleAiMessage({
      from: 'ai',
      text: '⚠️ 응답 처리 실패. 다시 시도해 주세요.',
      avatar: '/악어.png'
    })
  } finally {
    isSending.value = false
  }
}

function closeTooltip(index) {
  messages.value[index].showTooltip = false
}

function toggleTooltip(index) {
  messages.value[index].showTooltip = !messages.value[index].showTooltip
}

function toggleTranslation(index) {
  messages.value[index].showTranslation = !messages.value[index].showTranslation
  messages.value[index].showInfo = false
}

function scrollToBottom() {
  nextTick(() => {
    const container = document.querySelector('.chat-messages')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}

</script>



<style scoped>
.chat-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  background-color: #5869FF;
  max-width: 1024px;
  margin: 0 auto;
  height: calc(100dvh - 66px);
  border-left: 10px solid #5869FF;
  border-right: 10px solid #5869FF;
  border-bottom: 10px solid #5869FF;
  position: relative;
  padding-bottom: 16px;
}

.chat-container {
  width: 100%;
  max-width: 1024px;
  background-color: white;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.chat-set {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.chat-set.center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: unset;
}

.chat-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  height: 100%;
  position: relative;
}

.chat-input-box {
  max-width: 1024px;
  height: 105px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.10);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  position: relative;
}

.chat-textarea {
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  outline: none;
  color: #000;
  background: transparent;
  font-family: inherit;
  line-height: 1.4;
  white-space: pre-line;
  font-size: 1rem;
}

.chat-textarea::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.translate-button,
.send-button {
  width: 40px;
  height: 40px;
  background-color: #5869FF;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.chat-buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.translate-button:hover {
  opacity: 0.5;
}

::v-deep(.highlight) {
  color: #3b82f6;
}

.arrow-icon {
  width: 20px;
  height: 20px;
}

.send-button:disabled {
  background-color: #cccccc;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 8px 4rem 0;
  box-sizing: content-box;
  position: relative;
}

.chat-bubble {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.chat-bubble.me {
  flex-direction: row-reverse;
  align-items: center;
}

.bubble {
  background-color: #e0f0ff;
  padding: 0 1rem;
  border-radius: 12px;
  font-size: clamp(14px, 1.5vw, 16px);
  max-width: 100%;
  word-break: break-word;
  position: relative;
  white-space: pre-line;
}

.bubble-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;
}

.chat-bubble.me .bubble-group {
  align-items: flex-end;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.plus-btn {
  position: absolute;
  right: -1px;
  bottom: -10px;
  width: 24px;
  height: 24px;
  background-color: #5869FF;
  color: white;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tooltip {
  color: #333;
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 14px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  background-color: #fefefe;
  display: inline-block;
  width: max-content;
  min-width: 250px;
  overflow-x: auto;
  word-break: break-word;
  z-index: 50;
}

.tooltip-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tooltip-info {
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 8px;
  font-size: 0.85rem;
  color: #333;
  min-width: 220px;
}

.tooltip-ul {
  display: grid;
  gap: 0.5rem;
}

.tooltip-info ul {
  padding-left: 20px;
}

.tooltip-title {
  display: flex;
  align-items: center;
}

.icon {
  font-size: clamp(14px, 1.5vw, 16px);
  cursor: pointer;
  background: none;
  border: none;
  padding: 4px;
  transition: 0.2s;
}

.icon.active {
  color: #5869FF;
}

.fav-button {
  display: flex;
}

.tooltip-info button {
  background: none;
  border: none;
  font-size: 14px;
  opacity: 50%;
  cursor: pointer;
  color: #3e3e3e;
}

.word-detail {
  margin-top: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem;
  background-color: #f9f9f9;
  width: 100%;
  box-sizing: border-box;
}

.word-detail table {
  width: 100%;
  border-collapse: collapse;
}

.word-detail th,
.word-detail td {
  border: 1px solid #ddd;
  padding: 6px;
  text-align: left;
  word-break: keep-all;
}

.word-detail .examples {
  margin-top: 0.5rem;
  padding-left: 0.5rem;
}

.kanji-breakdown {
  margin-top: 0.5rem;
  padding-left: 0.5rem;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.language-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.language-dialog {
  width: 100%;
  max-width: 400px;
  margin: 0 1rem;
  background-color: #ffffff;
  padding: 2rem 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.language-dialog .question {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.language-dialog button {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.9rem;
  font-size: 1rem;
  border: none;
  background-color: #5a75ff;
  color: white;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.language-dialog button:hover {
  background-color: #4055d4;
  transform: translateY(-2px);
}

.language-dialog button:active {
  transform: translateY(0);
}



</style>

