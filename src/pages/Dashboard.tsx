import { useState, useEffect } from 'react'
import { Activity, Cpu, Wifi, WifiOff, Clock, Zap, Brain, Wrench, Timer } from 'lucide-react'
import { ConnectionStatus } from '../components/ConnectionStatus'
import { gatewayApi } from '../services/gatewayApi'
import { ConnectionState } from '../types/gateway'

interface GatewayStatus {
  wsUrl: string
  authToken: string
}

interface DashboardStats {
  memoryCount: number
  skillsCount: number
  cronJobsCount: number
}

function Dashboard() {
  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatus | null>(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    memoryCount: 0,
    skillsCount: 0,
    cronJobsCount: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  // Gateway WebSocket URL
  const WS_URL = 'ws://localhost:8080'

  useEffect(() => {
    const loadConfig = async () => {
      if (window.electronAPI) {
        const config = await window.electronAPI.getGatewayConfig()
        setGatewayStatus(config)
      }
      setLoading(false)
    }
    loadConfig()

    // Fetch stats from Gateway API
    const fetchStats = async () => {
      try {
        // Fetch all data in parallel
        const [memoryRes, skillsRes, cronRes] = await Promise.all([
          gatewayApi.getMemoryFiles(),
          gatewayApi.getSkills(),
          gatewayApi.getCronJobs(),
        ])

        setStats({
          memoryCount: memoryRes.success && memoryRes.data ? memoryRes.data.total : 0,
          skillsCount: skillsRes.success && skillsRes.data ? skillsRes.data.total : 0,
          cronJobsCount: cronRes.success && cronRes.data ? cronRes.data.total : 0,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statusItems = [
    { label: 'Gateway Status', value: connected ? 'Connected' : 'Disconnected', icon: connected ? Wifi : WifiOff, color: connected ? 'text-green-400' : 'text-red-400' },
    { label: 'Active Sessions', value: '1', icon: Activity, color: 'text-blue-400' },
    { label: 'CPU Usage', value: '12%', icon: Cpu, color: 'text-yellow-400' },
    { label: 'Uptime', value: '2h 34m', icon: Clock, color: 'text-purple-400' },
  ]

  // Placeholder data for now (can be replaced with actual API data)
  const placeholderStats = [
    { label: 'Memory Files', value: statsLoading ? '...' : stats.memoryCount.toString(), icon: Brain, color: 'text-cyan-400', description: 'Memory files in gateway' },
    { label: 'Skills', value: statsLoading ? '...' : stats.skillsCount.toString(), icon: Wrench, color: 'text-orange-400', description: 'Active skills available' },
    { label: 'Cron Jobs', value: statsLoading ? '...' : stats.cronJobsCount.toString(), icon: Timer, color: 'text-pink-400', description: 'Scheduled jobs' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-2">Overview of your Kai Windows Control Center</p>
      </div>

      {/* Connection Status Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="text-blue-500" size={20} />
            <span className="text-white font-medium">Gateway Connection</span>
          </div>
          <ConnectionStatus wsUrl={WS_URL} showDetails={true} />
        </div>
      </div>

      {/* Stats Grid - System */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statusItems.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={stat.color} size={24} />
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Stats Grid - Gateway Data */}
      <h2 className="text-xl font-semibold text-white mb-4">Gateway Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {placeholderStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={stat.color} size={24} />
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Gateway Config Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="text-blue-500" size={24} />
          <h2 className="text-xl font-semibold text-white">Gateway Configuration</h2>
        </div>
        
        {loading ? (
          <p className="text-slate-400">Loading configuration...</p>
        ) : gatewayStatus ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">WebSocket URL</span>
              <code className="bg-slate-800 px-3 py-1 rounded text-green-400 text-sm">
                {gatewayStatus.wsUrl}
              </code>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">HTTP API Base</span>
              <code className="bg-slate-800 px-3 py-1 rounded text-green-400 text-sm">
                http://localhost:8080
              </code>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Auth Token</span>
              <code className="bg-slate-800 px-3 py-1 rounded text-green-400 text-sm">
                {gatewayStatus.authToken.substring(0, 12)}...
              </code>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">Run in Electron to see gateway config</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Refresh Connection
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-slate-700">
            View Logs
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-slate-700">
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard