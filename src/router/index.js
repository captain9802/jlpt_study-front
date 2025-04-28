import { createRouter, createWebHistory } from 'vue-router';
import Login from '../view/Login.vue';
import Chat from '../view/Chat.vue';
import Fav from "@/components/fav/Fav.vue";
import WordQuiz from "@/view/quiz/WordQuiz.vue";
import WordDetailFav from "@/components/fav/WordDetailFav.vue";
import QuizResult from "@/components/result/QuizResult.vue";
import Aimemory from "@/components/ai/Aimemory.vue";
import JpnChobo from "@/components/study/JpnChobo.vue";
import GrammarDetailFav from "@/components/fav/GrammarDetailFav.vue";

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
    {
        path: '/chat',
        name: 'Chat',
        component: Chat,
    },
    {
        path: '/word_favorites',
        name: 'Fav_word',
        component: Fav
    },
    {
        path: '/grammar_favorites',
        name: 'Fav_grammar',
        component: Fav
    },
    {
        path: '/sentence_favorites',
        name: 'Fav_sentence',
        component: Fav
    },
    {
        path: '/word_favorites/:id',
        name: 'WordFavoritesDetail',
        component: WordDetailFav
    },
    {
        path: '/word_quiz',
        name: 'Quiz_word',
        component: WordQuiz
    },
    {
        path: '/grammar_favorites/:id',
        name: 'GrammarFavoritesDetail',
        component: GrammarDetailFav
    },
    {
        path: '/quiz_result',
        name: 'QuizResult',
        component: QuizResult
    },
    {
        path: '/chat_memory',
        name: 'ChatMemory',
        component: Aimemory
    },
    {
        path: '/study_hiragana',
        name: 'StudyHiragana',
        component: JpnChobo
    },
    {
        path: '/study_katakana',
        name: 'StudyKatakana',
        component: JpnChobo
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
