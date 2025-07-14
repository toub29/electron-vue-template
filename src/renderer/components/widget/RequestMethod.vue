<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useRequestsStore} from "../../store/requests";
import {computed} from "vue";
import {AxiosRequestConfig} from "axios";
import {methodsWithBody, verbs} from "../../utils/Util";

// const {requests: tabs} = storeToRefs(useRequestsStore())
const {activeTabId} = storeToRefs(useRequestsStore())

const requestsStore = useRequestsStore();
// On récupère directement le getter `activeTab`
const { activeTab } = storeToRefs(requestsStore);

const sendRequest = async () => {
  // On s'assure qu'un onglet est actif
  if (!activeTab.value) return;

  // On modifie directement les propriétés de l'onglet actif
  activeTab.value.loading = true;
  activeTab.value.error = null;
  activeTab.value.response = null;

  const headers: Record<string, string> = {};
  headers['Content-Type'] = activeTab.value.contentType;

  const hasBody = methodsWithBody.includes(activeTab.value.method)

  // On tente de parser le JSON pour vérifier sa validité avant l'envoi
  const options: AxiosRequestConfig = {
    method: activeTab.value.method,
    url: activeTab.value.url,
    headers: {},
  };

  // 3. Ne traiter le corps et le Content-Type que si nécessaire
  if (hasBody) {
    options.headers!['Content-Type'] = activeTab.value.contentType;
    try {
      // On ne parse que si le corps n'est pas vide
      if (activeTab.value.requestBody && activeTab.value.requestBody.trim() !== '') {
        options.data = JSON.parse(activeTab.value.requestBody);
      }
    } catch (e) {
      activeTab.value.error = "Le corps de la requête n'est pas un JSON valide.";
      activeTab.value.loading = false;
      return;
    }
  }

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
      <option v-for="method in verbs" :value="method">{{ method }}</option>
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