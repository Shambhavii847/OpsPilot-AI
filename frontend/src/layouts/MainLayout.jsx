
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Bot, Package, BarChart3,
  Lightbulb, GitBranch, FileText, Settings,
  Zap, Cpu
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { getSettings } from '../services/api.js'

const navItems = [
  { to: '/overview', icon: LayoutDashboard, label: 'Overview' },
  { to: '/ai-operations', icon: Bot, label: 'AI Operations' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/recommendations', icon: Lightbulb, label: 'Recommendations' },
  { to: '/workflows', icon: GitBranch, label: 'Workflows' },
  { to: '/audit-log', icon: FileText, label: 'Audit Log' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function MainLayout() {
  const [aiMode, setAiMode] = useState('Demo Mode')

  useEffect(() => {
    getSettings()
      .then(s => setAiMode(s.ai_mode === 'gemini' ? 'Gemini Mode' : 'Demo Mode'))
      .catch(() => setAiMode('Demo Mode'))
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-[#F2F2F2]">

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-[#2B6777] border-r border-[#245967]">

        {/* Logo */}
        <div className="p-6 border-b border-white/15">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#52AB98] rounded-xl flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-wide text-white">
              OpsPilot AI
            </span>
          </div>
          <p className="text-xs text-[#C8D8E4] leading-relaxed pl-13">
            From Business Insights to Intelligent Action.
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-5 px-3 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#C8D8E4]/65 px-3 mb-3">
            Workspace
          </p>

          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl mb-1 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#52AB98] text-white shadow-md'
                    : 'text-[#E4EEF0] hover:text-white hover:bg-white/10'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* AI Mode */}
        <div className="p-4 border-t border-white/15">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#245967]">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#A8E0D3]" />
            </div>
            <div>
              <p className="text-xs text-[#C8D8E4]">AI Engine</p>
              <p className={`text-xs font-semibold mt-1 ${
                aiMode === 'Gemini Mode' ? 'text-[#A8E0D3]' : 'text-white'
              }`}>
                {aiMode}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-[#C8D8E4]/60 text-center mt-4">
            OpsPilot AI · Local Workspace
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[#F2F2F2]">
        <Outlet />
      </main>
    </div>
  )
}
