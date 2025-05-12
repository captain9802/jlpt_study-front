import { createRouter, createWebHistory } from 'vue-router';
import Login from '../view/Login.vue';
import Chat from '../view/Chat.vue';
import Fav from "@/components/fav/Fav.vue";
import WordQuiz from "@/view/quiz/WordQuiz.vue";
import WordDetailFav from "@/components/fav/WordDetailFav.vue";
import QuizWordResult from "@/components/result/QuizWordResult.vue";
import Aimemory from "@/components/ai/Aimemory.vue";
import JpnChobo from "@/components/study/JpnChobo.vue";
import GrammarDetailFav from "@/components/fav/GrammarDetailFav.vue";
import SentenceDetailFav from "@/components/fav/SentenceDetailFav.vue";
import GrammarQuiz from "@/view/quiz/GrammarQuiz.vue";
import QuizGrammarResult from "@/components/result/QuizGrammarResult.vue";
import SentenceQuiz from "@/view/quiz/SentenceQuiz.vue";
import QuizSentenceResult from "@/components/result/QuizSentenceResult.vue";
import JlptList from "@/components/JlptList.vue";
import JlptWord from "@/components/JlptWord.vue";

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
        path: '/grammar_quiz',
        name: 'Quiz_grammar',
        component: GrammarQuiz
    },
    {
        path: '/sentence_quiz',
        name: 'Quiz_sentence',
        component: SentenceQuiz
    },
    {
        path: '/grammar_favorites/:id',
        name: 'GrammarFavoritesDetail',
        component: GrammarDetailFav
    },
    {
        path: '/sentence_favorites/:id',
        name: 'SentenceFavoritesDetail',
        component: SentenceDetailFav
    },
    {
        path: '/word-quiz_result',
        name: 'WordQuizResult',
        component: QuizWordResult
    },
    {
        path: '/Grammar-quiz_result',
        name: 'GrammarQuizResult',
        component: QuizGrammarResult
    },
    {
        path: '/Sentence-quiz_result',
        name: 'SentenceQuizResult',
        component: QuizSentenceResult
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
    },
    {
        path: '/jlpt_list',
        name: 'JlptList',
        component: JlptList
    },
    {
        path: '/jlpt_words/:level',
        name: 'JlptWord',
        component: JlptWord
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
