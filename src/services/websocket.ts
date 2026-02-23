/**
 * WebSocket Connection Manager
 * Handles connection to OpenClaw Gateway with auto-reconnect and event emission
 */

import {
  ConnectionState,
  ConnectionStateListener,
  MessageListener,
  ErrorListener,
  WebSocketMessage,
} from '../types/gateway'

// Configuration
const RECONNECT_BASE_DELAY = 1000 // 1 second
const RECONNECT_MAX_DELAY = 30000 // 30 seconds
const RECONNECT_MULTIPLIER = 2
const PING_INTERVAL = 10000 // 10 seconds

class WebSocketManager {
  private ws: WebSocket | null = null
  private config: { wsUrl: string; authToken: string } | null = null
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED
  private reconnectAttempts = 0
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  private pingInterval: ReturnType<typeof setInterval> | null = null
  
  // Event listeners
  private connectionStateListeners: Set<ConnectionStateListener> = new Set()
  private messageListeners: Set<MessageListener> = new Set()
  private errorListeners: Set<ErrorListener> = new Set()

  constructor() {
    console.log('[WebSocket] Manager initialized')
  }

  /**
   * Configure the WebSocket connection
   */
  configure(config: { wsUrl: string; authToken: string }): void {
    this.config = config
    console.log('[WebSocket] Configured with URL:', config.wsUrl)
  }

  /**
   * Connect to the Gateway
   */
  connect(): void {
    if (!this.config) {
      console.error('[WebSocket] Cannot connect: not configured')
      this.setConnectionState(ConnectionState.ERROR)
      return
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Already connected')
      return
    }

    this.setConnectionState(ConnectionState.CONNECTING)
    console.log('[WebSocket] Connecting to', this.config.wsUrl)

    try {
      // Include auth token in URL query param
      const wsUrlWithToken = `${this.config.wsUrl}?token=${this.config.authToken}`
      this.ws = new WebSocket(wsUrlWithToken)

      this.ws.onopen = () => {
        console.log('[WebSocket] Connected successfully')
        this.reconnectAttempts = 0
        this.setConnectionState(ConnectionState.CONNECTED)
        
        // Start ping interval
        this.startPingInterval()
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          console.log('[WebSocket] Received message:', message.type)
          
          // Emit to all message listeners
          this.messageListeners.forEach((listener) => {
            try {
              listener(message)
            } catch (err) {
              console.error('[WebSocket] Message listener error:', err)
            }
          })
        } catch (err) {
          console.error('[WebSocket] Failed to parse message:', err)
        }
      }

      this.ws.onerror = (event) => {
        console.error('[WebSocket] Error:', event)
        this.setConnectionState(ConnectionState.ERROR)
        
        // Emit error to listeners
        const error = new Error('WebSocket connection error')
        this.errorListeners.forEach((listener) => {
          try {
            listener(error)
          } catch (err) {
            console.error('[WebSocket] Error listener error:', err)
          }
        })
      }

      this.ws.onclose = (event) => {
        console.log('[WebSocket] Closed:', event.code, event.reason)
        this.stopPingInterval()
        
        if (this.connectionState !== ConnectionState.ERROR) {
          this.setConnectionState(ConnectionState.DISCONNECTED)
          this.scheduleReconnect()
        }
      }
    } catch (err) {
      console.error('[WebSocket] Failed to create connection:', err)
      this.setConnectionState(ConnectionState.ERROR)
    }
  }

  /**
   * Disconnect from the Gateway
   */
  disconnect(): void {
    console.log('[WebSocket] Disconnecting...')
    
    this.stopReconnect()
    this.stopPingInterval()
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    
    this.setConnectionState(ConnectionState.DISCONNECTED)
    this.reconnectAttempts = 0
  }

  /**
   * Send a message through the WebSocket
   */
  sendMessage(message: WebSocketMessage): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Cannot send message: not connected')
      return false
    }

    try {
      console.log('[WebSocket] Sending message:', message.type, message)
      this.ws.send(JSON.stringify(message))
      return true
    } catch (err) {
      console.error('[WebSocket] Failed to send message:', err)
      return false
    }
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connectionState === ConnectionState.CONNECTED
  }

  // Event Listeners

  /**
   * Subscribe to connection state changes
   */
  onConnectionStateChange(listener: ConnectionStateListener): () => void {
    this.connectionStateListeners.add(listener)
    // Immediately call with current state
    listener(this.connectionState)
    return () => this.connectionStateListeners.delete(listener)
  }

  /**
   * Subscribe to messages
   */
  onMessage(listener: MessageListener): () => void {
    this.messageListeners.add(listener)
    return () => this.messageListeners.delete(listener)
  }

  /**
   * Subscribe to errors
   */
  onError(listener: ErrorListener): () => void {
    this.errorListeners.add(listener)
    return () => this.errorListeners.delete(listener)
  }

  // Private methods

  private setConnectionState(state: ConnectionState): void {
    this.connectionState = state
    console.log('[WebSocket] State changed:', state)
    
    this.connectionStateListeners.forEach((listener) => {
      try {
        listener(state)
      } catch (err) {
        console.error('[WebSocket] State listener error:', err)
      }
    })
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      return // Already scheduled
    }

    const delay = Math.min(
      RECONNECT_BASE_DELAY * Math.pow(RECONNECT_MULTIPLIER, this.reconnectAttempts),
      RECONNECT_MAX_DELAY
    )

    console.log(`[WebSocket] Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`)
    this.setConnectionState(ConnectionState.RECONNECTING)

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null
      this.reconnectAttempts++
      console.log('[WebSocket] Attempting reconnect...')
      this.connect()
    }, delay)
  }

  private stopReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
  }

  private startPingInterval(): void {
    this.stopPingInterval()
    
    this.pingInterval = setInterval(() => {
      if (this.isConnected()) {
        this.sendMessage({ type: 'ping', timestamp: Date.now() })
      }
    }, PING_INTERVAL)
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }
}

// Export singleton instance
export const websocketManager = new WebSocketManager()
export default websocketManager