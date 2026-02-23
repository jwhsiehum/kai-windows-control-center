import React from 'react'

interface ChatMessageProps {
  message: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

function ChatMessage({ message, sender, timestamp }: ChatMessageProps) {
  const isUser = sender === 'user'
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-slate-800 text-slate-100 rounded-bl-sm'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
        <p
          className={`text-xs mt-2 ${
            isUser ? 'text-blue-200' : 'text-slate-500'
          }`}
        >
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  )
}

export default ChatMessage
