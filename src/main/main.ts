import {app, BrowserWindow, ipcMain, Menu, session} from 'electron';
import {join} from 'path';
import axios, {AxiosRequestConfig} from "axios";
import MenuHandler, {menu as menuTemplate} from "./menu/menu"
import {clickProxy} from "./menu/proxyAction";

const clickHandler: MenuHandler[] = []

// Gardez une référence à la fenêtre principale pour pouvoir l'utiliser comme parent
let mainWindow: BrowserWindow | null;
let proxyConfig: { enabled: boolean, address: string, port: string } = {
    enabled: false,
    address: '127.0.0.1',
    port: '8080',
}

function createWindow() {
    mainWindow = new BrowserWindow({ // Assigner à la variable globale
        width: 1200, // Un peu plus large pour une meilleure expérience
        height: 800,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    if (process.env.NODE_ENV === 'development') {
        const rendererPort = process.argv[2];
        mainWindow.loadURL(`http://localhost:${rendererPort}`);
    } else {
        mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
    }
}

app.whenReady().then(async () => {
    createWindow();
    clickHandler.push({name: 'proxy', handler: clickProxy(mainWindow)})

    const menu = Menu.buildFromTemplate(menuTemplate(clickHandler));
    Menu.setApplicationMenu(menu);
    if (proxyConfig.enabled) {
        const proxyRules = `${proxyConfig.address}:${proxyConfig.port}`;
        await session.defaultSession.setProxy({
            proxyRules: proxyRules,
            proxyBypassRules: 'localhost, 127.0.0.1'
        });
        console.log(`Proxy chargé depuis la configuration : ${proxyRules}`);
    }

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ['script-src \'self\'']
            }
        })
    })

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});


// Appliquer la configuration du proxy
ipcMain.handle('proxy:set', async (event, config: { enabled: boolean, address: string, port: string }) => {
    proxyConfig = config;
    console.log('proxy:set', event, config);
    if (config.enabled && config.address && config.port) {
        const proxyRules = `${config.address}:${config.port}`;
        await session.defaultSession.setProxy({
            proxyRules: proxyRules,
            proxyBypassRules: 'localhost, 127.0.0.1' // Ne pas utiliser le proxy pour les adresses locales
        });
        console.log(`Proxy activé : ${proxyRules}`);
    } else {
        await session.defaultSession.setProxy({mode: 'direct'});
        console.log('Proxy désactivé.');
    }
    return true;
});

// Récupérer la configuration actuelle du proxy
ipcMain.handle('proxy:get', () => {
    return proxyConfig
});

ipcMain.on('message', (event, message) => {
    console.log(message);
})

ipcMain.handle('http:request', async (event, options: AxiosRequestConfig) => {
    // Créer une copie pour ne pas modifier l'original
    const requestOptions: AxiosRequestConfig = {...options};
    if (proxyConfig.enabled && proxyConfig.address && proxyConfig.port) {
        console.log(`Utilisation du proxy pour la requête : ${proxyConfig.address}:${proxyConfig.port}`);
        requestOptions.proxy = {
            host: proxyConfig.address,
            port: parseInt(proxyConfig.port, 10),
        };
    }
    try {
        const response = await axios(requestOptions);
        return {
            status: response.status,
            headers: response.headers,
            data: response.data,
        };
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data,
            };
        }
        console.error('Erreur réseau ou de configuration Axios:', error.message);
        throw error;
    }
});