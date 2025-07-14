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
                role: 'quit'
            }
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