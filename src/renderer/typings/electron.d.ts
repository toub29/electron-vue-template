import type {AxiosRequestConfig} from "axios";

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  sendMessage: (message: string) => void,
  sendRequest: (options: AxiosRequestConfig) => Promise<any>
  setProxy: (config: { enabled: boolean, address: string, port: string }) => Promise<boolean>
  getProxy: () => Promise<{ enabled: boolean, address: string, port: string }>
}

declare global {
  interface Window {
    electronAPI: ElectronApi,
  }
}
