import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Brain,
  Sparkles,
  Clock,
  Calendar,
  Heart,
  Kanban,
  Settings,
  X,
  Menu
} from 'lucide-react'

// Pages
import Dashboard from './pages/Dashboard'
import Memory from './pages/Memory'
import Skills from './pages/Skills'
import CronJobs from './pages/CronJobs'
import Schedule from './pages/Schedule'
import Heartbeats from './pages/Heartbeats'
import KanbanPage from './pages/Kanban'

// Components
import ConnectionStatus from './components/ConnectionStatus'

// Types
declare global {
  interface Window {
    electronAPI?: {
      getGatewayConfig: () => Promise<{ wsUrl: string; authToken: string }>
      getAppVersion: () => Promise<string>
    }
  }
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/memory', icon: Brain, label: 'Memory' },
  { path: '/skills', icon: Sparkles, label: 'Skills' },
  { path: '/cron-jobs', icon: Clock, label: 'Cron Jobs' },
  { path: '/schedule', icon: Calendar, label: 'Schedule' },
  { path: '/heartbeats', icon: Heart, label: 'Heartbeats' },
  { path: '/kanban', icon: Kanban, label: 'Kanban' },
]

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [appVersion, setAppVersion] = useState('1.0.0')

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getAppVersion().then(setAppVersion)
    }
  }, [])

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-950 overflow-hidden">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } lg:w-64 bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col overflow-hidden`}
        >
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings className="text-blue-500" />
              Kai Control
            </h1>
            <p className="text-xs text-slate-500 mt-1">Windows Control Center</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Connection Status */}
          <div className="p-4 border-t border-slate-800">
            <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">
              Connection
            </p>
            <ConnectionStatus compact showLabel />
          </div>

          {/* Version */}
          <div className="p-4 border-t border-slate-800">
            <p className="text-xs text-slate-600">Version {appVersion}</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-slate-950">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/memory" element={<Memory />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/cron-jobs" element={<CronJobs />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/heartbeats" element={<Heartbeats />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}

export default App
