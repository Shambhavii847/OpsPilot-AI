
import { useEffect, useState } from 'react'
import {
  ShieldCheck, RefreshCw, Clock,
  Activity, FileCheck2
} from 'lucide-react'
import { getAuditLogs } from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

const cardStyle = "bg-white border border-[#C8D8E4] rounded-2xl shadow-sm"

export default function AuditLogPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const loadLogs = () => {
    setLoading(true)
    getAuditLogs()
      .then(data => setLogs(Array.isArray(data) ? data : data?.logs || []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadLogs()
  }, [])

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-5 md:p-8 space-y-7">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#52AB98] font-semibold">
            TRANSPARENCY & ACCOUNTABILITY
          </p>
          <h1 className="text-3xl font-serif text-[#2B6777] mt-2">
            Audit Log
          </h1>
          <p className="text-sm text-[#71858B] mt-1">
            Track AI decisions, approvals and operational activities.
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          aria-label="Refresh audit logs"
          className="p-3 rounded-xl bg-white border border-[#C8D8E4] text-[#2B6777] hover:bg-[#EAF1F3] transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Summary */}
      <div className={`${cardStyle} p-5 flex items-center gap-4`}>
        <div className="w-12 h-12 rounded-xl bg-[#E0F1EC] text-[#278A78] flex items-center justify-center">
          <ShieldCheck size={23} />
        </div>
        <div>
          <p className="text-sm text-[#71858B]">
            Recorded activities
          </p>
          <p className="text-2xl font-semibold text-[#2B6777]">
            {logs.length}
          </p>
        </div>
      </div>

      {/* Activity history */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={19} className="text-[#52AB98]" />
          <h2 className="font-semibold text-[#2B6777]">
            Activity History
          </h2>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading audit history..." />
        ) : logs.length === 0 ? (
          <div className={`${cardStyle} p-10 text-center`}>
            <div className="w-14 h-14 rounded-2xl bg-[#E0F1EC] text-[#278A78] flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={27} />
            </div>
            <h2 className="font-semibold text-[#2B6777]">
              No audit records available yet
            </h2>
            <p className="text-sm text-[#8AAAB5] mt-2">
              Actions and decisions will appear here once recorded by OpsPilot AI.
            </p>
          </div>
        ) : (
          <div className={`${cardStyle} overflow-hidden`}>
            <div className="flex items-center gap-2 p-5 border-b border-[#EAF0F2]">
              <FileCheck2 size={18} className="text-[#52AB98]" />
              <h3 className="font-semibold text-[#2B6777]">
                Recorded Events
              </h3>
              <span className="ml-auto text-xs text-[#8AAAB5]">
                {logs.length} records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#EAF1F3] text-[#61777D]">
                  <tr>
                    <th className="p-4 font-semibold">Time</th>
                    <th className="p-4 font-semibold">Action</th>
                    <th className="p-4 font-semibold">Details</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log, i) => (
                    <tr
                      key={log.id || i}
                      className="border-t border-[#EAF0F2] text-[#355D68] hover:bg-[#F8FAFA] transition-colors"
                    >
                      <td className="p-4 whitespace-nowrap">
                        <span className="flex items-center gap-2 text-[#71858B] text-xs">
                          <Clock size={14} className="text-[#52AB98]" />
                          {log.timestamp || log.created_at
                            ? new Date(log.timestamp || log.created_at).toLocaleString()
                            : '—'}
                        </span>
                      </td>

                      <td className="p-4 font-medium">
                        {log.action || log.action_type || 'Activity'}
                      </td>

                      <td className="p-4 min-w-[200px] text-[#71858B]">
                        {log.description || log.details || '—'}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E0F1EC] text-[#278A78]">
                          {log.status || 'Recorded'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
