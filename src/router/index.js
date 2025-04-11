import { createRouter, createWebHistory } from 'vue-router';
import Login from '../view/Login.vue';
import Chat from '../view/Chat.vue';
import Fav from "@/components/Fav/Fav.vue";

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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
