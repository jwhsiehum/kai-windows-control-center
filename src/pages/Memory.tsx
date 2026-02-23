import { Brain, Plus, Search, Trash2, Edit2 } from 'lucide-react'

function Memory() {
  const memories = [
    { id: 1, title: 'Important Context', preview: 'Key information about user preferences and projects...', date: '2026-02-23' },
    { id: 2, title: 'Project Notes', preview: 'Details about ongoing development tasks...', date: '2026-02-22' },
    { id: 3, title: 'Learning Log', preview: 'Notes from recent research and experimentation...', date: '2026-02-21' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="text-purple-500" />
            Memory
          </h1>
          <p className="text-slate-400 mt-2">Manage your long-term memories and context</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          New Memory
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search memories..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Memory List */}
      <div className="space-y-4">
        {memories.map((memory) => (
          <div
            key={memory.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{memory.title}</h3>
                <p className="text-slate-400 text-sm">{memory.preview}</p>
                <p className="text-slate-500 text-xs mt-3">{memory.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  <Edit2 size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Memory
