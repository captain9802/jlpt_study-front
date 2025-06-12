import API from './client'

export const saveAiSettings = (payload) => {
    return API.post('/ai-settings', payload)
}

export const updateLanguageMode = (mode) => {
    return API.put('/ai-settings/language-mode', { language_mode: mode })
}

export const resetAiSettings = () => {
    return API.post('/ai-reset')
}

export const getMemories = () => API.get('/chat-memories')

export const sendChat = ({ message, language = 'mix' }) =>
    API.post('/chat', {
        message,
        language,
    })

export const fetchTooltipInfo = async (sentence) => {
    const res = await API.post('/chat/tooltip', { text: sentence })
    return res.data
}

export const fetchTranslation = async ({ text, direction = 'ja-ko' }) => {
    const res = await API.post('/translate', {
        text,
        direction,
    })
    return res.data
}

export const fetchTTS = async (text) => {
    const res = await API.post(
        '/text-sound',
        { text },
        { responseType: 'blob' }
    )
    return res.data
}
