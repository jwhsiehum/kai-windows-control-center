/**
 * Connection Status Component
 * Displays WebSocket connection state with colored indicator and reconnect button
 */

import { useState, useEffect } from 'react'
import { RefreshCw, Wifi, WifiOff, Loader2 } from 'lucide-react'
import { ConnectionState } from '../types/gateway'
import { websocketManager } from '../services/websocket'

interface ConnectionStatusProps {
  wsUrl?: string
  showDetails?: boolean
}

export function ConnectionStatus({ wsUrl = 'ws://localhost:8080', showDetails = true }: ConnectionStatusProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED)
  const [isReconnecting, setIsReconnecting] = useState(false)

  useEffect(() => {
    // Configure and connect
    websocketManager.configure({
      wsUrl: wsUrl.includes('token=') ? wsUrl : `${wsUrl}/?token=067f0b409365bb02e384b5cece4c64ac67356d6751464edb`,
      authToken: '067f0b409365bb02e384b5cece4c64ac67356d6751464edb',
    })
    
    websocketManager.connect()

    // Subscribe to connection state changes
    const unsubscribe = websocketManager.onConnectionStateChange((state) => {
      setConnectionState(state)
      setIsReconnecting(state === ConnectionState.RECONNECTING || state === ConnectionState.CONNECTING)
    })

    return () => {
      unsubscribe()
    }
  }, [wsUrl])

  const handleReconnect = () => {
    websocketManager.connect()
  }

  const handleDisconnect = () => {
    websocketManager.disconnect()
  }

  // Determine status color and label
  const getStatusConfig = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return {
          color: 'bg-green-500',
          text: 'Connected',
          textColor: 'text-green-400',
        }
      case ConnectionState.CONNECTING:
      case ConnectionState.RECONNECTING:
        return {
          color: 'bg-yellow-500',
          text: connectionState === ConnectionState.RECONNECTING ? 'Reconnecting...' : 'Connecting...',
          textColor: 'text-yellow-400',
        }
      case ConnectionState.ERROR:
        return {
          color: 'bg-red-500',
          text: 'Error',
          textColor: 'text-red-400',
        }
      case ConnectionState.DISCONNECTED:
      default:
        return {
          color: 'bg-red-500',
          text: 'Disconnected',
          textColor: 'text-red-400',
        }
    }
  }

  const statusConfig = getStatusConfig()
  const isConnected = connectionState === ConnectionState.CONNECTED
  const isTransitioning = connectionState === ConnectionState.CONNECTING || 
                         connectionState === ConnectionState.RECONNECTING

  return (
    <div className="flex items-center gap-3">
      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <div className={`relative flex items-center justify-center`}>
          {/* Animated ring for connecting/reconnecting */}
          {(isTransitioning || isReconnecting) && (
            <RefreshCw 
              className={`absolute ${statusConfig.color} animate-spin`} 
              size={20}
            />
          )}
          <div className={`w-3 h-3 rounded-full ${statusConfig.color} ${isTransitioning ? 'opacity-50' : ''}`} />
        </div>
        
        {showDetails && (
          <span className={`text-sm font-medium ${statusConfig.textColor}`}>
            {statusConfig.text}
          </span>
        )}
      </div>

      {/* Connection Status Icon */}
      {isConnected && (
        <Wifi className="text-green-500" size={16} />
      )}
      {(connectionState === ConnectionState.DISCONNECTED || connectionState === ConnectionState.ERROR) && (
        <WifiOff className="text-red-500" size={16} />
      )}

      {/* Reconnect/Disconnect Button */}
      {!isConnected && !isTransitioning && (
        <button
          onClick={handleReconnect}
          className="ml-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-md transition-colors flex items-center gap-1"
        >
          <RefreshCw size={12} />
          Reconnect
        </button>
      )}

      {isConnected && (
        <button
          onClick={handleDisconnect}
          className="ml-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-md transition-colors"
        >
          Disconnect
        </button>
      )}
    </div>
  )
}

export default ConnectionStatus