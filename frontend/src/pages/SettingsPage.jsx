
import { useEffect, useState } from 'react'
import {
  Settings, KeyRound, RefreshCw, Database,
  ShieldCheck, Monitor, Sparkles
} from 'lucide-react'
import {
  getSettings, saveGeminiKey, resetDemoData
} from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

const cardStyle = "bg-white border border-[#C8D8E4] rounded-2xl p-5 shadow-sm"

export default function SettingsPage() {
  const [settings, setSettings] = useState({})
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)

  const loadSettings = () => {
    getSettings()
      .then(data => setSettings(data || {}))
      .catch(() => setSettings({}))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSaveKey = async (e) => {
    e.preventDefault()

    if (!apiKey.trim()) {
      setMessage('Please enter an API key first.')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      await saveGeminiKey(apiKey.trim())
      setApiKey('')
      setMessage('API key saved successfully.')
      loadSettings()
    } catch {
      setMessage('Could not save the key. Please check that the backend is running.')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Reset all local demo data? This cannot be undone.')) return

    setResetting(true)
    setMessage('')

    try {
      await resetDemoData()
      setMessage('Demo data reset successfully.')
      loadSettings()
    } catch {
      setMessage('Could not reset demo data. Please check that the backend is running.')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-5 md:p-8 space-y-7">

      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#52AB98] font-semibold">
          CONFIGURATION CENTRE
        </p>
        <h1 className="text-3xl font-serif text-[#2B6777] mt-2">
          Settings
        </h1>
        <p className="text-sm text-[#71858B] mt-1">
          Configure your local OpsPilot AI environment.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading settings..." />
      ) : (
        <div className="space-y-5">

          {/* Application settings */}
          <section className={cardStyle}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#EAF1F3] text-[#2B6777] flex items-center justify-center">
                <Settings size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-[#2B6777]">
                  Application Settings
                </h2>
                <p className="text-xs text-[#8AAAB5] mt-1">
                  Current environment configuration
                </p>
              </div>
            </div>

            <div className="divide-y divide-[#EAF0F2]">
              <div className="flex items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-3">
                  <Monitor size={17} className="text-[#52AB98]" />
                  <span className="text-sm text-[#61777D]">Operating mode</span>
                </div>
                <span className="text-sm font-medium text-[#278A78] bg-[#E0F1EC] px-3 py-1 rounded-full">
                  {settings.mode || 'Demo Mode'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-3">
                  <Database size={17} className="text-[#52AB98]" />
                  <span className="text-sm text-[#61777D]">Database</span>
                </div>
                <span className="text-sm font-medium text-[#2B6777]">
                  Local SQLite
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-3">
                  <Sparkles size={17} className="text-[#52AB98]" />
                  <span className="text-sm text-[#61777D]">AI provider</span>
                </div>
                <span className="text-sm font-medium text-[#2B6777] text-right">
                  {settings.ai_provider || 'Rule-based fallback'}
                </span>
              </div>
            </div>
          </section>

          {/* Gemini API key */}
          <section className={cardStyle}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFF3D9] text-[#9A6B16] flex items-center justify-center">
                <KeyRound size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-[#2B6777]">
                  Optional Gemini API Key
                </h2>
                <p className="text-xs text-[#8AAAB5] mt-1">
                  AI provider configuration
                </p>
              </div>
            </div>

            <p className="text-sm text-[#71858B] mb-5 leading-relaxed">
              Add a Gemini API key to configure AI-powered analysis.
              Demo mode can work without it.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-3">
              <label className="block text-xs font-medium text-[#61777D]">
                Gemini API key
              </label>

              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Enter Gemini API key"
                autoComplete="off"
                className="w-full bg-[#F8FAFA] border border-[#C8D8E4] rounded-xl p-3 text-[#2B6777] text-sm outline-none focus:border-[#52AB98] focus:ring-2 focus:ring-[#52AB98]/20"
              />

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2B6777] hover:bg-[#245967] disabled:opacity-50 text-white text-sm font-medium transition"
              >
                <KeyRound size={16} />
                {saving ? 'Saving...' : 'Save API Key'}
              </button>
            </form>

            <div className="flex items-start gap-2 mt-5 p-3 rounded-xl bg-[#EAF1F3]">
              <ShieldCheck size={17} className="text-[#278A78] shrink-0 mt-0.5" />
              <p className="text-xs text-[#61777D] leading-relaxed">
                Keep your API key private. It is stored in your local application database.
                Never share it publicly or commit it to GitHub.
              </p>
            </div>
          </section>

          {/* Demo data */}
          <section className={cardStyle}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F9EEEE] text-[#A45B5B] flex items-center justify-center">
                <Database size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-[#2B6777]">
                  Demo Data
                </h2>
                <p className="text-xs text-[#8AAAB5] mt-1">
                  Local database management
                </p>
              </div>
            </div>

            <p className="text-sm text-[#71858B] mb-5 leading-relaxed">
              Restore the original sample business data stored in your local database.
              This action cannot be undone.
            </p>

            <button
              onClick={handleReset}
              disabled={resetting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#D9BFC0] hover:bg-[#F9EEEE] disabled:opacity-50 text-[#A45B5B] text-sm font-medium transition"
            >
              <RefreshCw size={16} className={resetting ? 'animate-spin' : ''} />
              {resetting ? 'Resetting...' : 'Reset Demo Data'}
            </button>
          </section>

          {/* Feedback */}
          {message && (
            <div className="bg-[#EAF1F3] border border-[#C8D8E4] rounded-xl p-4 text-sm text-[#2B6777]">
              {message}
            </div>
          )}

        </div>
      )}
    </div>
  )
}
