<script setup lang="ts">
import {useRequestsStore} from "../store/requests";
import {storeToRefs} from "pinia";
import ResponsePanel from "./widget/ResponsePanel.vue";
import RequestHeader from "./widget/RequestHeader.vue";
import RequestMethod from "./widget/RequestMethod.vue";
import CollectionsPanel from "./widget/CollectionsPanel.vue"; // 1. Importer le nouveau composant
import {onMounted} from "vue";

const requestsStore = useRequestsStore();
const {activeTabId} = storeToRefs(requestsStore);

// Au montage, on s'assure qu'il y a au moins une requête
onMounted(() => {
  requestsStore.initializeStore()
});

</script>

<template>
  <div class="api-navigator">
    <!-- 2. Ajouter le panneau de gauche -->
    <collections-panel/>

    <div class="main-content-area">
      <div v-if="activeTabId" class="main-content">
        <request-method/>
        <request-header/>
        <response-panel/>
      </div>
      <div v-else class="no-tab-selected">
        <p>Sélectionnez une requête ou créez-en une nouvelle.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.api-navigator {
  display: flex;
  /* La direction est maintenant en ligne */
  flex-direction: row;
  height: 100vh;
  font-family: sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.main-content-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  /* Important pour que le contenu ne déborde pas */
  overflow: hidden;
}

.main-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-grow: 1;
  /* Le scroll se fait ici maintenant */
  overflow-y: auto;
}

.no-tab-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--text-secondary);
  font-size: 1.2rem;
}

/* Les styles pour .error et pre ne changent pas */
.error {
  color: #f48771;
}

pre {
  background-color: var(--bg-code);
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
  flex-grow: 1;
}
</style>