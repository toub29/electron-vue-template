import {defineStore} from 'pinia'
import {ref} from "vue";
import {TabState} from "../typings/navigator";

export const useRequestsStore = defineStore('requestsStore', () => {

    const requests = ref<TabState[]>([])
    const activeTabId = ref<number | null>(null);
    const theme = ref<'dark' | 'light'>('light');
    const nextTabId = ref<number>(1);

    return {theme, requests, activeTabId, nextTabId}
}, {
    persist: true
})