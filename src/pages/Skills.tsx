import { Sparkles, Plus, Play, Pause, Trash2, Power } from 'lucide-react'

function Skills() {
  const skills = [
    { id: 1, name: 'Web Research', description: 'Search and fetch web content', status: 'active' },
    { id: 2, name: 'Image Analysis', description: 'Analyze images with AI models', status: 'active' },
    { id: 3, name: 'Voice Synthesis', description: 'Text to speech conversion', status: 'inactive' },
    { id: 4, name: 'Code Execution', description: 'Run code in sandboxed environment', status: 'active' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="text-yellow-500" />
            Skills
          </h1>
          <p className="text-slate-400 mt-2">Manage and configure your AI skills</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Add Skill
        </button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{skill.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  skill.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {skill.status}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                {skill.status === 'active' ? (
                  <>
                    <Pause size={18} />
                    Disable
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Enable
                  </>
                )}
              </button>
              <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Skill Store Banner */}
      <div className="mt-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-800/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Explore More Skills</h3>
            <p className="text-slate-400 text-sm mt-1">Browse the skill store for additional capabilities</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Browse Store
          </button>
        </div>
      </div>
    </div>
  )
}

export default Skills
