export default function LoadingSpinner({ text = '' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  )
}
