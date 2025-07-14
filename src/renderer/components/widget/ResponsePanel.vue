<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useRequestsStore} from "../../store/requests";
import {computed} from "vue";

const requestsStore = useRequestsStore();
// On récupère directement le getter `activeTab`
const { activeTab } = storeToRefs(requestsStore);

</script>

<template>
  <div v-if="activeTab" class="response-panel">
    <h3>Response <span v-if="activeTab?.response" :class="`status-${String(activeTab?.response.status)[0]}`">{{
        activeTab?.response.status
      }}</span></h3>
    <div v-if="activeTab?.loading" class="placeholder">Loading...</div>
    <div v-else-if="activeTab?.error" class="placeholder error">
      <strong>Error:</strong> {{ activeTab?.error }}
    </div>
    <div v-else-if="activeTab?.response" class="response-content">
      <h4>Body:</h4>
      <pre><code>{{ JSON.stringify(activeTab?.response.data, null, 2) }}</code></pre>
    </div>
    <div v-else class="placeholder">
      Click "Send" to make a request.
    </div>
  </div>
</template>
<style scoped>
.response-panel {
  border: 1px solid var(--border-color);
  padding: 15px;
  border-radius: 4px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  /* Fait en sorte que ce panneau prenne la hauteur restante */
  flex-grow: 1;
  /* Empêche le contenu de déborder du panneau principal */
  overflow: hidden;
}

.placeholder {
  color: var(--text-placeholder);
  /* Centre le message placeholder */
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.response-content {
  /* Fait en sorte que cette zone prenne la hauteur restante */
  flex-grow: 1;
  /* Ajoute des barres de défilement si le contenu est trop grand */
  overflow: auto;
  /* Correction pour certains comportements de flexbox */
  min-height: 0;
}

/* Style pour le corps de la réponse pour un affichage propre */
.response-content pre {
  margin: 0; /* Supprime la marge par défaut qui peut causer des débordements */
  padding: 10px;
  background-color: var(--bg-code);
  border-radius: 4px;
  color: var(--text-primary);

  /* Gère le retour à la ligne pour le contenu long */
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Style pour les titres à l'intérieur du panneau */
.response-panel h3, .response-panel h4 {
  margin-top: 0;
  margin-bottom: 10px;
  flex-shrink: 0; /* Empêche les titres de rétrécir */
}

/* Style pour le statut de la réponse */
.response-panel h3 span {
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  margin-left: 10px;
}

/* Couleurs pour les statuts */
.status-2 {
  background-color: #e8f5e9;
  color: #2e7d32;
}

/* 2xx Success */
.status-3 {
  background-color: #fff8e1;
  color: #f57f17;
}

/* 3xx Redirection */
.status-4 {
  background-color: #ffebee;
  color: #c62828;
}

/* 4xx Client Error */
.status-5 {
  background-color: #fce4ec;
  color: #ad1457;
}

.error {
  color: #f48771;
}
</style>