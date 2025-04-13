import { createRouter, createWebHistory } from 'vue-router';
import Login from '../view/Login.vue';
import Chat from '../view/Chat.vue';
import Fav from "@/components/Fav/Fav.vue";
import WordQuiz from "@/view/quiz/WordQuiz.vue";

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
        path: '/word_quiz',
        name: 'Quiz_word',
        component: WordQuiz
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
