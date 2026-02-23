import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageCircle, Wifi, WifiOff, Loader2 } from 'lucide-react'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import { websocketManager } from '../services/websocket'
import { ConnectionState } from '../types/gateway'

interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.DISCONNECTED
  )
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsUrlRef = useRef<string | null>(null)
  const authTokenRef = useRef<string | null>(null)

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Initialize WebSocket connection
  useEffect(() => {
    const initWebSocket = async () => {
      let wsUrl = 'ws://localhost:8080'
      let authToken = ''

      // Get config from Electron API if available
      if (window.electronAPI) {
        try {
          const config = await window.electronAPI.getGatewayConfig()
          wsUrl = config.wsUrl
          authToken = config.authToken
        } catch (err) {
          console.error('Failed to get gateway config:', err)
        }
      }

      wsUrlRef.current = wsUrl
      authTokenRef.current = authToken

      // Configure and connect
      websocketManager.configure({ wsUrl, authToken })
      websocketManager.connect()
    }

    initWebSocket()

    // Subscribe to connection state changes
    const unsubscribeState = websocketManager.onConnectionStateChange((state) => {
      setConnectionState(state)
      setIsConnected(state === ConnectionState.CONNECTED)
      
      if (state === ConnectionState.ERROR) {
        setError('Connection failed. Will retry automatically...')
      } else if (state === ConnectionState.CONNECTED) {
        setError(null)
      } else if (state === ConnectionState.RECONNECTING) {
        setError('Reconnecting...')
      } else if (state === ConnectionState.DISCONNECTED) {
        setError('Disconnected. Will retry automatically...')
      }
    })

    // Subscribe to messages
    const unsubscribeMessage = websocketManager.onMessage((message) => {
      console.log('[Chat] Received message:', message)
      
      // Handle response type messages
      if (message.type === 'response' && message.payload) {
        const payload = message.payload as { content?: string }
        if (payload.content) {
          const assistantMessage: Message = {
            id: Date.now().toString(),
            content: payload.content,
            sender: 'assistant',
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
        }
        setIsSending(false)
      }
      
      // Handle pong/heartbeat responses - ignore
      if (message.type === 'pong') {
        // Connection is alive
      }
    })

    // Subscribe to errors
    const unsubscribeError = websocketManager.onError((err) => {
      console.error('[Chat] WebSocket error:', err)
      setError('Connection error. Will retry automatically.')
    })

    return () => {
      unsubscribeState()
      unsubscribeMessage()
      unsubscribeError()
    }
  }, [])

  const handleSendMessage = (content: string) => {
    if (!isConnected) {
      setError('Not connected to Gateway. Please wait...')
      return
    }

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsSending(true)

    // Send via WebSocket in Gateway format
    const sent = websocketManager.sendMessage({
      type: 'message',
      payload: {
        content,
        channel: 'dashboard',
      },
      timestamp: Date.now(),
    })

    if (!sent) {
      setError('Failed to send message. Connection may be down.')
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="text-blue-500" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-white">Chat</h1>
              <p className="text-slate-400 text-sm">Chat with your AI assistant</p>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-2 text-green-400">
                <Wifi size={18} />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-400">
                <WifiOff size={18} />
                <span className="text-sm">Disconnected</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mt-3 p-3 bg-red-900/30 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="text-slate-600 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-white mb-2">
              Start a conversation
            </h2>
            <p className="text-slate-400 max-w-md">
              Send a message to chat with your AI assistant through the Gateway.
              Make sure the Gateway is running and connected.
            </p>
            {connectionState === ConnectionState.CONNECTING && (
              <div className="flex items-center gap-2 mt-4 text-blue-400">
                <Loader2 className="animate-spin" size={18} />
                <span>Connecting to Gateway...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))}
            
            {/* Loading indicator */}
            {isSending && (
              <div className="flex justify-start mb-4">
                <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={!isConnected || isSending}
      />
    </div>
  )
}

export default Chat
