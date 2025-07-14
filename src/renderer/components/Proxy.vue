<script setup lang="ts">
// Le script reste identique, il est déjà parfait.
import {computed, onMounted, reactive, ref} from 'vue';

const formState = reactive({
  enabled: false,
  address: '',
  port: '',
});

const initialConfig = reactive({
  enabled: false,
  address: '',
  port: '',
});

const savedStatus = ref('');

onMounted(async () => {
  const config = await window.electronAPI.getProxy();
  formState.enabled = config.enabled;
  formState.address = config.address;
  formState.port = config.port;
  initialConfig.enabled = config.enabled;
  initialConfig.address = config.address;
  initialConfig.port = config.port;
});

const hasChanges = computed(() => {
  return formState.enabled !== initialConfig.enabled ||
      formState.address !== initialConfig.address ||
      formState.port !== initialConfig.port;
});

const saveSettings = async () => {
  await window.electronAPI.setProxy({...formState});
  initialConfig.enabled = formState.enabled;
  initialConfig.address = formState.address;
  initialConfig.port = formState.port;
  savedStatus.value = 'Paramètres enregistrés avec succès !';
  setTimeout(() => savedStatus.value = '', 3000);
};

const resetChanges = () => {
  formState.enabled = initialConfig.enabled;
  formState.address = initialConfig.address;
  formState.port = initialConfig.port;
};
</script>

<template>
  <div class="proxy-page">
    <h3>Configuration du Proxy</h3>

    <div class="form-group toggle-group">
      <label for="proxy-enabled">Activer le proxy</label>
      <label class="toggle-switch">
        <input type="checkbox" id="proxy-enabled" v-model="formState.enabled"/>
        <span class="slider"></span>
      </label>
    </div>

    <div class="form-group">
      <label for="proxy-address">Adresse du serveur</label>
      <input
          type="text"
          id="proxy-address"
          v-model="formState.address"
          :disabled="!formState.enabled"
          placeholder="ex: 127.0.0.1"
      />
    </div>

    <div class="form-group">
      <label for="proxy-port">Port</label>
      <input
          type="text"
          id="proxy-port"
          v-model="formState.port"
          :disabled="!formState.enabled"
          placeholder="ex: 8080"
      />
    </div>

    <p class="saved-status">{{ savedStatus }}</p>

    <div class="form-actions">
      <button class="btn btn-secondary" @click="resetChanges" :disabled="!hasChanges">
        Annuler
      </button>
      <button class="btn btn-primary" @click="saveSettings" :disabled="!hasChanges">
        Enregistrer
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ... autres styles ... */

.proxy-page {
  display: flex;
  flex-direction: column;
  padding: 25px 30px;
  /* On supprime height: 100vh; le composant prendra sa hauteur naturelle */
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: sans-serif;
  box-sizing: border-box;
}

/* ... autres styles ... */

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  /* On supprime margin-top: auto; pour que les boutons suivent le flux normal */
  padding-top: 20px; /* On garde un peu d'espace au-dessus */
}

h3 {
  margin-top: 0;
  margin-bottom: 25px;
  padding-bottom: 15px; /* Espace sous le texte */
  text-align: left; /* On aligne à gauche */
  color: var(--text-primary); /* Couleur de texte standard */
  font-weight: 600;
  border-bottom: 1px solid var(--border-color); /* Ligne de séparation */
}

.form-group {
  margin-bottom: 20px;
}

.toggle-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

label {
  font-weight: 500;
  font-size: 0.95em;
  color: var(--text-secondary);
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-input);
  border-radius: 4px;
  font-size: 1em;
  background-color: var(--bg-input);
  color: var(--text-primary);
  margin-top: 5px;
  box-sizing: border-box;
}

input[type="text"]:disabled {
  background-color: var(--bg-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

/* --- Style du Toggle Switch (inchangé) --- */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-tertiary);
  transition: .4s;
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--accent-color);
}

input:checked + .slider:before {
  transform: translateX(22px);
}

/* --- Actions et Statut (inchangé) --- */
.saved-status {
  text-align: center;
  color: #48bb78;
  min-height: 1.2em;
  font-weight: bold;
  transition: opacity 0.5s;
  margin-top: 10px;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-primary {
  background-color: var(--accent-color);
  color: var(--accent-text-color);
}

.btn-primary:not(:disabled):hover {
  background-color: #005a9e;
}

.btn-secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-input);
}

.btn-secondary:not(:disabled):hover {
  background-color: var(--close-btn-hover-bg);
}
</style>