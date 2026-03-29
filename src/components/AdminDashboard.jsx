import { useState, useRef, useEffect } from 'react'
import { createProduct, updateProduct, deleteProduct, getOrders } from '../lib/api'
import { uploadProductImage } from '../lib/supabase'

const SHOE_SIZES = ['4','4.5','5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12','13','14']

const EMPTY = {
  name: '', price: '', originalPrice: '',
  category: 'footwear', featured: false, stock: '',
}
const CATEGORIES = ['footwear', 'bags', 'rugs', 'accessories']

export default function AdminDashboard({ products, onProductsChange }) {
  const [form, setForm]             = useState(EMPTY)
  const [mediaItems, setMediaItems] = useState([])   // { file|null, preview, url|null }
  const [selectedSizes, setSelectedSizes] = useState([])
  const [uploading, setUploading]   = useState(false)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [tab, setTab]               = useState('add')
  const [editingId, setEditingId]   = useState(null)  // null = create mode
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [orders, setOrders]         = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [vendorFee, setVendorFee]       = useState('')
  const [feeLoading, setFeeLoading]     = useState(false)
  const [feeSaved, setFeeSaved]         = useState(false)
  const [feeError, setFeeError]         = useState('')
  const [shippingFee, setShippingFee]   = useState('')
  const [shipLoading, setShipLoading]   = useState(false)
  const [shipSaved, setShipSaved]       = useState(false)
  const [shipError, setShipError]       = useState('')
  const fileRef                     = useRef(null)

  useEffect(() => {
    if (tab === 'orders') {
      setOrdersLoading(true)
      getOrders().then(setOrders).catch(() => {}).finally(() => setOrdersLoading(false))
    }
    if (tab === 'settings') {
      fetch('/api/settings')
        .then((r) => r.json())
        .then(({ settings }) => {
          if (settings?.vendor_fee) setVendorFee(settings.vendor_fee)
          if (settings?.shipping_fee) setShippingFee(settings.shipping_fee)
        })
        .catch(() => {})
    }
  }, [tab])

  async function saveVendorFee(e) {
    e.preventDefault()
    setFeeLoading(true)
    setFeeError('')
    setFeeSaved(false)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key: 'vendor_fee', value: vendorFee }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setFeeSaved(true)
      setTimeout(() => setFeeSaved(false), 3000)
    } catch (err) {
      setFeeError(err.message)
    } finally {
      setFeeLoading(false)
    }
  }

  async function saveShippingFee(e) {
    e.preventDefault()
    setShipLoading(true)
    setShipError('')
    setShipSaved(false)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key: 'shipping_fee', value: shippingFee }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setShipSaved(true)
      setTimeout(() => setShipSaved(false), 3000)
    } catch (err) {
      setShipError(err.message)
    } finally {
      setShipLoading(false)
    }
  }

  const sizeOptions = form.category === 'footwear' ? SHOE_SIZES : []

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    if (name === 'category') setSelectedSizes([])
    setError('')
    setSuccess('')
  }

  function handleFiles(files) {
    const newItems = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((file) => ({ file, preview: URL.createObjectURL(file), url: null }))
    setMediaItems((prev) => [...prev, ...newItems])
    setError('')
  }

  function handleDrop(e) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  function removeMedia(index) {
    setMediaItems((prev) => prev.filter((_, i) => i !== index))
  }

  function toggleSize(size) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  function startEdit(p) {
    setEditingId(p.id)
    setForm({
      name:          p.name,
      price:         String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      category:      p.category,
      featured:      p.featured,
      stock:         String(p.stock ?? ''),
    })
    // existing images as non-file previews
    const existingImages = p.images?.length ? p.images : (p.image ? [p.image] : [])
    setMediaItems(existingImages.map((url) => ({ file: null, preview: url, url })))
    setSelectedSizes(p.sizes || [])
    setError('')
    setSuccess('')
    setTab('add')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY)
    setMediaItems([])
    setSelectedSizes([])
    setError('')
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (mediaItems.length === 0) { setError('Upload at least one image.'); return }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Upload only new files; keep existing URLs as-is
      setUploading(true)
      const urls = await Promise.all(
        mediaItems.map((item) =>
          item.file ? uploadProductImage(item.file) : Promise.resolve(item.url)
        )
      )
      setUploading(false)

      const payload = {
        name:          form.name.trim(),
        price:         parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        imageUrl:      urls[0],
        images:        urls,
        sizes:         selectedSizes,
        category:      form.category,
        featured:      form.featured,
        stock:         parseInt(form.stock) || 0,
      }

      if (editingId) {
        await updateProduct(editingId, payload)
        setSuccess('Product updated.')
        setEditingId(null)
      } else {
        await createProduct(payload)
        setSuccess('Product added successfully.')
      }

      setForm(EMPTY)
      setMediaItems([])
      setSelectedSizes([])
      onProductsChange?.()
    } catch (err) {
      setError(err.message)
      setUploading(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProduct(id)
      setDeleteConfirm(null)
      onProductsChange?.()
    } catch (err) {
      alert(err.message)
    }
  }

  const isBusy = saving || uploading

  return (
    <div className="pt-8 pb-24 w-full max-w-2xl px-5">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[9px] tracking-[0.4em] uppercase text-black/25 font-semibold mb-1">Dashboard</p>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.05em', lineHeight: 1 }}>
          Product Manager
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex mb-8 overflow-x-auto" style={{ borderBottom: '1px solid #f0f0f0' }}>
        {[['add', editingId ? 'Edit Product' : 'New Listing'], ['listings', `Products (${products.length})`], ['orders', `Orders (${orders.length})`], ['settings', 'Settings']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => { setTab(id); if (id !== 'add') cancelEdit() }}
            className="mr-7 pb-3 text-[11px] tracking-[0.2em] uppercase font-bold transition-all whitespace-nowrap flex-shrink-0"
            style={{
              color: tab === id ? '#000' : '#bbb',
              borderBottom: tab === id ? '2px solid #000' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── ADD / EDIT PRODUCT ── */}
      {tab === 'add' && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">

          {/* Edit mode banner */}
          {editingId && (
            <div className="flex items-center justify-between bg-black/[0.03] border border-black/[0.07] rounded-xl px-4 py-3">
              <p className="text-[11px] font-semibold text-black/60">Editing product #{editingId}</p>
              <button type="button" onClick={cancelEdit} className="text-[10px] tracking-wider uppercase font-bold text-black/40 hover:text-black transition-colors">
                Cancel
              </button>
            </div>
          )}

          {/* Media upload */}
          <div className="flex flex-col gap-3">
            <p className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">
              Media {mediaItems.length > 0 && `· ${mediaItems.length} file${mediaItems.length > 1 ? 's' : ''}`}
            </p>

            <div className="flex gap-2 flex-wrap">
              {mediaItems.map((item, i) => (
                <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 group">
                  <img src={item.preview} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-white text-[7px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(i)}
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  </button>
                </div>
              ))}

              <div
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 hover:border-black transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 flex-shrink-0"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[9px] text-gray-300 tracking-wider uppercase font-semibold">Add</span>
                  </>
                )}
              </div>
            </div>

            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </div>

          <Field label="Product name" name="name" value={form.name} onChange={handleChange} required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Price ($)" name="price" value={form.price} onChange={handleChange} required type="number" step="0.01" />
            <Field label="Compare at ($)" name="originalPrice" value={form.originalPrice} onChange={handleChange} type="number" step="0.01" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">Category</label>
              <select
                name="category" value={form.category} onChange={handleChange}
                className="border-b border-gray-200 focus:border-black outline-none py-2.5 text-sm text-gray-900 bg-transparent transition-colors capitalize appearance-none"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Field label="Stock qty" name="stock" value={form.stock} onChange={handleChange} type="number" />
          </div>

          {sizeOptions.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">
                Sizes {selectedSizes.length > 0 && `· ${selectedSizes.length} selected`}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {sizeOptions.map((size) => (
                  <button
                    key={size} type="button" onClick={() => toggleSize(size)}
                    className="h-9 px-3.5 text-[11px] font-semibold rounded-xl border transition-all active:scale-95"
                    style={selectedSizes.includes(size)
                      ? { background: '#000', color: '#fff', borderColor: '#000' }
                      : { background: '#fafafa', color: '#aaa', borderColor: '#ebebeb' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div
            onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
            className="flex items-center justify-between py-3 cursor-pointer select-none"
            style={{ borderTop: '1px solid #f5f5f5', borderBottom: '1px solid #f5f5f5' }}
          >
            <div>
              <p className="text-[12px] font-semibold text-black">Feature on homepage</p>
              <p className="text-[10px] text-black/30 mt-0.5">Show in the featured products section</p>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 flex-shrink-0 ${form.featured ? 'bg-black' : 'bg-gray-200'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${form.featured ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-[11px] text-red-500 font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-black/[0.03] border border-black/[0.06] rounded-xl px-4 py-3">
              <svg className="w-3.5 h-3.5 text-black/40 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-[11px] text-black/50 font-medium">{success}</p>
            </div>
          )}

          <button
            type="submit" disabled={isBusy}
            className="w-full bg-black text-white py-[18px] text-[10px] tracking-[0.3em] uppercase font-bold active:scale-[0.99] transition-all rounded-2xl disabled:opacity-30"
          >
            {uploading ? 'Uploading…' : saving ? 'Saving…' : editingId ? 'Update Product' : 'Publish Listing'}
          </button>
        </form>
      )}

      {/* ── LISTINGS ── */}
      {tab === 'listings' && (
        <div>
          {products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[11px] text-black/20 tracking-[0.3em] uppercase font-semibold">No listings yet</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 py-4 group" style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[13px] font-semibold text-black truncate">{p.name}</p>
                      {p.featured && (
                        <span className="flex-shrink-0 text-[8px] tracking-widest uppercase font-bold text-black/30 border border-black/10 px-1.5 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-black">${p.price.toFixed(2)}</span>
                      {p.originalPrice && (
                        <span className="text-[11px] text-black/25 line-through">${p.originalPrice.toFixed(2)}</span>
                      )}
                      <span className="text-[10px] text-black/25">·</span>
                      <span className="text-[11px] text-black/40 capitalize">{p.category}</span>
                    </div>
                    {p.sizes?.length > 0 && (
                      <p className="text-[10px] text-black/25 mt-0.5 font-medium">{p.sizes.join(' · ')}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => startEdit(p)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-black/30 active:text-black active:bg-black/[0.06] transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    {deleteConfirm === p.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDelete(p.id)} className="text-[10px] tracking-wider uppercase font-bold text-white bg-black px-3 py-2 rounded-xl active:scale-95 transition-all">
                          Delete
                        </button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-[10px] tracking-wider uppercase font-bold text-black/40 active:text-black transition-colors px-2 py-2">
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(p.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-black/30 active:text-black active:bg-black/[0.06] transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SETTINGS ── */}
      {tab === 'settings' && (
        <div className="flex flex-col gap-8">
          <form onSubmit={saveVendorFee} className="flex flex-col gap-6">
            <div>
              <p className="text-[9px] tracking-[0.4em] uppercase text-black/25 font-semibold mb-1">Vendor Onboarding</p>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.05em', lineHeight: 1 }}>
                Vendor Fee
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">One-time fee ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={vendorFee}
                onChange={(e) => { setVendorFee(e.target.value); setFeeSaved(false); setFeeError('') }}
                placeholder="49.99"
                required
                className="border-b border-gray-200 focus:border-black outline-none py-2.5 text-sm text-gray-900 bg-transparent transition-colors font-medium"
              />
              <p className="text-[10px] text-black/30">This is the amount charged to users on the Vendor page.</p>
            </div>

            {feeError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-[11px] text-red-500 font-medium">{feeError}</p>
              </div>
            )}
            {feeSaved && (
              <div className="flex items-center gap-2 bg-black/[0.03] border border-black/[0.06] rounded-xl px-4 py-3">
                <svg className="w-3.5 h-3.5 text-black/40 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-[11px] text-black/50 font-medium">Vendor fee updated.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={feeLoading}
              className="w-full bg-black text-white py-[18px] text-[10px] tracking-[0.3em] uppercase font-bold active:scale-[0.99] transition-all rounded-2xl disabled:opacity-30"
            >
              {feeLoading ? 'Saving…' : 'Save Fee'}
            </button>
          </form>

          <div style={{ height: 1, background: '#f0f0f0' }} />

          <form onSubmit={saveShippingFee} className="flex flex-col gap-6">
            <div>
              <p className="text-[9px] tracking-[0.4em] uppercase text-black/25 font-semibold mb-1">Checkout</p>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.05em', lineHeight: 1 }}>
                Shipping Fee
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">Base shipping ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={shippingFee}
                onChange={(e) => { setShippingFee(e.target.value); setShipSaved(false); setShipError('') }}
                placeholder="20.00"
                required
                className="border-b border-gray-200 focus:border-black outline-none py-2.5 text-sm text-gray-900 bg-transparent transition-colors font-medium"
              />
              <p className="text-[10px] text-black/30">Applied to every order at checkout.</p>
            </div>

            {shipError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-[11px] text-red-500 font-medium">{shipError}</p>
              </div>
            )}
            {shipSaved && (
              <div className="flex items-center gap-2 bg-black/[0.03] border border-black/[0.06] rounded-xl px-4 py-3">
                <svg className="w-3.5 h-3.5 text-black/40 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-[11px] text-black/50 font-medium">Shipping fee updated.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={shipLoading}
              className="w-full bg-black text-white py-[18px] text-[10px] tracking-[0.3em] uppercase font-bold active:scale-[0.99] transition-all rounded-2xl disabled:opacity-30"
            >
              {shipLoading ? 'Saving…' : 'Save Shipping Fee'}
            </button>
          </form>
        </div>
      )}

      {/* ── ORDERS ── */}
      {tab === 'orders' && (
        <div>
          {ordersLoading ? (
            <div className="py-20 text-center">
              <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin mx-auto" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[11px] text-black/20 tracking-[0.3em] uppercase font-semibold">No orders yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl p-4" style={{ border: '1px solid #f0f0f0' }}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-[13px] font-semibold text-black">{order.firstName} {order.lastName}</p>
                      <p className="text-[11px] text-black/40 mt-0.5">{order.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[13px] font-bold text-black">${order.total.toFixed(2)}</p>
                      <span className="inline-block mt-1 text-[8px] tracking-widest uppercase font-bold px-2 py-0.5 rounded-full bg-black/5 text-black/40">{order.status}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 mb-3" style={{ borderTop: '1px solid #f8f8f8', paddingTop: '10px' }}>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-[11px] text-black/50 truncate pr-3">{item.name} × {item.qty}</span>
                        <span className="text-[11px] text-black/40 flex-shrink-0">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-start gap-2" style={{ borderTop: '1px solid #f8f8f8', paddingTop: '10px' }}>
                    <svg className="w-3 h-3 text-black/20 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-[11px] text-black/35 leading-relaxed">{order.address}, {order.city}, {order.state} {order.zip} · {order.country}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3" style={{ borderTop: '1px solid #f8f8f8', paddingTop: '10px' }}>
                    <p className="text-[10px] text-black/25 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    {order.stripePaymentId && (
                      <p className="text-[9px] text-black/20 font-mono truncate ml-4">{order.stripePaymentId}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Field({ label, name, value, onChange, required, type = 'text', step }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        required={required} step={step}
        className="border-b border-gray-200 focus:border-black outline-none py-2.5 text-sm text-gray-900 bg-transparent transition-colors font-medium"
      />
    </div>
  )
}
