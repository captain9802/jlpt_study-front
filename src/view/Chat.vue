<template>
  <div class="chat-wrapper" style="margin-top: 66px;">
    <div class="chat-container">
      <div :class="['chat-set', { center: showSetting }]">
        <Aiset v-if="showSetting" @complete="handleSettingComplete" />
        <div v-else class="chat-content">
          <div v-if="centerNotice" class="chat-center-notice">
            {{ centerNotice }}
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
                        :icon="msg.favorite ? 'mdi:star' : 'mdi:star-outline'"
                        :color="msg.favorite ? '#FFD700' : '#ccc'"
                        width="24"
                        height="24"
                        @click="() => {
                        const isAdding = !msg.favorite
                        toggleFavorite(index)
                        AddFavContent('sentence', msg, isAdding)
                        }"
                    />
                    <Icon icon="mdi:volume-high" class="icon" color="#ccc" width="24" height="24" />
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
                          <button @click="() => {
                            const isAdding = !msg.grammarFavorites?.[g.text]
                            toggleGrammarFavorite(index, g.text)
                            AddFavContent('grammar', g.text, isAdding)
                          }">
                            <Icon
                                :icon="msg.grammarFavorites?.[g.text] ? 'mdi:star' : 'mdi:star-outline'"
                                :color="msg.grammarFavorites?.[g.text] ? '#FFD700' : '#ccc'"
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
                          <button @click="() => {console.log(word)
                            const isAdding = !msg.wordFavorites?.[word.text]
                            toggleWordFavorite(index, word.text)
                            AddFavContent('word', word.text, isAdding)
                          }">
                            <Icon
                                :icon="msg.wordFavorites?.[word.text] ? 'mdi:star' : 'mdi:star-outline'"
                                :color="msg.wordFavorites?.[word.text] ? '#FFD700' : '#ccc'"
                                width="18"
                                height="18"
                            />
                          </button>
                        </div>
                        <button class="detail-btn" @click="toggleWordDetail(index, i)">[자세히 보기]</button>

                        <div v-if="word.showDetail" class="word-detail">
                          <table>
                            <thead>
                            <tr><th>항목</th><th>내용</th></tr>
                            </thead>
                            <tbody>
                            <tr><td>뜻</td><td>{{ word.meaning }}</td></tr>
                            <tr><td>음독</td><td>{{ word.onyomi }}</td></tr>
                            <tr><td>훈독</td><td>{{ word.kunyomi }}</td></tr>
                            </tbody>
                          </table>
                          <div class="examples" v-if="word.examples?.length">
                            <strong>예시:</strong>
                            <ul>
                              <li v-for="(ex, j) in word.examples" :key="j">{{ ex }}</li>
                            </ul>
                          </div>
                          <div v-if="word.breakdown?.length" class="kanji-breakdown">
                            <strong>한자 구성:</strong>
                            <ul>
                              <li v-for="(kanji, k) in word.breakdown" :key="k">
                                {{ kanji.kanji }} – (음독: {{ kanji.onyomi }} / 훈독: {{ kanji.kunyomi }})
                              </li>
                            </ul>
                          </div>
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
            />
            <button class="send-button" @click="sendMessage">
              <Icon icon="mdi:send" class="arrow-icon" color="white" width="24" height="24" />
            </button>
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
import {ref, nextTick, onMounted, watch, computed} from 'vue'
import Aiset from '@/components/ai/Aiset.vue'
import { toast } from 'vue3-toastify'
import AddFav from "@/components/fav/AddFav.vue"
import {sendChat, getAiSettings, getMemories, saveAiSettings, updateLanguageMode, fetchTooltipInfo } from '@/api/chat'
const loadingTooltips = ref({})
const showSetting = ref(true)
const message = ref('')

const placeholder = '여기에 메세지를 입력해주세요.\n(ここにメッセージを入力してください.)'

const messages = ref([])
const allMessageCount = ref(0)
const memoryList = ref([])
const noticeMessage = ref('')
const languageMode = ref(false);
let res = null
const userInput = ref('')
const maxLength = 200

const toggleInfo = async (index) => {
  const msg = messages.value[index]
  msg.showInfo = !msg.showInfo

  if (
      msg.showInfo &&
      !msg.__fetchedTooltipData &&
      !loadingTooltips.value[index]
  ) {
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
    const data = await fetchTooltipInfo(msg.text)
    console.log('[✅ 받은 툴팁 데이터]', data)
    msg.explanation = {
      translation: msg.explanation?.translation ?? data.explanation.translation,
      grammar: data.explanation.grammar,
    }
    msg.words = data.words
    msg.__fetchedTooltipData = true
  } catch (err) {
    console.error('툴팁 정보 요청 실패:', err)
  } finally {
    loadingTooltips.value[index] = false
  }
}

function checkLength() {
  if (userInput.value.length > maxLength) {
    userInput.value = userInput.value.slice(0, maxLength)
  }
}

const centerNotice = computed(() => {
  return memoryList.value.length >= 30
      ? '⚠️ 메모리가 부족하여 더이상 저장할 수 없습니다.'
      : noticeMessage.value
})

function handleAiMessage(message) {
  allMessageCount.value++
  messages.value.push(message)

  if (allMessageCount.value % 20 === 0) {
    summarizeMessages()
  }
}

function generateSummary(messages) {
  return messages.map(m => m.text).slice(0, 3).join(' / ') + ' ...'
}

function summarizeMessages() {
  if (messages.value.length < 30) return

  if (memoryList.value.length >= 30) {
    messages.value = messages.value.slice(-5)
    return
  }

  const summaryTarget = messages.value.slice(0, messages.value.length - 5)
  const recentMessages = messages.value.slice(-5)
  const summary = generateSummary(summaryTarget)

  noticeMessage.value = '💬 대화 내용을 축약하여 저장하였습니다.'

  memoryList.value.push({
    id: Date.now(),
    summary
  })

  messages.value = [...recentMessages]
}

const userWordbooks = ref([
  { id: 1, title: '기본 단어장' },
  { id: 2, title: 'JLPT N3 단어장' }
])

const selectedFavType = ref(null)
const selectedFavContent = ref(null)
const showFavoriteSelectModal = ref(false)

onMounted(async () => {
  res = await getMemories()
  if (res.data.Aisetting) {
    console.log(res);
    languageMode.value = res.data.hasLanguageMode
    showSetting.value = false
    handleSettingComplete()
  }

  const saved = localStorage.getItem('chatHistory')
  if (saved) {
    messages.value = JSON.parse(saved)
  }

  const savedMemories = localStorage.getItem('chatMemories')
  if (savedMemories) {
    memoryList.value = JSON.parse(savedMemories)
  }

})

watch(messages, (newVal) => {
  localStorage.setItem('chatHistory', JSON.stringify(newVal))
}, { deep: true })

watch(memoryList, (newVal) => {
  localStorage.setItem('chatMemories', JSON.stringify(newVal))
}, { deep: true })

function highlightFavorites(text, msg) {
  if (typeof text !== 'string') return ''

  const favorites = new Set([
    ...Object.keys(msg.wordFavorites || {}).filter(word => msg.wordFavorites[word]),
    ...Object.keys(msg.grammarFavorites || {}).filter(g => msg.grammarFavorites[g])
  ])

  if (favorites.size === 0) return text

  const pattern = new RegExp(`(${[...favorites].join('|')})`, 'g')
  return text.replace(pattern, '<span class="highlight">$1</span>')
}


function AddFavContent(type, content, isAdding) {
  const isSentence = type === 'sentence'
  const displayName = isSentence ? content.text : content
  if (!isAdding) {
    toast.error(
        `<span style="color:#5869ff;">${displayName}</span>가 <span style="color:#5869ff;">기본 북마크</span>에서 삭제되었습니다.`,
        { dangerouslyHTMLString: true }
    )
    return
  }
  selectedFavType.value = type
  selectedFavContent.value = content
  showFavoriteSelectModal.value = true
}

function handleAddToBook(book) {
  const type = selectedFavType.value
  let content = selectedFavContent.value
  if (type === 'sentence' && typeof content === 'object') {
    content = content.text
  }
  toast.success(
      `<span style="color:#5869ff;">${content}</span>가 <span style="color:#5869ff;">${book.title}</span>에 저장되었습니다.`,
      { dangerouslyHTMLString: true }
  )
  showFavoriteSelectModal.value = false
}

function closeFavModal() {
  showFavoriteSelectModal.value = false
}

async function handleSettingComplete() {
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

  setTimeout(() => {
    handleAiMessage({ from: 'ai', text: `안녕! 나는 ${settings.name}이야. 반가워!`, avatar: '/악어.png', showTooltip: false })
  }, 100)

  setTimeout(() => {
    if (!languageMode.value) {
    handleAiMessage({
      from: 'ai',
      text: '어떤 방식으로 대화할까요?\n1. 일본어로만\n2. 한국어 설명 포함\n3. 혼합 방식',
      avatar: '/악어.png',
      showTooltip: false
    })
  }}, 500)

  if (res?.data?.data?.length) {
    memoryList.value = res.data.data.map((m, i) => ({ id: i, summary: m.summary }))
    handleAiMessage({
      from: 'ai',
      text: `다시 왔구나! 👋 이전에 이런 이야기들을 했었지?\n📝 ${memoryList.value.map(m => m.summary).slice(0, 3).join(' / ')}`,
      avatar: '/악어.png'
    })
  }
}

async function sendMessage() {
  const userText = message.value.trim()
  if (!userText) return

  handleAiMessage({ from: 'me', text: userText, avatar: '/다람쥐.jpeg' })
  message.value = ''
  scrollToBottom()

  if (!languageMode.value) {
    if (/^1$/.test(userText)) languageMode.value = 'jp-only'
    else if (/^2$/.test(userText)) languageMode.value = 'ko'
    else if (/^3$/.test(userText)) languageMode.value = 'mix'

    if (languageMode.value) {
      try {
        await updateLanguageMode(languageMode.value)
        localStorage.setItem('languageMode', languageMode.value)

        handleAiMessage({
          from: 'ai',
          text: '좋아요! 이제 일본어 공부를 시작해볼까요? ✨',
          avatar: '/악어.png'
        })
      } catch (e) {
        console.error('❌ 언어 모드 저장 실패:', e)
      }
      return
    }

    handleAiMessage({
      from: 'ai',
      text: '1, 2, 3 중 하나를 숫자로 입력해 주세요.',
      avatar: '/악어.png'
    })
    return
  }

  const res = await sendChat({
    message: userText,
    language: languageMode.value
  })

  const content = res.data.choices?.[0]?.message?.content

  if (content) {
    try {
      const match = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/)
      if (!match) throw new Error('JSON 블록을 찾을 수 없음')

      const jsonString = match[0]
      const parsed = JSON.parse(jsonString)

      const parsedArray = Array.isArray(parsed) ? parsed : [parsed]

      parsedArray.forEach((parsed) => {
        let displayText = ''

        if (Array.isArray(parsed.words) && Array.isArray(parsed.translation)) {
          displayText = parsed.words.map((item, idx) => {
            const ko = parsed.translation[idx]?.word ?? ''
            const level = item.level || parsed.translation[idx]?.level || ''
            return `${item.word} : ${ko} / ${level}`
          }).join('\n')
        }

        else if (typeof parsed.text === 'string') {
          displayText = parsed.text
        }

        else {
          displayText = '⚠️ 알 수 없는 응답 형식입니다.'
        }

        if (typeof parsed.text === 'string' && typeof parsed.translation === 'string') {
          if (looksLikeFullKorean(parsed.text) && !looksLikeFullKorean(parsed.translation)) {
            const temp = parsed.text
            parsed.text = parsed.translation
            parsed.translation = temp
          }
        }

        let finalTranslation = ''
        if (Array.isArray(parsed.translation)) {
          finalTranslation = parsed.translation.map(t => `${t.word} / ${t.level}`).join('\n')
        } else {
          finalTranslation = parsed.translation || ''
        }

        handleAiMessage({
          from: 'ai',
          text: displayText,
          avatar: '/악어.png',
          explanation: {
            translation: finalTranslation
          },
          words: parsed.words || [],
          showTooltip: false,
          showInfo: false,
          showTranslation: false,
          favorite: false,
          wordFavorites: {},
          grammarFavorites: {}
        })
      })

    } catch (err) {
      console.error('GPT 응답 파싱 에러:', err)
      handleAiMessage({
        from: 'ai',
        text: '⚠️ 응답 파싱 실패. 다시 시도해 주세요.',
        avatar: '/악어.png'
      })
    }

}

}

function looksLikeFullKorean(text) {
  if (!text) return false
  const koreanMatch = text.match(/[가-힣]/g) || []
  const ratio = koreanMatch.length / text.length
  return ratio > 0.5
}


function closeTooltip(index) {
  messages.value[index].showTooltip = false
}

function toggleTooltip(index) {
  messages.value[index].showTooltip = !messages.value[index].showTooltip
}


function toggleFavorite(index) {
  messages.value[index].favorite = !messages.value[index].favorite
}

function toggleGrammarFavorite(index, grammarText) {
  const fav = messages.value[index].grammarFavorites
  fav[grammarText] = !fav[grammarText]
}

function toggleWordFavorite(index, word) {
  const fav = messages.value[index].wordFavorites
  fav[word] = !fav[word]
}

function toggleWordDetail(msgIndex, wordIndex) {
  messages.value[msgIndex].words[wordIndex].showDetail = !messages.value[msgIndex].words[wordIndex].showDetail
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

::v-deep(.highlight) {
  color: #3b82f6;
}

.arrow-icon {
  width: 20px;
  height: 20px;
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

.chat-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.chat-enter-active {
  transition: all 0.4s ease;
}

.chat-enter-to {
  opacity: 1;
  transform: translateY(0);
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

.chat-center-notice {
  text-align: center;
  color: #888;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}
</style>

