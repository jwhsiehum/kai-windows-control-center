/**
 * Gateway Integration Type Definitions
 * TypeScript types for WebSocket and API communication with OpenClaw Gateway
 */

// Connection States
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

// Gateway Configuration
export interface GatewayConfig {
  wsUrl: string
  authToken: string
  httpBaseUrl: string
}

// WebSocket Message Types
export type WebSocketMessageType = 
  | 'connect'
  | 'disconnect'
  | 'error'
  | 'heartbeat'
  | 'memory_update'
  | 'skill_update'
  | 'cron_update'
  | 'schedule_update'
  | 'system_status'
  | 'pong'

export interface WebSocketMessage {
  type: WebSocketMessageType
  payload?: unknown
  timestamp?: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: number
}

// Memory Types
export interface MemoryFile {
  name: string
  path: string
  content?: string
  lastModified?: number
}

export interface MemoryListResponse {
  files: MemoryFile[]
  total: number
}

// Skills Types
export interface Skill {
  id: string
  name: string
  description?: string
  enabled: boolean
  tags?: string[]
}

export interface SkillsListResponse {
  skills: Skill[]
  total: number
}

// Cron Jobs Types
export interface CronJob {
  id: string
  name: string
  schedule: string
  command: string
  enabled: boolean
  lastRun?: number
  nextRun?: number
}

export interface CronJobsListResponse {
  jobs: CronJob[]
  total: number
}

// Schedule Types
export interface Schedule {
  id: string
  name: string
  cronExpression: string
  action: string
  enabled: boolean
}

export interface SchedulesListResponse {
  schedules: Schedule[]
  total: number
}

// Heartbeat Types
export interface HeartbeatConfig {
  enabled: boolean
  intervalMs: number
  timeoutMs: number
  maxRetries: number
  endpoints: string[]
}

export interface HeartbeatResponse {
  config: HeartbeatConfig
  lastHeartbeat?: number
  status: 'healthy' | 'unhealthy' | 'unknown'
}

// Gateway Info Types
export interface GatewayInfo {
  version: string
  name: string
  uptime: number
  connectedClients: number
}

// System Status Types
export interface SystemStatus {
  cpu: number
  memory: number
  disk: number
  network: {
    sent: number
    received: number
  }
}

// Event Listeners
export type ConnectionStateListener = (state: ConnectionState) => void
export type MessageListener = (message: WebSocketMessage) => void
export type ErrorListener = (error: Error) => void