import API from './client'

export const getWordLists = async () => {
    const res = await API.get('/favorites/lists')
    return res.data
}

export const createWordList = async ({ title, color }) => {
    const res = await API.post('/favorites/lists', { title, color })
    return res.data
}

export const updateWordList = async (id, { title, color }) => {
    const res = await API.put(`/favorites/lists/${id}`, { title, color })
    return res.data
}

export const deleteWordList = async (id) => {
    const res = await API.delete(`/favorites/lists/${id}`)
    return res.data
}

export const getWordsByList = async (listId) => {
    const res = await API.get(`/favorites/words/${listId}`)
    return res.data
}

export const addWordToList = async (wordData) => {
    const res = await API.post('/favorites/words', wordData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return res.data
}

export const deleteWord = async (id) => {
    const res = await API.delete(`/favorites/words/${id}`)
    return res.data
}

export const getFavoriteWords = async () => {
    const res = await API.get('/favorites/words')
    return res.data
}

export const toggleFavorites = async (wordData) => {
    const res = await API.post('/favorites/words/toggle', wordData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return res.data
}
