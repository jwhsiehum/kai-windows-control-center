import { Kanban as KanbanIcon, Plus, MoreHorizontal, GripVertical } from 'lucide-react'

function KanbanPage() {
  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-500' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
    { id: 'review', title: 'Review', color: 'bg-yellow-500' },
    { id: 'done', title: 'Done', color: 'bg-green-500' },
  ]

  const tasks = {
    todo: [
      { id: 1, title: 'Design new dashboard layout', tag: 'Design' },
      { id: 2, title: 'Set up CI/CD pipeline', tag: 'DevOps' },
    ],
    'in-progress': [
      { id: 3, title: 'Implement WebSocket connection', tag: 'Backend' },
    ],
    review: [
      { id: 4, title: 'Write API documentation', tag: 'Docs' },
    ],
    done: [
      { id: 5, title: 'Initialize project', tag: 'Setup' },
      { id: 6, title: 'Create dark theme', tag: 'Design' },
    ],
  }

  const tagColors: Record<string, string> = {
    Design: 'bg-purple-500/20 text-purple-400',
    DevOps: 'bg-orange-500/20 text-orange-400',
    Backend: 'bg-blue-500/20 text-blue-400',
    Docs: 'bg-yellow-500/20 text-yellow-400',
    Setup: 'bg-green-500/20 text-green-400',
  }

  return (
    <div className="p-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <KanbanIcon className="text-cyan-500" />
            Kanban Board
          </h1>
          <p className="text-slate-400 mt-2">Manage your tasks and projects</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-220px)]">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold text-white">{column.title}</h3>
                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                  {tasks[column.id as keyof typeof tasks]?.length || 0}
                </span>
              </div>
              <button className="text-slate-400 hover:text-white">
                <Plus size={18} />
              </button>
            </div>

            {/* Column Content */}
            <div className="space-y-3">
              {tasks[column.id as keyof typeof tasks]?.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-4 cursor-pointer hover:border-slate-700 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        tagColors[task.tag] || 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {task.tag}
                    </span>
                    <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <p className="text-white mt-3 font-medium">{task.title}</p>
                  <div className="flex items-center gap-2 mt-3 text-slate-500">
                    <GripVertical size={14} className="cursor-grab" />
                  </div>
                </div>
              ))}

              {/* Add Task Button */}
              <button className="w-full p-3 border border-dashed border-slate-700 rounded-lg text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-colors flex items-center justify-center gap-2">
                <Plus size={18} />
                Add task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KanbanPage
