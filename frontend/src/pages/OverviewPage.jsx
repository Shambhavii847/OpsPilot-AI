
import { useState, useEffect } from 'react'
import {
  TrendingUp, ShoppingCart, Package, AlertTriangle,
  Lightbulb, CheckCircle, Activity, Sparkles, ArrowUpRight
} from 'lucide-react'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

import LoadingSpinner from '../components/LoadingSpinner.jsx'

import {
  getDashboardKpis, getRevenueTrend, getInventoryStatus,
  getRecentActivities, getBusinessInsights
} from '../services/api.js'

const TEAL = '#2B6777'
const SEA_GREEN = '#52AB98'
const PIE_COLORS = ['#2B6777', '#52AB98', '#C8D8E4', '#78B9AD', '#8AAAB5']

function formatCurrency(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`
  return `$${val}`
}

function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const cardStyle = "bg-white border border-[#C8D8E4] rounded-2xl p-5 shadow-sm"

export default function OverviewPage() {
  const [kpis, setKpis] = useState(null)
  const [revenue, setRevenue] = useState([])
  const [invStatus, setInvStatus] = useState([])
  const [activities, setActivities] = useState([])
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getDashboardKpis().catch(() => null),
      getRevenueTrend().catch(() => []),
      getInventoryStatus().catch(() => []),
      getRecentActivities().catch(() => []),
      getBusinessInsights().catch(() => null),
    ]).then(([k, r, i, a, ins]) => {
      setKpis(k)
      setRevenue(Array.isArray(r) ? r : [])
      setInvStatus(Array.isArray(i) ? i : [])
      setActivities(Array.isArray(a) ? a : [])
      setInsights(ins)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F2F2F2]">
        <LoadingSpinner text="Preparing your business overview..." />
      </div>
    )
  }

  const metrics = [
    {
      title: 'Total Revenue',
      value: formatCurrency(kpis?.total_revenue || 0),
      icon: TrendingUp,
      note: 'Business performance',
      color: 'text-[#2B6777]',
      bg: 'bg-[#C8D8E4]'
    },
    {
      title: 'Total Orders',
      value: (kpis?.total_orders || 0).toLocaleString(),
      icon: ShoppingCart,
      note: 'Orders processed',
      color: 'text-[#278A78]',
      bg: 'bg-[#E0F1EC]'
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(kpis?.inventory_value || 0),
      icon: Package,
      note: 'Current stock value',
      color: 'text-[#2B6777]',
      bg: 'bg-[#E8F0F3]'
    },
    {
      title: 'Low Stock Items',
      value: kpis?.low_stock_items || 0,
      icon: AlertTriangle,
      note: 'Requires attention',
      color: 'text-[#278A78]',
      bg: 'bg-[#E0F1EC]'
    }
  ]

  const secondaryMetrics = [
    {
      label: 'Pending Recommendations',
      value: kpis?.pending_recommendations || 0,
      icon: Lightbulb
    },
    {
      label: 'Completed Actions',
      value: kpis?.completed_actions || 0,
      icon: CheckCircle
    }
  ]

  const catPie = invStatus.map(cat => ({
    name: cat.category,
    value: (cat.in_stock || 0) +
      (cat.low_stock || 0) +
      (cat.out_of_stock || 0)
  })).filter(c => c.value > 0)

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-5 md:p-8 space-y-7">

      {/* Page heading */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#52AB98] font-semibold">
            OPERATIONAL INTELLIGENCE
          </p>
          <h1 className="text-3xl font-serif text-[#2B6777] mt-2">
            Business Overview
          </h1>
          <p className="text-sm text-[#61777D] mt-1">
            Your business performance, all in one place.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-[#C8D8E4] rounded-xl px-4 py-2.5">
          <span className="w-2 h-2 rounded-full bg-[#52AB98]" />
          <span className="text-xs font-medium text-[#2B6777]">
            System Operational
          </span>
        </div>
      </div>

      {/* Architectural hero */}
      <section className="relative overflow-hidden rounded-2xl min-h-[260px] md:min-h-[300px] bg-[#2B6777]">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85"
          alt="Modern architectural business building"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#163D49] via-[#2B6777]/80 to-transparent" />

        <div className="relative z-10 p-7 md:p-10 max-w-xl flex flex-col justify-center min-h-[260px] md:min-h-[300px]">
          <p className="text-[#A8E0D3] text-xs tracking-[0.2em] uppercase font-semibold">
            Intelligent business management
          </p>

          <h2 className="text-3xl md:text-4xl text-white font-serif mt-4 leading-tight">
            Smarter operations.
            <br />
            Better decisions.
          </h2>

          <p className="text-sm text-white/80 mt-4 max-w-md leading-6">
            Monitor performance, discover opportunities and manage your
            business operations with intelligent assistance.
          </p>

          <div className="flex items-center gap-2 mt-6 text-[#A8E0D3] text-sm">
            <Sparkles size={16} />
            <span>Powered by OpsPilot Intelligence</span>
          </div>
        </div>
      </section>

      {/* Primary metrics */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#2B6777]">
            Business Performance
          </h2>
          <span className="text-xs text-[#71858B]">Live dashboard data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon

            return (
              <div
                key={metric.title}
                className={`${cardStyle} hover:shadow-md hover:-translate-y-1 transition-all duration-200`}
              >
                <div className="flex justify-between items-start">
                  <div className={`${metric.bg} ${metric.color} p-3 rounded-xl`}>
                    <Icon size={19} />
                  </div>
                  <ArrowUpRight size={17} className="text-[#8AAAB5]" />
                </div>

                <p className="text-sm text-[#71858B] mt-5">
                  {metric.title}
                </p>

                <h3 className="text-2xl font-semibold text-[#2B6777] mt-1">
                  {metric.value}
                </h3>

                <p className="text-xs text-[#8AAAB5] mt-2">
                  {metric.note}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {secondaryMetrics.map(item => {
          const Icon = item.icon

          return (
            <div key={item.label} className={cardStyle + " flex items-center gap-4"}>
              <div className="bg-[#E0F1EC] text-[#278A78] p-3 rounded-xl">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-xs text-[#71858B]">{item.label}</p>
                <p className="text-xl font-semibold text-[#2B6777] mt-1">
                  {item.value}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Revenue chart */}
        <section className={cardStyle}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-semibold text-[#2B6777]">
                Revenue Performance
              </h2>
              <p className="text-xs text-[#71858B] mt-1">
                Last 30 days
              </p>
            </div>
            <div className="bg-[#E0F1EC] text-[#278A78] p-2 rounded-lg">
              <TrendingUp size={18} />
            </div>
          </div>

          {revenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={245}>
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="tealRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={SEA_GREEN} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={SEA_GREEN} stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#E4EAEC" />

                <XAxis
                  dataKey="date"
                  tick={{ fill: '#71858B', fontSize: 11 }}
                  tickFormatter={formatDate}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: '#71858B', fontSize: 11 }}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #C8D8E4',
                    borderRadius: 12,
                    color: '#2B6777'
                  }}
                  labelFormatter={formatDate}
                  formatter={v => [`$${Number(v).toFixed(2)}`, 'Revenue']}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={TEAL}
                  fill="url(#tealRevenue)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-sm text-[#71858B]">
              No revenue data available
            </div>
          )}
        </section>

        {/* Inventory chart */}
        <section className={cardStyle}>
          <div className="mb-6">
            <h2 className="font-semibold text-[#2B6777]">
              Inventory Distribution
            </h2>
            <p className="text-xs text-[#71858B] mt-1">
              Products by category
            </p>
          </div>

          {catPie.length > 0 ? (
            <ResponsiveContainer width="100%" height={245}>
              <PieChart>
                <Pie
                  data={catPie}
                  cx="50%"
                  cy="45%"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {catPie.map((_, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: '#71858B' }}
                />

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-sm text-[#71858B]">
              No inventory data available
            </div>
          )}
        </section>
      </div>

      {/* Activity and insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Recent activity */}
        <section className={cardStyle}>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-[#E0F1EC] text-[#278A78] p-2 rounded-lg">
              <Activity size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-[#2B6777]">Recent Activity</h2>
              <p className="text-xs text-[#71858B]">Latest business actions</p>
            </div>
          </div>

          {activities.length > 0 ? (
            <ul className="space-y-4">
              {activities.slice(0, 8).map((act, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#52AB98] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-[#355D68]">
                      {act.description || act.action_type}
                    </p>
                    <p className="text-xs text-[#8AAAB5] mt-1">
                      {act.created_at
                        ? new Date(act.created_at).toLocaleString()
                        : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#71858B]">No recent activities</p>
          )}
        </section>

        {/* Business insights */}
        <section className={`${cardStyle} bg-[#EAF1F3]`}>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-white text-[#278A78] p-2 rounded-lg">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-[#2B6777]">
                Business Intelligence
              </h2>
              <p className="text-xs text-[#71858B]">
                Insights from OpsPilot AI
              </p>
            </div>
          </div>

          {insights ? (
            <div className="space-y-4">
              {(insights.insights || insights.key_insights || [])
                .slice(0, 5)
                .map((ins, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <CheckCircle
                      size={16}
                      className="text-[#278A78] mt-0.5 flex-shrink-0"
                    />
                    <p className="text-sm text-[#355D68] leading-6">
                      {typeof ins === 'string'
                        ? ins
                        : ins.insight || ins.text}
                    </p>
                  </div>
                ))}

              {insights.health_score !== undefined && (
                <div className="pt-4 border-t border-[#C8D8E4]">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#61777D]">
                      Business Health Score
                    </span>
                    <span className="font-semibold text-[#278A78]">
                      {insights.health_score}/100
                    </span>
                  </div>

                  <div className="h-2 bg-[#C8D8E4] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#52AB98] rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(0, insights.health_score))}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#71858B]">
              Run an AI analysis to generate business insights.
            </p>
          )}
        </section>
      </div>

      <div className="text-center pt-2 pb-4">
        <p className="text-xs text-[#8AAAB5]">
          OpsPilot AI · From Business Insights to Intelligent Action
        </p>
      </div>
    </div>
  )
}
