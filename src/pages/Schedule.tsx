import { Calendar, Plus, Clock, Check, X } from 'lucide-react'

function Schedule() {
  const events = [
    { id: 1, title: 'Weekly Review', time: 'Mon 9:00 AM', type: 'recurring', description: 'Review weekly progress and plan ahead' },
    { id: 2, title: 'Code Commit', time: 'Ongoing', type: 'task', description: 'Complete Phase 1 development' },
    { id: 3, title: 'Team Sync', time: 'Wed 2:00 PM', type: 'meeting', description: 'Weekly team synchronization' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Calendar className="text-green-500" />
            Schedule
          </h1>
          <p className="text-slate-400 mt-2">View and manage your schedule</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Add Event
        </button>
      </div>

      {/* Calendar View - Simplified */}
      <div className="grid grid-cols-7 gap-2 mb-8">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center p-3 text-slate-400 font-medium">
            {day}
          </div>
        ))}
        {Array.from({ length: 35 }, (_, i) => {
          const dayNum = i - 3 // Start from Sunday before
          const isToday = dayNum === 23
          const isCurrentMonth = dayNum > 0 && dayNum <= 28
          
          return (
            <div
              key={i}
              className={`p-3 min-h-[80px] border rounded-lg ${
                isToday
                  ? 'bg-blue-900/30 border-blue-600'
                  : isCurrentMonth
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-slate-900/50 border-slate-800/50 opacity-50'
              }`}
            >
              <span className={`text-sm ${isToday ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>
                {dayNum > 0 && dayNum <= 28 ? dayNum : ''}
              </span>
            </div>
          )
        })}
      </div>

      {/* Upcoming Events */}
      <h2 className="text-xl font-semibold text-white mb-4">Upcoming Events</h2>
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center gap-6"
          >
            <div className="flex items-center gap-3 text-slate-400 min-w-[120px]">
              <Clock size={18} />
              <span>{event.time}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{event.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{event.description}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                event.type === 'recurring'
                  ? 'bg-purple-500/20 text-purple-400'
                  : event.type === 'meeting'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}
            >
              {event.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Schedule
