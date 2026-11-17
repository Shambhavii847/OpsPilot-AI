
import { useEffect, useState } from 'react'
import {
  Lightbulb, CheckCircle, XCircle, RefreshCw,
  Clock, Sparkles
} from 'lucide-react'
import {
  getRecommendations,
  approveRecommendation,
  rejectRecommendation,
  executeRecommendation
} from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

const cardStyle = "bg-white border border-[#C8D8E4] rounded-2xl p-5 shadow-sm"

export default function RecommendationsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadRecommendations = () => {
    setLoading(true)
    getRecommendations()
      .then(data => setItems(
        Array.isArray(data) ? data : data?.recommendations || []
      ))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadRecommendations()
  }, [])

  const handleAction = async (id, action) => {
  setMessage('')
  try {
    if (action === 'approve') {
      await approveRecommendation(id)
    } else if (action === 'execute') {
      await executeRecommendation(id)
    } else {
      await rejectRecommendation(id, 'Rejected by human reviewer')
    }

    setMessage(`Recommendation ${action}d successfully.`)
    loadRecommendations()
  } catch {
    setMessage(
      'Could not update recommendation. Please check that the backend is running.'
    )
  }
}

  const pendingCount = items.filter(
    item => (item.status || 'pending').toLowerCase() === 'pending'
  ).length

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-5 md:p-8 space-y-7">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#52AB98] font-semibold">
            HUMAN REVIEW CENTRE
          </p>
          <h1 className="text-3xl font-serif text-[#2B6777] mt-2">
            AI Recommendations
          </h1>
          <p className="text-sm text-[#71858B] mt-1">
            Review suggested business actions before approval.
          </p>
        </div>

        <button
          onClick={loadRecommendations}
          disabled={loading}
          aria-label="Refresh recommendations"
          className="p-3 rounded-xl bg-white border border-[#C8D8E4] text-[#2B6777] hover:bg-[#EAF1F3] transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Summary */}
      <div className={cardStyle}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E0F1EC] text-[#278A78] flex items-center justify-center">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-sm text-[#71858B]">
              Awaiting human approval
            </p>
            <p className="text-2xl font-semibold text-[#2B6777]">
              {pendingCount}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {message && (
        <div className="bg-[#EAF1F3] border border-[#C8D8E4] rounded-xl p-4 text-sm text-[#2B6777]">
          {message}
        </div>
      )}

      {/* Recommendations */}
      {loading ? (
        <LoadingSpinner text="Loading recommendations..." />
      ) : items.length === 0 ? (
        <div className={`${cardStyle} text-center py-12`}>
          <div className="w-14 h-14 rounded-2xl bg-[#E0F1EC] text-[#278A78] flex items-center justify-center mx-auto mb-4">
            <Lightbulb size={27} />
          </div>
          <h2 className="font-semibold text-[#2B6777]">
            No recommendations available yet
          </h2>
          <p className="text-sm text-[#8AAAB5] mt-2">
            Run AI Operations analysis to generate business recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => {
            const status = (item.status || 'pending').toLowerCase()
            const isPending = status === 'pending'

            return (
              <div
                key={item.id || i}
                className={cardStyle}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-[#EAF1F3] text-[#2B6777] flex items-center justify-center">
                      <Sparkles size={19} />
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-semibold text-[#2B6777]">
                        {item.title || item.recommendation || 'Business recommendation'}
                      </h2>
                      <p className="text-sm text-[#71858B] mt-2 leading-relaxed">
                        {item.description || item.reason || ''}
                      </p>
                    </div>
                  </div>

                  <span className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium ${
                    isPending
                      ? 'bg-[#FFF3D9] text-[#9A6B16]'
                      : status === 'approved'
                        ? 'bg-[#E0F1EC] text-[#278A78]'
                        : 'bg-[#F2E8E8] text-[#A45B5B]'
                  }`}>
                    {item.status || item.priority || 'Pending'}
                  </span>
                </div>

                {item.estimated_impact && (
                  <div className="mt-4 bg-[#F2F7F6] rounded-xl p-3">
                    <p className="text-xs text-[#71858B]">
                      Estimated impact
                    </p>
                    <p className="text-sm font-medium text-[#278A78] mt-1">
                      {item.estimated_impact}
                    </p>
                  </div>
                )}

                {isPending && (
  <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-[#EAF0F2]">
    <button
      onClick={() => handleAction(item.id, 'approve')}
      className="flex items-center gap-2 px-4 py-2.5 bg-[#52AB98] hover:bg-[#438F80] rounded-xl text-white text-sm font-medium transition"
    >
      <CheckCircle size={17} />
      Approve
    </button>

    <button
      onClick={() => handleAction(item.id, 'reject')}
      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D9BFC0] hover:bg-[#F9EEEE] rounded-xl text-[#A45B5B] text-sm font-medium transition"
    >
      <XCircle size={17} />
      Reject
    </button>
  </div>
)}

{item.status === 'approved' && (
  <div className="mt-5 pt-4 border-t border-[#EAF0F2]">
    <button
      onClick={() => handleAction(item.id, 'execute')}
      className="flex items-center gap-2 px-4 py-2.5 bg-[#2B6777] hover:bg-[#205361] rounded-xl text-white text-sm font-medium transition"
    >
      <CheckCircle size={17} />
      Execute Action
    </button>
  </div>
)}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
