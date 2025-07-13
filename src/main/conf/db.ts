// src/main/fileStore.ts

import { app } from 'electron';
import path from 'path';
import fs from 'fs';

// Définir le type de notre configuration pour plus de sécurité
interface ProxyConfig {
    enabled: boolean;
    address: string;
    port: string;
}

// Le chemin d'accès standard et sécurisé pour les données utilisateur
const userDataPath = app.getPath('userData');
const filePath = path.join(userDataPath, 'proxy-settings.json');

// La configuration par défaut si le fichier n'existe pas ou est corrompu
const defaultConfig: ProxyConfig = {
    enabled: false,
    address: '127.0.0.1',
    port: '8080',
};

/**
 * Charge la configuration du proxy depuis le fichier JSON.
 * Retourne la configuration par défaut en cas d'erreur ou si le fichier n'existe pas.
 */
export function loadProxySettings(): ProxyConfig {
    try {
        // On vérifie si le fichier existe
        if (!fs.existsSync(filePath)) {
            return defaultConfig;
        }
        // On lit le fichier et on parse le JSON
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Erreur lors de la lecture du fichier de configuration, utilisation des valeurs par défaut.", error);
        return defaultConfig;
    }
}

/**
 * Sauvegarde la configuration du proxy dans un fichier JSON.
 * Utilise une écriture atomique pour éviter la corruption de données.
 * @param config L'objet de configuration à sauvegarder.
 */
export function saveProxySettings(config: ProxyConfig): void {
    const tempFilePath = filePath + '.tmp';
    try {
        const fileContent = JSON.stringify(config, null, 2); // Le '2' est pour une jolie indentation
        // 1. Écrire dans un fichier temporaire
        fs.writeFileSync(tempFilePath, fileContent, 'utf-8');
        // 2. Renommer le fichier temporaire vers le fichier final (opération atomique)
        fs.renameSync(tempFilePath, filePath);
    } catch (error) {
        console.error("Erreur lors de la sauvegarde du fichier de configuration.", error);
    }
}