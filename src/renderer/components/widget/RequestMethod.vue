<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useRequestsStore} from "../../store/requests";
import {computed} from "vue";
import {AxiosRequestConfig} from "axios";

const {requests: tabs} = storeToRefs(useRequestsStore())
const {activeTabId} = storeToRefs(useRequestsStore())

const activeTab = computed(() => {
  if (activeTabId.value === null) return null;
  return tabs.value.find(tab => tab.id === activeTabId.value) || null;
});

const sendRequest = async () => {
  // On s'assure qu'un onglet est actif
  if (!activeTab.value) return;

  // On modifie directement les propriétés de l'onglet actif
  activeTab.value.loading = true;
  activeTab.value.error = null;
  activeTab.value.response = null;

  const headers: Record<string, string> = {};
  headers['Content-Type'] = activeTab.value.contentType;

  // On tente de parser le JSON pour vérifier sa validité avant l'envoi
  let requestData: any;
  try {
    requestData = JSON.parse(activeTab.value.requestBody);
  } catch (e) {
    activeTab.value.error = "Le corps de la requête n'est pas un JSON valide.";
    activeTab.value.loading = false;
    return;
  }

  const options: AxiosRequestConfig = {
    method: activeTab.value.method,
    url: activeTab.value.url,
    headers: headers,
    data: requestData,
  };

  try {
    const result = await window.electronAPI.sendRequest(options);
    if (activeTab.value) { // Vérifier si l'onglet existe toujours
      activeTab.value.response = result;
    }
  } catch (err: any) {
    if (activeTab.value) {
      activeTab.value.error = err.message || 'Une erreur inconnue est survenue.';
    }
  } finally {
    if (activeTab.value) {
      activeTab.value.loading = false;
    }
  }
};

</script>

<template>
  <div v-if="activeTab" class="request-panel">
    <select v-model="activeTab.method" class="method-select">
      <option>GET</option>
      <option>POST</option>
      <option>DELETE</option>
    </select>
    <input type="text" v-model="activeTab.url" placeholder="Enter URL" class="url-input"/>
    <button @click="sendRequest" :disabled="activeTab.loading">
      {{ activeTab.loading ? 'Sending...' : 'Send' }}
    </button>
  </div>
</template>

<style scoped>

.request-panel {
  display: flex;
  gap: 10px;
}
.method-select {
  font-weight: bold;
}

.url-input {
  flex-grow: 1;
  font-size: 1rem;
}
</style>