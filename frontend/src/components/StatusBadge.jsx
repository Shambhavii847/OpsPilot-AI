export default function StatusBadge({ status }) {
  const map = {
    // Generic
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    executed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    running: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    idle: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    in_progress: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    // Priority
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    // Stock
    'in stock': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'low stock': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'out of stock': 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  const key = (status || '').toLowerCase().replace(/_/g, ' ')
  const cls = map[key] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  const label = (status || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  )
}
