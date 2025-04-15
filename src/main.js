import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import './style/toastify.css'

const app = createApp(App)

app.use(router)
app.use(Vue3Toastify, {
    autoClose: 2000,
    position: 'top-center',
    theme: 'light'
})

app.mount('#app')
