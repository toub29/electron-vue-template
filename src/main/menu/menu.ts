import {BrowserWindow, MenuItemConstructorOptions} from "electron";

export default interface MenuHandler {
    name: string,
    handler: () => void
}

export const menu = (clickHandler: MenuHandler[]): MenuItemConstructorOptions[] => [
    {
        label: 'Fichier',
        submenu: [
            {
                label: 'Quitter',
                accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
                role: 'quit' // Utilise le comportement natif pour quitter
            }
        ]
    },
    {
        label: 'Éditer',
        submenu: [
            {label: 'Annuler', role: 'undo'},
            {label: 'Rétablir', role: 'redo'},
            {type: 'separator'},
            {label: 'Couper', role: 'cut'},
            {label: 'Copier', role: 'copy'},
            {label: 'Coller', role: 'paste'},
        ]
    },
    {
        label: 'Vue',
        submenu: [
            {label: 'Recharger', role: 'reload'},
            {label: 'Forcer le rechargement', role: 'forceReload'},
            {type: 'separator'},
            {label: 'Outils de développement', role: 'toggleDevTools'}
        ]
    },
    // 2. Notre nouveau menu "Proxy"
    {
        label: 'Proxy',
        submenu: [
            {
                label: 'Configurer le Proxy...',
                click: clickHandler.filter(item => item.name === 'proxy')[0].handler
            }
        ]
    }
];