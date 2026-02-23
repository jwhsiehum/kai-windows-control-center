import { Heart, Activity, Plus, Pause, Play, Eye, EyeOff } from 'lucide-react'

function Heartbeats() {
  const heartbeats = [
    { id: 1, name: 'Email Check', interval: '30 min', lastCheck: '2 min ago', status: 'active', enabled: true },
    { id: 2, name: 'Calendar Sync', interval: '15 min', lastCheck: '5 min ago', status: 'active', enabled: true },
    { id: 3, name: 'Weather Update', interval: '1 hour', lastCheck: '23 min ago', status: 'active', enabled: true },
    { id: 4, name: 'Notifications', interval: '5 min', lastCheck: '1 min ago', status: 'active', enabled: false },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Heart className="text-red-500" />
            Heartbeats
          </h1>
          <p className="text-slate-400 mt-2">Periodic background checks and monitoring</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Add Heartbeat
        </button>
      </div>

      {/* Heartbeat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {heartbeats.map((heartbeat) => (
          <div
            key={heartbeat.id}
            className={`bg-slate-900 border rounded-xl p-6 ${
              heartbeat.enabled ? 'border-slate-800' : 'border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${heartbeat.enabled ? 'bg-red-500/20' : 'bg-slate-800'}`}>
                  <Activity className={heartbeat.enabled ? 'text-red-400' : 'text-slate-500'} size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{heartbeat.name}</h3>
                  <p className="text-slate-400 text-sm">Every {heartbeat.interval}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  heartbeat.enabled
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {heartbeat.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-slate-500 text-sm">Last check: {heartbeat.lastCheck}</span>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  {heartbeat.enabled ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  {heartbeat.enabled ? <Pause size={18} /> : <Play size={18} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Overview */}
      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Heartbeat Status</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">3</p>
            <p className="text-slate-400 text-sm mt-1">Active</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-400">1</p>
            <p className="text-slate-400 text-sm mt-1">Paused</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">4</p>
            <p className="text-slate-400 text-sm mt-1">Total</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Heartbeats
