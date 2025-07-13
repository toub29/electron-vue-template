import {createApp} from 'vue'
import './style.css';
import App from './App.vue'
import router from "./router/router";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

const app = createApp(App);
pinia.use(piniaPluginPersistedstate)

app.use(router)
    .use(pinia)
    .mount('#app');
