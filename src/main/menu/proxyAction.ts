import {app, BrowserWindow} from "electron";
import {join} from "path";

export const clickProxy = (mainWindow: BrowserWindow | null) => {
    return () => {
        // Action à exécuter au clic : ouvrir une nouvelle fenêtre de configuration
        console.log('Ouverture de la configuration du proxy...');
        // Ici, vous pourriez ouvrir une nouvelle BrowserWindow modale
        // pour les paramètres du proxy.
        const proxyWindow = new BrowserWindow({
            width: 450,
            height: 450,
            title: 'Configuration du Proxy',
            parent: mainWindow!,
            modal: true,
            resizable: false,
            webPreferences: {
                preload: join(__dirname, '..', 'preload.js'), // Important: réutiliser le preload
                contextIsolation: true,
            }
        });
        // Chargez un fichier HTML ou une route Vue dédiée aux paramètres
        // Charger la route /proxy
        if (process.env.NODE_ENV === 'development') {
            const rendererPort = process.argv[2];
            proxyWindow.loadURL(`http://localhost:${rendererPort}/#/proxy`); // Notez le /#/proxy pour le mode hash par défaut
        } else {
            // Pour la production, vous devrez configurer le serveur de fichiers pour gérer les routes
            proxyWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'), {hash: 'proxy'});
        }
        proxyWindow.setMenu(null); // Pas de menu pour cette petite fenêtre
    }
}
