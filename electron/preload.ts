import { contextBridge, ipcRenderer } from 'electron'

// Expose gateway config to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  getGatewayConfig: () => ipcRenderer.invoke('get-gateway-config'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
})
