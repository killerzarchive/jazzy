import { useState, useEffect, useRef } from 'react'

export default function Search({ isOpen, onClose, products, onSelectProduct }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  if (!isOpen) return null

  const results = query.trim().length === 0
    ? []
    : products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )

  function handleSelect(product) {
    onClose()
    onSelectProduct(product)
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        className="fixed left-4 right-4 z-50 bg-white rounded-2xl overflow-hidden"
        style={{ top: '72px', border: '1px solid #ebebeb', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4">
          <svg className="w-4 h-4 text-black/30 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="flex-1 text-[13px] font-medium text-black placeholder-black/25 outline-none bg-transparent"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="text-black/25 hover:text-black transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-[10px] tracking-[0.2em] uppercase font-bold text-black/30 hover:text-black transition-colors"
            >
              Close
            </button>
          )}
        </div>

        {/* Results */}
        {query.trim().length > 0 && (
          <div className="max-h-64 overflow-y-auto" style={{ borderTop: '1px solid #f0f0f0' }}>
            {results.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-[12px] text-black/25 font-medium">No results for "{query}"</p>
              </div>
            ) : (
              <div>
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-black/[0.02] transition-colors text-left"
                    style={{ borderBottom: '1px solid #f8f8f8' }}
                  >
                    <div className="w-10 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: '#f4f4f4' }}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-black font-medium truncate">{product.name}</p>
                      <p className="text-[10px] text-black/35 mt-0.5 capitalize tracking-wide">{product.category}</p>
                    </div>
                    <p className="text-[13px] font-bold text-black flex-shrink-0">${product.price.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
