import {contextBridge, ipcRenderer} from 'electron';
import {AxiosRequestConfig} from "axios";

export interface ApiResponse {
    status: number;
    headers: Record<string, any>;
    data: any;
}
// ... (imports existants)

// Interface pour la configuration du proxy
interface ProxyConfig {
    enabled: boolean;
    address: string;
    port: string;
}

contextBridge.exposeInMainWorld('electronAPI', {
    sendRequest: (options: AxiosRequestConfig): Promise<ApiResponse> => ipcRenderer.invoke('http:request', options),
    setProxy: (config: ProxyConfig): Promise<boolean> => ipcRenderer.invoke('proxy:set', config),
    getProxy: (): Promise<ProxyConfig> => ipcRenderer.invoke('proxy:get')
})
