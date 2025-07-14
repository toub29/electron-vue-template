<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRequestsStore } from "../../store/requests";
import { ref } from "vue";
import RequestsCollection from './RequestsCollection.vue';

const requestsStore = useRequestsStore();
const { collections, isLoading, initializationError } = storeToRefs(requestsStore);
const saveStatus = ref('');

const saveAllCollections = async () => {
  await requestsStore.saveCollections();
  saveStatus.value = 'Collections sauvegardées !';
  setTimeout(() => {
    saveStatus.value = '';
  }, 3000);
};
</script>

<template>
  <div class="request-list-panel">
    <div class="panel-header">
      <h4>Collections</h4>
      <div class="header-actions">
        <button class="action-btn save-btn" @click="saveAllCollections" title="Sauvegarder les collections">☁️</button>
        <!-- Le bouton "+" a été retiré d'ici -->
      </div>
    </div>

    <div class="save-status" v-if="saveStatus">{{ saveStatus }}</div>

    <div v-if="isLoading" class="panel-status">
      <p>Chargement...</p>
    </div>
    <div v-else-if="initializationError" class="panel-status error">
      <p>{{ initializationError }}</p>
    </div>
    <div v-else-if="collections.length > 0" class="collections-container">
      <requests-collection
          v-for="collection in collections"
          :key="collection.id"
          :collection="collection"
      />
    </div>
    <div v-else class="panel-status">
      <p>Aucune collection.</p>
      <p>Créez une collection pour commencer.</p>
    </div>
  </div>
</template>

<style scoped>
/* ... (les styles de ce fichier ne changent pas) ... */
.collections-container {
  overflow-y: auto;
  flex-grow: 1;
}

.request-list-panel {
  width: 280px;
  flex-shrink: 0;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.panel-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: 1px solid var(--border-input);
  color: var(--text-secondary);
  width: 28px;
  height: 28px;
  border-radius: 5px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
}

.action-btn:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.save-status {
  padding: 8px 15px;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: #e8f5e9;
  color: #2e7d32;
  flex-shrink: 0;
}

.panel-status {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  color: var(--text-secondary);
}

.panel-status p {
  margin: 2px 0;
}

.panel-status.error {
  color: #f48771;
}
</style>