import API from './client'

export const getAiSettings = () => API.get('/ai-settings')

export const saveAiSettings = (payload) => {
    return API.post('/ai-settings', payload)
}

export const updateLanguageMode = (mode) => {
    return API.put('/ai-settings/language-mode', { language_mode: mode })
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
