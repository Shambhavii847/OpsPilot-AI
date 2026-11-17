
import { useEffect, useState } from 'react'
import {
  BarChart3, TrendingUp, ShoppingCart,
  Package, ArrowUpRight, Activity
} from 'lucide-react'
import {
  getAnalytics, getOrdersTrend, getProductPerformance
} from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

const cardStyle = "bg-white border border-[#C8D8E4] rounded-2xl p-5 shadow-sm"

export default function AnalyticsPage() {
  const [revenue, setRevenue] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAnalytics().catch(() => []),
      getOrdersTrend().catch(() => []),
      getProductPerformance().catch(() => [])
    ]).then(([r, o, p]) => {
      setRevenue(Array.isArray(r) ? r : r?.data || [])
      setOrders(Array.isArray(o) ? o : o?.data || [])
      setProducts(Array.isArray(p) ? p : p?.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const totalRevenue = revenue.reduce(
    (sum, item) => sum + Number(item.revenue || 0), 0
  )

  const totalOrders = orders.reduce(
    (sum, item) => sum + Number(item.orders || item.count || 0), 0
  )

  const maxRevenue = Math.max(
    ...revenue.map(x => Number(x.revenue || 0)), 1
  )

  const maxProductRevenue = Math.max(
    ...products.map(p => Number(p.revenue ?? p.sales ?? 0)), 1
  )

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-5 md:p-8 space-y-7">

      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#52AB98] font-semibold">
          BUSINESS INTELLIGENCE
        </p>
        <h1 className="text-3xl font-serif text-[#2B6777] mt-2">
          Business Analytics
        </h1>
        <p className="text-sm text-[#71858B] mt-1">
          Understand revenue, orders and product performance.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading analytics..." />
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className={cardStyle}>
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 rounded-xl bg-[#E0F1EC] text-[#278A78] flex items-center justify-center">
                  <TrendingUp size={21} />
                </div>
                <ArrowUpRight size={18} className="text-[#8AAAB5]" />
              </div>
              <p className="text-sm text-[#71858B] mt-5">
                Revenue in selected period
              </p>
              <p className="text-3xl font-semibold text-[#2B6777] mt-1">
                ${totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-[#8AAAB5] mt-2">
                Total recorded revenue
              </p>
            </div>

            <div className={cardStyle}>
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 rounded-xl bg-[#C8D8E4] text-[#2B6777] flex items-center justify-center">
                  <ShoppingCart size={21} />
                </div>
                <ArrowUpRight size={18} className="text-[#8AAAB5]" />
              </div>
              <p className="text-sm text-[#71858B] mt-5">
                Orders in selected period
              </p>
              <p className="text-3xl font-semibold text-[#2B6777] mt-1">
                {totalOrders.toLocaleString()}
              </p>
              <p className="text-xs text-[#8AAAB5] mt-2">
                Total orders recorded
              </p>
            </div>
          </div>

          {/* Revenue trend */}
          <section className={cardStyle}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-[#2B6777]">
                  Revenue Trend
                </h2>
                <p className="text-xs text-[#8AAAB5] mt-1">
                  Revenue across recorded periods
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#E0F1EC] text-[#278A78] flex items-center justify-center">
                <BarChart3 size={19} />
              </div>
            </div>

            {revenue.length ? (
              <div className="space-y-5">
                {revenue.slice(-10).map((item, i) => {
                  const value = Number(item.revenue || 0)
                  const percentage = Math.max(0, value / maxRevenue * 100)

                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-[#61777D]">
                          {item.date || item.day || `Period ${i + 1}`}
                        </span>
                        <span className="font-semibold text-[#2B6777]">
                          ${value.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-[#EAF0F2] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#52AB98] transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-[#8AAAB5] py-8 text-center">
                No revenue data available yet.
              </p>
            )}
          </section>

          {/* Product performance */}
          <section className={cardStyle}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-[#2B6777]">
                  Product Performance
                </h2>
                <p className="text-xs text-[#8AAAB5] mt-1">
                  Revenue or sales by product
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#C8D8E4] text-[#2B6777] flex items-center justify-center">
                <Package size={19} />
              </div>
            </div>

            {products.length ? (
              <div className="space-y-5">
                {products.map((p, i) => {
                  const value = Number(p.revenue ?? p.sales ?? 0)
                  const percentage = Math.max(
                    0, value / maxProductRevenue * 100
                  )

                  return (
                    <div key={p.id || i}>
                      <div className="flex justify-between items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-[#355D68]">
                          {p.name || p.product_name || 'Product'}
                        </span>
                        <span className="text-sm font-semibold text-[#278A78]">
                          {value.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-[#EAF0F2] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#2B6777] transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-[#8AAAB5] py-8 text-center">
                No product performance data available yet.
              </p>
            )}
          </section>

          {/* Orders information */}
          <div className="bg-[#EAF1F3] border border-[#C8D8E4] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white text-[#278A78] flex items-center justify-center">
              <Activity size={21} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#2B6777]">
                Analytics overview
              </h3>
              <p className="text-xs text-[#61777D] mt-1">
                Your business metrics are based on the data currently recorded in OpsPilot AI.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
