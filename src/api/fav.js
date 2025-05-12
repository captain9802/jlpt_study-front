import API from './client'

export const getSentenceLists = async () => {
    const res = await API.get('/favorites/sentence-lists')
    return res.data
}

export const createSentenceList = async ({ title, color }) => {
    const res = await API.post('/favorites/sentence-lists', { title, color })
    return res.data
}

export const updateSentenceList = async (id, { title, color }) => {
    const res = await API.put(`/favorites/sentence-lists/${id}`, { title, color })
    return res.data
}

export const deleteSentenceList = async (id) => {
    const res = await API.delete(`/favorites/sentence-lists/${id}`)
    return res.data
}

export const getSentencesByList = async (listId) => {
    const res = await API.get(`/favorites/sentences/${listId}`)
    return res.data
}

export const getSentenceTexts = async () => {
    const res = await API.get('/favorites/sentences')
    return res.data
}

export const toggleSentenceFavorites = async (data) => {
    const res = await API.post('/favorites/sentences/toggle', data, {
        headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
}

export const getSentenceQuiz = async ({ listId, order }) => {
    const res = await API.post('/quiz/sentence', {
        list_id: listId,
        order
    })
    return res.data
}

export const getGrammarLists = async () => {
    const res = await API.get('/favorites/grammar-lists')
    return res.data
}

export const createGrammarList = async ({ title, color }) => {
    const res = await API.post('/favorites/grammar-lists', { title, color })
    return res.data
}

export const updateGrammarList = async (id, { title, color }) => {
    const res = await API.put(`/favorites/grammar-lists/${id}`, { title, color })
    return res.data
}

export const deleteGrammarList = async (id) => {
    const res = await API.delete(`/favorites/grammar-lists/${id}`)
    return res.data
}

export const getGrammarsByList = async (listId) => {
    const res = await API.get(`/favorites/grammars/${listId}`)
    return res.data
}

export const getGrammarTexts = async () => {
    const res = await API.get('/favorites/grammars')
    return res.data
}

export const toggleGrammarFavorites = async (data) => {
    const res = await API.post('/favorites/grammars/toggle', data, {
        headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
}

export const getGrammarQuiz = async ({ listId, order }) => {
    const res = await API.post('/quiz/grammar', {
        list_id: listId,
        order
    })
    return res.data
}

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

export const fetchWordDetail = async (text) => {
    const res = await API.post('/favorites/word-detail', { text });
    return res.data;
};

export const getWordQuiz = async ({ listId, order, direction }) => {
    const res = await API.post('/quiz/word', {
        list_id: listId,
        order,
        direction
    })
    return res.data
}

export const getWordQuizLimited = async ({ listId, order, direction, count }) => {
    const res = await API.post('/quiz/jlpt', {
        list_id: listId,
        order,
        direction,
        count
    })
    return res.data
}
