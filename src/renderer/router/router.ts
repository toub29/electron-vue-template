import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router';
import ApiNavigator from '../components/ApiNavigator.vue';
import ProxySettings from '../components/Proxy.vue';

const routes = [
    { path: '/', component: ApiNavigator },
    { path: '/proxy', component: ProxySettings },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;