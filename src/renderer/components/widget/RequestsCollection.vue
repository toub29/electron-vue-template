<script setup lang="ts">
import {nextTick, ref} from 'vue';
import {useRequestsStore} from "../../store/requests";
import {storeToRefs} from "pinia";
import {CollectionState} from "../../typings/navigator";

const props = defineProps<{
  collection: CollectionState;
}>();

const requestsStore = useRequestsStore();
const {activeTabId} = storeToRefs(requestsStore);
const isEditingName = ref(false);
const editableName = ref('');
const inputRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(true);

const startEditing = async () => {
  isEditingName.value = true;
  editableName.value = props.collection.name;
  // - attendre le chargement de l'input
  await nextTick();
  inputRef.value?.focus();
  inputRef.value?.select();
};

const saveName = () => {
  if (!isEditingName.value) return;
  requestsStore.updateCollectionName(props.collection.id, editableName.value);
  isEditingName.value = false;
};

const cancelEdit = () => {
  isEditingName.value = false;
};

const toggleOpen = () => {
  if (isEditingName.value) return;
  isOpen.value = !isOpen.value;
};

const createNewRequestInCollection = () => {
  requestsStore.createNewRequest(props.collection.id);
};

const selectRequest = (id: number) => {
  requestsStore.selectRequest(id);
};

const deleteRequest = (requestId: number) => {
  requestsStore.deleteRequest(props.collection.id, requestId);
};

const getMethodClass = (method: string) => {
  return `method-${method.toLowerCase()}`;
};
</script>

<template>
  <div class="collection-item">
    <div class="collection-header">
      <div class="collection-title" @click="toggleOpen">
        <span class="arrow" :class="{ 'is-open': isOpen }">▶</span>

        <input
            v-if="isEditingName"
            ref="inputRef"
            v-model="editableName"
            type="text"
            class="collection-name-input"
            @blur="saveName"
            @keyup.enter="saveName"
            @keyup.escape="cancelEdit"
            @click.stop
        />
        <span v-else class="collection-name" @dblclick.stop="startEditing" title="Double-cliquez pour renommer">
          {{ collection.name }}
        </span>
      </div>

      <!-- Actions de la collection -->
      <div class="collection-actions">
        <button
            v-if="!isEditingName"
            class="action-btn edit-btn"
            @click.stop="startEditing"
            title="Renommer la collection"
        >
          ✏️
        </button>
        <button class="action-btn add-request-btn" @click.stop="createNewRequestInCollection" title="Nouvelle requête">
          +
        </button>
      </div>
    </div>
    <ul v-if="isOpen" class="request-list">
      <li
          v-for="request in collection.requests"
          :key="request.id"
          class="request-item"
          :class="{ active: request.id === activeTabId }"
          @click="selectRequest(request.id)"
      >
        <div class="request-info">
          <span class="method-tag" :class="getMethodClass(request.method)">{{ request.method }}</span>
          <span class="request-name">{{ request.name }}</span>
        </div>
        <button class="delete-btn" @click.stop="deleteRequest(request.id)">×</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.collection-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 10px 15px;
  font-weight: bold;
  user-select: none;
  background-color: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);
  position: relative;
}

.collection-header:first-child {
  border-top: none;
}

.collection-title {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
}

.collection-name {
  margin-left: 8px;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 2px 4px;
  border-radius: 3px;
}

.collection-name-input {
  margin-left: 8px;
  padding: 2px 4px;
  border: 1px solid var(--accent-color);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: inherit;
  font-weight: inherit;
  border-radius: 3px;
  outline: none;
  width: 100%;
}

.arrow {
  transition: transform 0.2s ease-in-out;
  font-size: 0.8em;
  flex-shrink: 0;
}

.arrow.is-open {
  transform: rotate(90deg);
}

.collection-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
}

.action-btn {
  background: none;
  border: 1px solid transparent;
  color: var(--text-secondary);
  width: 24px;
  height: 24px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

.action-btn:hover {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  opacity: 1;
}

.add-request-btn {
  font-size: 20px;
}

.request-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.request-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px 10px 30px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
}

.request-item:last-child {
  border-bottom: 1px solid var(--border-color);
}

.request-item:hover {
  background-color: var(--bg-tertiary);
}

.request-item.active {
  background-color: var(--accent-color);
  color: var(--accent-text-color);
}

.request-item.active .method-tag,
.request-item.active .request-name,
.request-item.active .delete-btn {
  color: var(--accent-text-color);
}

.request-item.active .method-tag {
  background-color: rgba(255, 255, 255, 0.2);
}

.request-info {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.method-tag {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  flex-shrink: 0;
}

.request-name {
  font-size: 0.9rem;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
  visibility: hidden;
}

.request-item:hover .delete-btn,
.request-item.active .delete-btn {
  visibility: visible;
}

.delete-btn:hover {
  background-color: var(--close-btn-hover-bg);
}
</style>