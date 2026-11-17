
import { useEffect, useState } from 'react'
import {
  GitBranch, RefreshCw, Clock, CheckCircle,
  Workflow, Activity
} from 'lucide-react'
import { getWorkflows } from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

const cardStyle = "bg-white border border-[#C8D8E4] rounded-2xl p-5 shadow-sm"

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)

  const loadWorkflows = () => {
    setLoading(true)
    getWorkflows()
      .then(data => setWorkflows(
        Array.isArray(data) ? data : data?.workflows || []
      ))
      .catch(() => setWorkflows([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadWorkflows()
  }, [])

  const completedCount = workflows.filter(
    workflow => workflow.completed_at
  ).length

  const pendingCount = workflows.length - completedCount

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-5 md:p-8 space-y-7">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#52AB98] font-semibold">
            OPERATIONS CENTRE
          </p>
          <h1 className="text-3xl font-serif text-[#2B6777] mt-2">
            Workflow Management
          </h1>
          <p className="text-sm text-[#71858B] mt-1">
            Track business processes and operational tasks.
          </p>
        </div>

        <button
          onClick={loadWorkflows}
          disabled={loading}
          aria-label="Refresh workflows"
          className="p-3 rounded-xl bg-white border border-[#C8D8E4] text-[#2B6777] hover:bg-[#EAF1F3] transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Workflow summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className={cardStyle}>
          <div className="w-10 h-10 rounded-xl bg-[#EAF1F3] text-[#2B6777] flex items-center justify-center">
            <Workflow size={20} />
          </div>
          <p className="text-sm text-[#71858B] mt-4">Total workflows</p>
          <p className="text-2xl font-semibold text-[#2B6777] mt-1">
            {workflows.length}
          </p>
        </div>

        <div className={cardStyle}>
          <div className="w-10 h-10 rounded-xl bg-[#E0F1EC] text-[#278A78] flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <p className="text-sm text-[#71858B] mt-4">Completed</p>
          <p className="text-2xl font-semibold text-[#278A78] mt-1">
            {completedCount}
          </p>
        </div>

        <div className={cardStyle}>
          <div className="w-10 h-10 rounded-xl bg-[#FFF3D9] text-[#9A6B16] flex items-center justify-center">
            <Clock size={20} />
          </div>
          <p className="text-sm text-[#71858B] mt-4">Awaiting completion</p>
          <p className="text-2xl font-semibold text-[#2B6777] mt-1">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Workflow list */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={19} className="text-[#52AB98]" />
          <h2 className="font-semibold text-[#2B6777]">
            Business Workflows
          </h2>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading workflows..." />
        ) : workflows.length === 0 ? (
          <div className={`${cardStyle} text-center py-12`}>
            <div className="w-14 h-14 rounded-2xl bg-[#EAF1F3] text-[#2B6777] flex items-center justify-center mx-auto mb-4">
              <GitBranch size={27} />
            </div>
            <h2 className="font-semibold text-[#2B6777]">
              No workflows available yet
            </h2>
            <p className="text-sm text-[#8AAAB5] mt-2">
              Workflows will appear when the backend is connected.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflows.map((workflow, i) => {
              const isCompleted = Boolean(workflow.completed_at)

              return (
                <div
                  key={workflow.id || i}
                  className={`${cardStyle} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF1F3] text-[#2B6777] flex items-center justify-center">
                      <GitBranch size={20} />
                    </div>

                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                      isCompleted
                        ? 'bg-[#E0F1EC] text-[#278A78]'
                        : 'bg-[#FFF3D9] text-[#9A6B16]'
                    }`}>
                      {workflow.status || 'Pending'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-[#2B6777]">
                    {workflow.name || workflow.title || `Workflow ${i + 1}`}
                  </h3>
d
                  <p className="text-sm text-[#71858B] mt-2 leading-relaxed">
                    {workflow.description || 'Business operations workflow'}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-[#8AAAB5] mt-5 pt-4 border-t border-[#EAF0F2]">
                    {isCompleted ? (
                      <CheckCircle size={16} className="text-[#52AB98]" />
                    ) : (
                      <Clock size={16} className="text-[#B58A3A]" />
                    )}

                    {isCompleted
                      ? `Completed ${new Date(workflow.completed_at).toLocaleString()}`
                      : 'Awaiting completion'}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
