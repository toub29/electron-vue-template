<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useRequestsStore} from "../../store/requests";
import {computed} from "vue";

const {activeTabId} = storeToRefs(useRequestsStore())
const {requests: tabs} = storeToRefs(useRequestsStore())

// C'est la clé de la réactivité ! L'interface est toujours liée à cet objet.
const activeTab = computed(() => {
  if (activeTabId.value === null) return null;
  return tabs.value.find(tab => tab.id === activeTabId.value) || null;
});

</script>

<template>
  <div v-if="activeTab" class="response-panel">
    <h3>Response</h3>
    <div v-if="activeTab?.loading" class="placeholder">Loading...</div>
    <div v-else-if="activeTab?.error" class="placeholder error">
      <strong>Error:</strong> {{ activeTab?.error }}
    </div>
    <div v-else-if="activeTab?.response" class="response-content">
      <p>
        <strong>Status:</strong>
        <span :class="`status-${String(activeTab?.response.status)[0]}`">{{ activeTab?.response.status }}</span>
      </p>
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
}

.placeholder {
  color: var(--text-placeholder);
}

</style>