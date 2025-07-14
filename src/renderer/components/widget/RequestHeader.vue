<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useRequestsStore} from "../../store/requests";
import {methodsWithBody} from "../../utils/Util";

const requestsStore = useRequestsStore();
// On récupère directement le getter `activeTab`
const { activeTab } = storeToRefs(requestsStore);
</script>

<template>
  <!-- Panneau du corps de la requête -->
  <div v-if="activeTab && methodsWithBody.includes(activeTab.method)" class="body-panel">
    <div class="content-type-selector">
      <label for="content-type">Content-Type:</label>
      <select id="content-type" v-model="activeTab.contentType">
        <option>application/json; charset=UTF-8</option>
        <option>application/x-www-form-urlencoded</option>
        <option>text/plain</option>
      </select>
    </div>
    <textarea placeholder="Request body" v-model="activeTab.requestBody"/>
  </div>
</template>

<style scoped>

.body-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.body-panel textarea {
  min-height: 150px;
  font-family: monospace;
  padding: 10px;
  border: 1px solid var(--border-input);
  border-radius: 4px;
  background-color: var(--bg-code);
  color: var(--text-primary);
}
</style>