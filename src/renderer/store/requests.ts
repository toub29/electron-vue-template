// Dans src/renderer/store/requests.ts
import {defineStore} from 'pinia';
import {CollectionState, TabState} from '../typings/navigator';

export const useRequestsStore = defineStore('requests', {
    state: () => ({
        collections: [] as CollectionState[],
        activeTabId: null as number | null,
        nextTabId: 1,
        isLoading: false,
        initializationError: null as string | null,
    }),

    getters: {
        // Un getter pour retrouver facilement l'onglet actif
        activeTab(state): TabState | null {
            if (state.activeTabId === null) return null;
            for (const collection of state.collections) {
                const found = collection.requests.find(req => req.id === state.activeTabId);
                if (found) return found;
            }
            return null;
        },
        // Un getter pour avoir toutes les requêtes à plat si besoin
        allRequests(state): TabState[] {
            return state.collections.flatMap(c => c.requests);
        }
    },

    actions: {
        selectRequest(id: number) {
            this.activeTabId = id;
        },

        createNewRequest(collectionId: string) {
            const collection = this.collections.find(c => c.id === collectionId);
            if (!collection) return;

            const newTab: TabState = {
                id: this.nextTabId,
                name: `Requête ${this.nextTabId}`,
                url: '',
                method: 'GET',
                requestBody: '',
                contentType: '',
                response: null,
                loading: false,
                error: null
            };
            collection.requests.unshift(newTab);
            this.activeTabId = newTab.id;
            this.nextTabId++;
        },

        deleteRequest(collectionId: string, requestId: number) {
            const collection = this.collections.find(c => c.id === collectionId);
            if (!collection) {
                return; // On sort de la fonction si elle n'existe pas.
            }
            const requestIndex = collection.requests.findIndex(t => t.id === requestId);
            // si on supprime l'onglet actuel, on ne se positionne pas sur un autre
            if (this.activeTabId === requestId) {
                this.activeTabId = null;
            }
            collection?.requests.splice(requestIndex, 1);

        },
        updateCollectionName(collectionId: string, newName: string) {
            const collection = this.collections.find(c => c.id === collectionId);
            if (collection && newName.trim() !== '') {
                collection.name = newName.trim();
            }
        },
        async initializeStore() {
            // La logique doit maintenant charger des collections
            // Exemple avec des données en dur :
            this.isLoading = true;
            try {
                // Simuler un chargement
                await new Promise(res => setTimeout(res, 500));
                this.collections = [
                    {
                        id: 'collection-1',
                        name: 'API démo',
                        requests: [
                            {
                                id: 1,
                                name: 'Get Posts',
                                method: 'GET',
                                url: 'https://jsonplaceholder.typicode.com/posts', /* ... */
                            } as TabState,
                            {
                                id: 2,
                                name: 'Create Post',
                                method: 'POST',
                                url: 'https://jsonplaceholder.typicode.com/posts', /* ... */
                            } as TabState,
                        ]
                    },
                    {
                        id: 'collection-2',
                        name: 'API démo 2',
                        requests: [
                            {
                                id: 3,
                                name: 'API locale',
                                method: 'GET',
                                url: 'http://localhost:3000/api', /* ... */
                            } as TabState,
                        ]
                    }
                ];
                this.nextTabId = 4; // Mettre à jour l'ID suivant
                if (this.collections.length > 0 && this.collections[0].requests.length > 0) {
                    this.activeTabId = this.collections[0].requests[0].id;
                }
                this.isLoading = false;
            } catch (e: any) {
                this.initializationError = "Erreur lors du chargement des collections.";
                this.isLoading = false;
            }
        },

        async saveCollections() {
            // Logique pour sauvegarder la structure `this.collections`
            console.log("Sauvegarde des collections...", this.collections);
        }
    },
});
    