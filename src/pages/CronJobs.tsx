import { Clock, Plus, Play, Pause, Trash2, Edit2 } from 'lucide-react'

function CronJobs() {
  const jobs = [
    { id: 1, name: 'Daily Backup', schedule: '0 2 * * *', description: 'Backup important files', status: 'active', lastRun: '2026-02-23 02:00' },
    { id: 2, name: 'Health Check', schedule: '*/15 * * * *', description: 'Check system health every 15 minutes', status: 'active', lastRun: '2026-02-23 09:45' },
    { id: 3, name: 'Cleanup Logs', schedule: '0 3 * * 0', description: 'Clean old log files weekly', status: 'inactive', lastRun: '2026-02-16 03:00' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Clock className="text-orange-500" />
            Cron Jobs
          </h1>
          <p className="text-slate-400 mt-2">Schedule automated tasks</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          New Job
        </button>
      </div>

      {/* Jobs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-4 text-slate-400 font-medium">Name</th>
              <th className="text-left p-4 text-slate-400 font-medium">Schedule</th>
              <th className="text-left p-4 text-slate-400 font-medium">Description</th>
              <th className="text-left p-4 text-slate-400 font-medium">Status</th>
              <th className="text-left p-4 text-slate-400 font-medium">Last Run</th>
              <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                  <span className="text-white font-medium">{job.name}</span>
                </td>
                <td className="p-4">
                  <code className="bg-slate-800 px-3 py-1 rounded text-green-400 text-sm">
                    {job.schedule}
                  </code>
                </td>
                <td className="p-4 text-slate-400">{job.description}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="p-4 text-slate-400 text-sm">{job.lastRun}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CronJobs
