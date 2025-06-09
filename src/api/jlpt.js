import API from './client'

export const getWordsByLevel = async (level, page = 1, perPage = 50) => {
    const res = await API.get('/jlpt_words', {
        params: {
            level,
            page,
            per_page: perPage
        }
    })
    return res.data
}

export const getTodayWord = async () => {
    const res = await API.get('/today-word')
    return res.data
}