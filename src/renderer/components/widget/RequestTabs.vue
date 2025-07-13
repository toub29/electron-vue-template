<script setup lang="ts">
import {TabState} from "../../typings/navigator";
import {onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import {useRequestsStore} from "../../store/requests";

const requestsStore = useRequestsStore();
const {requests: tabs, theme, activeTabId, nextTabId} = storeToRefs(requestsStore)


onMounted(() => {
  if (tabs.value.length === 0) {
    addTab();
  }
});

const selectTab = (tabId: number) => {
 activeTabId.value = tabId;
};

const closeTab = (tabIdToClose: number) => {
  const tabIndex = tabs.value.findIndex(t => t.id === tabIdToClose);
  if (tabIndex === -1) return;
  // Si l'onglet à fermer est l'onglet actif, on choisit un nouveau successeur
  if (activeTabId.value === tabIdToClose) {
    // S'il reste plus d'un onglet
    if (tabs.value.length > 1) {
      // On essaie de sélectionner l'onglet suivant, sinon le précédent.
      // C'est une façon élégante de gérer le cas du premier et du dernier onglet.
      const newActiveTab = tabs.value[tabIndex + 1] || tabs.value[tabIndex - 1];
      activeTabId.value = newActiveTab.id;
    } else {
      // C'était le dernier onglet, il n'y a plus d'onglet actif pour le moment.
      activeTabId.value = null;
    }
  }
  // On peut maintenant supprimer l'onglet en toute sécurité
  tabs.value.splice(tabIndex, 1);
  // Si la liste est vide, on en crée un nouveau.
  // La fonction addTab s'occupera de le rendre actif.
  if (tabs.value.length === 0) {
    addTab();
  }
};

const addTab = () => {
  const newTab: TabState = {
    id: nextTabId.value,
    name: `Requête ${nextTabId.value}`,
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'GET',
    requestBody: '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}',
    contentType: 'application/json; charset=UTF-8',
    response: null,
    loading: false,
    error: null,
  };
  tabs.value.push(newTab);
  activeTabId.value = newTab.id;
  nextTabId.value++
};

// Fonction pour basculer entre les thèmes
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};

</script>

<template>
  <div class="tab-bar">
    <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: tab.id === activeTabId }"
        @click="selectTab(tab.id)"
    >
      <span class="tab-name">{{ tab.name }}</span>
      <button class="close-tab-btn" @click.stop="closeTab(tab.id)">×</button>
    </div>
    <button class="add-tab-btn" @click="addTab">+</button>
    <button class="theme-toggle-btn" @click="toggleTheme">
      {{theme === 'dark' ? '☀️' : '🌙'}}
    </button>
  </div>
</template>

<style scoped>

.tab-bar {
  display: flex;
  align-items: center;
  background-color: var(--bg-secondary);
  padding: 5px 5px 0 5px;
  flex-shrink: 0;
}

.tab-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: pointer;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  margin-right: 2px;
  position: relative;
  bottom: -1px;
}

.tab-item.active {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-bottom: 1px solid var(--bg-primary);
}

.tab-name {
  margin-right: 8px;
  white-space: nowrap;
}

.close-tab-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 50%;
  width: 18px;
  height: 18px;

  /* Remplacement pour un centrage parfait et robuste */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0; /* On s'assure qu'il n'y a pas de padding par défaut */
  font-size: 16px; /* On peut définir une taille explicite pour la croix */
  line-height: 1; /* Bonne pratique avec flexbox pour éviter les interférences */
}

.close-tab-btn:hover {
  background-color: var(--close-btn-hover-bg);
  color: var(--text-primary);
}

.add-tab-btn, .theme-toggle-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 10px;
}

.add-tab-btn:hover, .theme-toggle-btn:hover {
  color: var(--text-primary);
}

.theme-toggle-btn {
  margin-left: auto; /* Pousse le bouton tout à droite */
  font-size: 1.2rem;
}

</style>