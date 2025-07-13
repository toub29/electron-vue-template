<script setup lang="ts">
import RequestTabs from "./widget/RequestTabs.vue";
import {useRequestsStore} from "../store/requests";
import {storeToRefs} from "pinia";
import ResponsePanel from "./widget/ResponsePanel.vue";
import RequestHeader from "./widget/RequestHeader.vue";
import RequestMethod from "./widget/RequestMethod.vue";

const {theme} = storeToRefs(useRequestsStore());

</script>

<template>
  <div class="api-navigator" :class="`${theme}-theme`">
    <!-- Barre d'onglets -->
    <request-tabs/>
    <!-- Contenu principal (affiché seulement si un onglet est actif) -->
    <div class="main-content">
      <request-method/>
      <request-header/>
      <response-panel/>
    </div>

  </div>
</template>

<style scoped>
/* Les définitions de variables ont été supprimées car elles sont maintenant globales */

.api-navigator {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.main-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: var(--bg-primary);
  flex-grow: 1;
  overflow-y: auto;
}

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