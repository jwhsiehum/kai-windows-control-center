/**
 * Gateway API Client
 * HTTP methods for Gateway REST endpoints
 */

import {
  ApiResponse,
  MemoryListResponse,
  MemoryFile,
  SkillsListResponse,
  Skill,
  CronJobsListResponse,
  CronJob,
  SchedulesListResponse,
  Schedule,
  HeartbeatConfig,
  HeartbeatResponse,
  GatewayInfo,
} from '../types/gateway'

// Configuration
let httpBaseUrl = 'http://localhost:8080'

class GatewayApiClient {
  /**
   * Configure the API client
   */
  configure(baseUrl: string): void {
    httpBaseUrl = baseUrl
    console.log('[GatewayApi] Configured with base URL:', baseUrl)
  }

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return httpBaseUrl
  }

  /**
   * Make an HTTP request with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${httpBaseUrl}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[GatewayApi] HTTP error:', response.status, errorText)
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
          timestamp: Date.now(),
        }
      }

      const data = await response.json()
      return {
        success: true,
        data,
        timestamp: Date.now(),
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('[GatewayApi] Request failed:', errorMessage)
      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now(),
      }
    }
  }

  // Gateway Info

  /**
   * Get Gateway information
   */
  async getGatewayInfo(): Promise<ApiResponse<GatewayInfo>> {
    return this.request<GatewayInfo>('/api/gateway/info')
  }

  // Memory Endpoints

  /**
   * Get list of memory files
   */
  async getMemoryFiles(): Promise<ApiResponse<MemoryListResponse>> {
    return this.request<MemoryListResponse>('/api/memory/files')
  }

  /**
   * Get content of a specific memory file
   */
  async getMemoryFile(path: string): Promise<ApiResponse<MemoryFile>> {
    return this.request<MemoryFile>(`/api/memory/files/${encodeURIComponent(path)}`)
  }

  /**
   * Create or update a memory file
   */
  async saveMemoryFile(path: string, content: string): Promise<ApiResponse<MemoryFile>> {
    return this.request<MemoryFile>('/api/memory/files', {
      method: 'POST',
      body: JSON.stringify({ path, content }),
    })
  }

  /**
   * Delete a memory file
   */
  async deleteMemoryFile(path: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(`/api/memory/files/${encodeURIComponent(path)}`, {
      method: 'DELETE',
    })
  }

  // Skills Endpoints

  /**
   * Get list of skills
   */
  async getSkills(): Promise<ApiResponse<SkillsListResponse>> {
    return this.request<SkillsListResponse>('/api/skills')
  }

  /**
   * Enable a skill
   */
  async enableSkill(skillId: string): Promise<ApiResponse<Skill>> {
    return this.request<Skill>(`/api/skills/${encodeURIComponent(skillId)}/enable`, {
      method: 'POST',
    })
  }

  /**
   * Disable a skill
   */
  async disableSkill(skillId: string): Promise<ApiResponse<Skill>> {
    return this.request<Skill>(`/api/skills/${encodeURIComponent(skillId)}/disable`, {
      method: 'POST',
    })
  }

  // Cron Jobs Endpoints

  /**
   * Get list of cron jobs
   */
  async getCronJobs(): Promise<ApiResponse<CronJobsListResponse>> {
    return this.request<CronJobsListResponse>('/api/cron')
  }

  /**
   * Create a new cron job
   */
  async createCronJob(job: Omit<CronJob, 'id'>): Promise<ApiResponse<CronJob>> {
    return this.request<CronJob>('/api/cron', {
      method: 'POST',
      body: JSON.stringify(job),
    })
  }

  /**
   * Update a cron job
   */
  async updateCronJob(id: string, job: Partial<CronJob>): Promise<ApiResponse<CronJob>> {
    return this.request<CronJob>(`/api/cron/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(job),
    })
  }

  /**
   * Delete a cron job
   */
  async deleteCronJob(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(`/api/cron/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  }

  /**
   * Run a cron job immediately
   */
  async runCronJob(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(`/api/cron/${encodeURIComponent(id)}/run`, {
      method: 'POST',
    })
  }

  // Schedule Endpoints

  /**
   * Get list of schedules
   */
  async getSchedules(): Promise<ApiResponse<SchedulesListResponse>> {
    return this.request<SchedulesListResponse>('/api/schedules')
  }

  /**
   * Create a new schedule
   */
  async createSchedule(schedule: Omit<Schedule, 'id'>): Promise<ApiResponse<Schedule>> {
    return this.request<Schedule>('/api/schedules', {
      method: 'POST',
      body: JSON.stringify(schedule),
    })
  }

  /**
   * Update a schedule
   */
  async updateSchedule(id: string, schedule: Partial<Schedule>): Promise<ApiResponse<Schedule>> {
    return this.request<Schedule>(`/api/schedules/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(schedule),
    })
  }

  /**
   * Delete a schedule
   */
  async deleteSchedule(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(`/api/schedules/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  }

  // Heartbeat Endpoints

  /**
   * Get heartbeat configuration
   */
  async getHeartbeatConfig(): Promise<ApiResponse<HeartbeatResponse>> {
    return this.request<HeartbeatResponse>('/api/heartbeat')
  }

  /**
   * Update heartbeat configuration
   */
  async updateHeartbeatConfig(config: Partial<HeartbeatConfig>): Promise<ApiResponse<HeartbeatResponse>> {
    return this.request<HeartbeatResponse>('/api/heartbeat', {
      method: 'PUT',
      body: JSON.stringify(config),
    })
  }

  /**
   * Test heartbeat endpoint
   */
  async testHeartbeat(): Promise<ApiResponse<{ success: boolean; latency: number }>> {
    return this.request<{ success: boolean; latency: number }>('/api/heartbeat/test', {
      method: 'POST',
    })
  }

  // Health Check

  /**
   * Check if Gateway is reachable
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${httpBaseUrl}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      })
      return response.ok
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const gatewayApi = new GatewayApiClient()
export default gatewayApi