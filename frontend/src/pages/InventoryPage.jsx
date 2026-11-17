
import { useEffect, useState } from 'react'
import { Package, RefreshCw, Search, Boxes, ArrowUpRight } from 'lucide-react'
import { getInventory } from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

export default function InventoryPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadInventory = () => {
    setLoading(true)
    getInventory()
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadInventory()
  }, [])

  const filtered = products.filter(p =>
    (p.name || p.product_name || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalUnits = products.reduce(
    (sum, p) => sum + Number(p.quantity ?? p.stock ?? 0), 0
  )

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-5 md:p-8 space-y-7">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#52AB98]">
            BUSINESS OPERATIONS
          </p>
          <h1 className="text-3xl font-serif text-[#2B6777] mt-2">
            Inventory Management
          </h1>
          <p className="text-sm text-[#71858B] mt-1">
            Monitor products, stock levels and inventory requirements.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-[#C8D8E4] rounded-xl px-4 py-2.5">
          <span className="w-2 h-2 rounded-full bg-[#52AB98]" />
          <span className="text-xs font-medium text-[#2B6777]">
            Inventory Overview
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-[#C8D8E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-[#C8D8E4] flex items-center justify-center text-[#2B6777]">
              <Package size={21} />
            </div>
            <ArrowUpRight size={18} className="text-[#8AAAB5]" />
          </div>
          <p className="text-sm text-[#71858B] mt-5">Total Products</p>
          <p className="text-3xl font-semibold text-[#2B6777] mt-1">
            {products.length}
          </p>
          <p className="text-xs text-[#8AAAB5] mt-2">Products in your inventory</p>
        </div>

        <div className="bg-white border border-[#C8D8E4] rounded-2xl p-5 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-[#E0F1EC] flex items-center justify-center text-[#278A78]">
            <Boxes size={21} />
          </div>
          <p className="text-sm text-[#71858B] mt-5">Total Stock Units</p>
          <p className="text-3xl font-semibold text-[#2B6777] mt-1">
            {totalUnits.toLocaleString()}
          </p>
          <p className="text-xs text-[#8AAAB5] mt-2">Units currently recorded</p>
        </div>
      </div>

      {/* Product table */}
      <section className="bg-white border border-[#C8D8E4] rounded-2xl shadow-sm overflow-hidden">

        <div className="p-5 border-b border-[#E5ECEF]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#2B6777]">
                Product Inventory
              </h2>
              <p className="text-xs text-[#8AAAB5] mt-1">
                Browse and monitor your products
              </p>
            </div>

            <button
              onClick={loadInventory}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#52AB98] hover:bg-[#419987] text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          <div className="relative mt-5">
            <Search className="absolute left-3 top-3 w-4 h-4 text-[#8AAAB5]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-[#F2F2F2] border border-[#C8D8E4] rounded-xl py-2.5 pl-10 pr-4 text-[#2B6777] text-sm outline-none focus:ring-2 focus:ring-[#52AB98]/30 focus:border-[#52AB98] placeholder:text-[#8AAAB5]"
            />
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <LoadingSpinner text="Loading inventory..." />
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Package size={34} className="mx-auto text-[#8AAAB5] mb-3" />
              <p className="text-sm font-medium text-[#2B6777]">
                No products found
              </p>
              <p className="text-xs text-[#8AAAB5] mt-1">
                Try another search or refresh your inventory.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-[#71858B] border-b border-[#E5ECEF]">
                    <th className="py-3 px-3 font-semibold">Product</th>
                    <th className="py-3 px-3 font-semibold">Category</th>
                    <th className="py-3 px-3 font-semibold">Stock</th>
                    <th className="py-3 px-3 font-semibold">Price</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((p, i) => (
                    <tr
                      key={p.id || i}
                      className="border-b border-[#EEF2F3] last:border-0 hover:bg-[#F5F9F9] transition-colors"
                    >
                      <td className="py-4 px-3 font-medium text-[#2B6777]">
                        {p.name || p.product_name || 'Unnamed'}
                      </td>
                      <td className="py-4 px-3 text-[#71858B]">
                        {p.category || '—'}
                      </td>
                      <td className="py-4 px-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E0F1EC] text-[#278A78] text-xs font-semibold">
                          {p.quantity ?? p.stock ?? 0} units
                        </span>
                      </td>
                      <td className="py-4 px-3 font-medium text-[#2B6777]">
                        ${p.price ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <p className="text-xs text-[#8AAAB5] mt-4">
              Showing {filtered.length} of {products.length} products
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
