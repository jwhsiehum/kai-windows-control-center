import { useState, useEffect } from 'react'
import { Activity, Cpu, Wifi, WifiOff, Clock, Zap } from 'lucide-react'

interface GatewayStatus {
  wsUrl: string
  authToken: string
}

function Dashboard() {
  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatus | null>(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      if (window.electronAPI) {
        const config = await window.electronAPI.getGatewayConfig()
        setGatewayStatus(config)
      }
      setLoading(false)
    }
    loadConfig()
  }, [])

  const stats = [
    { label: 'Gateway Status', value: connected ? 'Connected' : 'Disconnected', icon: connected ? Wifi : WifiOff, color: connected ? 'text-green-400' : 'text-red-400' },
    { label: 'Active Sessions', value: '1', icon: Activity, color: 'text-blue-400' },
    { label: 'CPU Usage', value: '12%', icon: Cpu, color: 'text-yellow-400' },
    { label: 'Uptime', value: '2h 34m', icon: Clock, color: 'text-purple-400' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-2">Overview of your Kai Windows Control Center</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
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
