
import { useState, useEffect } from 'react'
import {
  Bot, BarChart3, Package, AlertTriangle, GitBranch,
  Lightbulb, CheckCircle, FileText, Play, Zap,
  Activity, Sparkles
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getAgentStatus, runAgentAnalysis } from '../services/api.js'

const AGENTS = [
  {
    id: 'analytics',
    name: 'Business Analytics',
    icon: BarChart3,
    responsibilities: [
      'Analyzes revenue trends and patterns',
      'Identifies top-performing products',
      'Generates financial performance reports',
    ]
  },
  {
    id: 'inventory',
    name: 'Inventory Management',
    icon: Package,
    responsibilities: [
      'Monitors stock levels in real-time',
      'Flags low-stock and out-of-stock items',
      'Calculates optimal reorder quantities',
    ]
  },
  {
    id: 'anomaly',
    name: 'Anomaly Detection',
    icon: AlertTriangle,
    responsibilities: [
      'Detects unusual sales patterns',
      'Spots inventory discrepancies',
      'Alerts on sudden demand spikes/drops',
    ]
  },
  {
    id: 'workflow',
    name: 'Workflow Planning',
    icon: GitBranch,
    responsibilities: [
      'Creates actionable workflow plans',
      'Prioritizes operational tasks',
      'Coordinates multi-step processes',
    ]
  },
  {
    id: 'recommendation',
    name: 'Recommendation',
    icon: Lightbulb,
    responsibilities: [
      'Generates business recommendations',
      'Estimates financial impact of actions',
      'Ranks recommendations by priority',
    ]
  },
  {
    id: 'action',
    name: 'Action Execution',
    icon: CheckCircle,
    responsibilities: [
      'Executes approved recommendations',
      'Updates inventory and orders',
      'Tracks action completion status',
    ]
  },
  {
    id: 'audit',
    name: 'Verification & Audit',
    icon: FileText,
    responsibilities: [
      'Logs all system actions',
      'Verifies execution outcomes',
      'Maintains compliance audit trail',
    ]
  },
]

const severityColor = {
  critical: 'text-[#A45B5B] bg-[#F9EEEE] border-[#E8CCCC]',
  high: 'text-[#A45B5B] bg-[#F9EEEE] border-[#E8CCCC]',
  medium: 'text-[#9A6B16] bg-[#FFF3D9] border-[#F0DEB8]',
  low: 'text-[#2B6777] bg-[#EAF1F3] border-[#C8D8E4]',
}

const agentColors = {
  analytics: 'bg-[#EAF1F3] text-[#2B6777]',
  inventory: 'bg-[#E0F1EC] text-[#278A78]',
  anomaly: 'bg-[#F9EEEE] text-[#A45B5B]',
  workflow: 'bg-[#EAF1F3] text-[#2B6777]',
  recommendation: 'bg-[#FFF3D9] text-[#9A6B16]',
  action: 'bg-[#E0F1EC] text-[#278A78]',
  audit: 'bg-[#EAF1F3] text-[#2B6777]',
}

const cardStyle = "bg-white border border-[#C8D8E4] rounded-2xl p-5 shadow-sm"

export default function AIOperationsPage() {
  const [agentStatuses, setAgentStatuses] = useState({})
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAgentStatus()
      .then(data => setAgentStatuses(data || {}))
      .catch(() => {})
  }, [])

  const handleRunAnalysis = async () => {
    setRunning(true)
    setResults(null)
    setError(null)

    const runningMap = {}
    AGENTS.forEach(agent => {
      runningMap[agent.id] = { status: 'running' }
    })
    setAgentStatuses(runningMap)

    try {
      const data = await runAgentAnalysis()
      setResults(data)

      const doneMap = {}
      AGENTS.forEach(agent => {
        doneMap[agent.id] = {
          status: 'completed',
          last_run: new Date().toISOString()
        }
      })
      setAgentStatuses(doneMap)
    } catch {
      setError('Analysis failed. Make sure the backend is running.')

      const idleMap = {}
      AGENTS.forEach(agent => {
        idleMap[agent.id] = { status: 'idle' }
      })
      setAgentStatuses(idleMap)
    } finally {
      setRunning(false)
    }
  }

  const completedCount = AGENTS.filter(
    agent => agentStatuses[agent.id]?.status === 'completed'
  ).length

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-5 md:p-8 space-y-7">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#52AB98] font-semibold">
            INTELLIGENT OPERATIONS CENTRE
          </p>
          <h1 className="text-3xl font-serif text-[#2B6777] mt-2">
            AI Operations
          </h1>
          <p className="text-sm text-[#71858B] mt-1">
            Seven specialized agents working together to streamline business operations.
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={running}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2B6777] hover:bg-[#245967] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition shadow-sm"
        >
          {running ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play size={17} />
              Run Operations Analysis
            </>
          )}
        </button>
      </div>

      {/* Overview banner */}
      <div className="bg-[#2B6777] rounded-2xl p-6 md:p-7 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#B9E3D8] text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={15} />
            Multi-Agent Intelligence
          </div>

          <h2 className="text-xl md:text-2xl font-serif mt-3">
            From business insights to intelligent action.
          </h2>

          <p className="text-sm text-white/75 mt-2 max-w-xl leading-relaxed">
            OpsPilot coordinates analytics, inventory monitoring, anomaly detection,
            recommendations and verification through one connected operations system.
          </p>
        </div>

        <div className="absolute -right-8 -bottom-16 w-52 h-52 rounded-full border border-white/10" />
        <div className="absolute -right-2 -bottom-10 w-36 h-36 rounded-full border border-white/10" />
      </div>

      {/* Agent summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className={cardStyle}>
          <div className="w-10 h-10 rounded-xl bg-[#EAF1F3] text-[#2B6777] flex items-center justify-center">
            <Bot size={20} />
          </div>
          <p className="text-sm text-[#71858B] mt-4">Specialized agents</p>
          <p className="text-2xl font-semibold text-[#2B6777] mt-1">7</p>
        </div>

        <div className={cardStyle}>
          <div className="w-10 h-10 rounded-xl bg-[#E0F1EC] text-[#278A78] flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <p className="text-sm text-[#71858B] mt-4">Completed agents</p>
          <p className="text-2xl font-semibold text-[#278A78] mt-1">
            {completedCount}
          </p>
        </div>

        <div className={cardStyle}>
          <div className="w-10 h-10 rounded-xl bg-[#FFF3D9] text-[#9A6B16] flex items-center justify-center">
            <Activity size={20} />
          </div>
          <p className="text-sm text-[#71858B] mt-4">System status</p>
          <p className="text-lg font-semibold text-[#2B6777] mt-2">
            {running ? 'Analyzing' : completedCount === 7 ? 'Analysis complete' : 'Ready'}
          </p>
        </div>
      </div>

      {/* Agent cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-[#2B6777]">
              Specialized AI Agents
            </h2>
            <p className="text-xs text-[#8AAAB5] mt-1">
              Responsibilities and current execution status
            </p>
          </div>
          <span className="text-xs text-[#278A78] bg-[#E0F1EC] px-3 py-1.5 rounded-full font-medium">
            {AGENTS.length} Agents
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {AGENTS.map(agent => {
            const status = agentStatuses[agent.id] || {}
            const Icon = agent.icon

            return (
              <div
                key={agent.id}
                className={`${cardStyle} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${agentColors[agent.id]}`}>
                    <Icon size={21} />
                  </div>
                  <StatusBadge status={status.status || 'idle'} />
                </div>

                <h3 className="font-semibold text-[#2B6777]">
                  {agent.name}
                </h3>

                <p className="text-xs uppercase tracking-wider text-[#8AAAB5] mt-3 mb-2">
                  Responsibilities
                </p>

                <ul className="space-y-2">
                  {agent.responsibilities.map((responsibility, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-[#71858B] leading-relaxed"
                    >
                      <Zap size={13} className="mt-0.5 text-[#52AB98] shrink-0" />
                      {responsibility}
                    </li>
                  ))}
                </ul>

                {status.last_run && (
                  <p className="text-xs text-[#8AAAB5] mt-4 pt-3 border-t border-[#EAF0F2]">
                    Last run: {new Date(status.last_run).toLocaleString()}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="p-4 bg-[#F9EEEE] border border-[#E8CCCC] rounded-xl text-[#A45B5B] text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {running && (
        <div className={`${cardStyle} p-8 text-center`}>
          <LoadingSpinner text="Running multi-agent analysis... This may take a moment." />
        </div>
      )}

      {/* Results */}
      {results && !running && (
        <section className={`${cardStyle} space-y-5`}>
          <div className="flex items-center gap-3 pb-4 border-b border-[#EAF0F2]">
            <div className="w-10 h-10 rounded-xl bg-[#E0F1EC] text-[#278A78] flex items-center justify-center">
              <Bot size={21} />
            </div>
            <div>
              <h2 className="font-semibold text-[#2B6777]">
                Analysis Results
              </h2>
              <p className="text-xs text-[#8AAAB5] mt-1">
                Latest operations analysis summary
              </p>
            </div>
          </div>

          {/* Summary metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: 'Issues Detected',
                value: results.issues_detected ?? results.total_issues ?? '—',
                color: 'text-[#A45B5B]',
                background: 'bg-[#F9EEEE]'
              },
              {
                label: 'Recommendations',
                value: results.recommendations_generated ?? results.total_recommendations ?? '—',
                color: 'text-[#9A6B16]',
                background: 'bg-[#FFF3D9]'
              },
              {
                label: 'Anomalies Found',
                value: results.anomalies_found ?? results.total_anomalies ?? '—',
                color: 'text-[#2B6777]',
                background: 'bg-[#EAF1F3]'
              },
            ].map(item => (
              <div
                key={item.label}
                className={`${item.background} rounded-xl p-4 text-center`}
              >
                <p className={`text-2xl font-semibold ${item.color}`}>
                  {item.value}
                </p>
                <p className="text-xs text-[#71858B] mt-1">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Issues */}
          {(results.issues || []).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[#2B6777] mb-3">
                Detected Issues
              </h3>

              <div className="space-y-2">
                {results.issues.map((issue, i) => {
                  const severity = (
                    issue.severity || issue.priority || 'medium'
                  ).toLowerCase()

                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-xl border ${
                        severityColor[severity] || severityColor.medium
                      }`}
                    >
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          {severity}
                        </span>
                        <p className="text-sm mt-1">
                          {issue.description || issue.message || issue}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {results.message && (
            <p className="text-sm text-[#71858B] italic border-t border-[#EAF0F2] pt-4">
              {results.message}
            </p>
          )}

          {(results.issues || []).length === 0 && !results.message && (
            <p className="text-sm text-[#8AAAB5]">
              Analysis completed. See the summary above and check Recommendations for generated actions.
            </p>
          )}
        </section>
      )}
    </div>
  )
}
