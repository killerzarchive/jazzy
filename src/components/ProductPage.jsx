import { useState, useRef } from 'react'

function dualSize(size) {
  const m = parseFloat(size)
  const w = m + 1.5
  return `${m}M / ${Number.isInteger(w) ? w : w}W`
}

export default function ProductPage({ product, onAddToCart }) {
  const images = product.images?.length ? product.images : [product.image]
  const sizes  = product.sizes || []

  const [activeImg, setActiveImg]       = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [imgLoaded, setImgLoaded]       = useState(false)
  const [added, setAdded]               = useState(false)
  const [qty, setQty]                   = useState(1)
  const [sizeError, setSizeError]       = useState(false)
  const touchStartX = useRef(null)

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) < 40) return
    if (diff > 0) {
      // swipe left → next
      setActiveImg((i) => (i + 1) % images.length)
    } else {
      // swipe right → prev
      setActiveImg((i) => (i - 1 + images.length) % images.length)
    }
    setImgLoaded(false)
    touchStartX.current = null
  }

  const onSale = product.originalPrice && product.originalPrice > product.price

  async function handleAdd() {
    if (sizes.length > 0 && !selectedSize) {
      setSizeError(true)
      setTimeout(() => setSizeError(false), 1500)
      return
    }
    setAdded(true)
    await onAddToCart?.(product.id, qty)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div className="min-h-screen pb-28 overflow-x-hidden">
      <div className="grid mt-8 sm:grid-cols-2 gap-8 md:gap-10 px-4 sm:px-12 max-w-5xl mx-auto">

        {/* ── LEFT: Media ── */}
        <div className="flex flex-col gap-3 w-full min-w-0">
          {/* Main image carousel */}
          <div
            className="w-full relative bg-gray-50 rounded-3xl overflow-hidden select-none"
            style={{ aspectRatio: '1/1' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-gray-100 to-gray-50" />
            )}
            <img
              key={activeImg}
              src={images[activeImg]}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              draggable={false}
            />
            {onSale && (
              <span className="absolute top-4 left-4 bg-black text-white text-[9px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                Sale
              </span>
            )}

            {/* Prev / Next arrows — only when multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => { setActiveImg((i) => (i - 1 + images.length) % images.length); setImgLoaded(false) }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.35)' }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => { setActiveImg((i) => (i + 1) % images.length); setImgLoaded(false) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.35)' }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setActiveImg(i); setImgLoaded(false) }}
                      className="rounded-full transition-all duration-200"
                      style={{
                        width: activeImg === i ? 18 : 6,
                        height: 6,
                        background: activeImg === i ? '#fff' : 'rgba(255,255,255,0.5)',
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveImg(i); setImgLoaded(false) }}
                  className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    border: activeImg === i ? '2px solid #000' : '2px solid transparent',
                    background: '#f4f4f4',
                  }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Info ── */}
        <div className="w-full min-w-0 pt-2 md:pt-0 flex flex-col gap-5 md:justify-start">

          {/* Category */}
          <span className="text-[9px] tracking-[0.4em] uppercase text-black/30 font-semibold">
            {product.category}
          </span>

          {/* Name */}
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.04em', lineHeight: 1.05 }}
            className="text-black"
          >
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-[1.3rem] font-bold text-black">${product.price.toFixed(2)}</span>
            {onSale && (
              <span className="text-[13px] text-black/30 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <div style={{ height: 1, background: '#f0f0f0' }} />

          {/* Size selector */}
          {sizes.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] tracking-[0.35em] uppercase font-bold text-black/40">
                  Size{selectedSize ? `: ${selectedSize}` : ''}
                </span>
                {sizeError && (
                  <span className="text-[10px] font-bold text-red-500 tracking-wide animate-pulse">Select a size</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="h-9 px-3.5 text-[11px] font-semibold rounded-xl border transition-all duration-150 active:scale-95 whitespace-nowrap"
                    style={selectedSize === size
                      ? { background: '#000', color: '#fff', borderColor: '#000' }
                      : { background: '#fff', color: '#333', borderColor: '#e0e0e0' }}
                  >
                    {dualSize(size)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <span className="text-[9px] tracking-[0.35em] uppercase font-bold text-black/40">Quantity</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-black hover:border-black transition-colors text-base font-medium"
              >
                −
              </button>
              <span className="text-sm font-bold w-4 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-black hover:border-black transition-colors text-base font-medium"
              >
                +
              </button>
            </div>
          </div>

          {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-red-500">
              Only {product.stock} left
            </p>
          )}

          <div style={{ height: 1, background: '#f0f0f0' }} />

          {/* Product details */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[9px] tracking-[0.35em] uppercase font-bold text-black/30">Details</p>
            <p className="text-[13px] text-black/50 leading-relaxed">
              Authentic product from Jazzy's Drop Shop. All sales are final. Shipping times may vary.
            </p>
          </div>

          {/* Add to bag — inline on desktop, sticky on mobile */}
          <button
            onClick={handleAdd}
            className="hidden md:block w-full py-4 text-[11px] tracking-[0.25em] uppercase font-bold transition-all duration-300 rounded-2xl mt-2"
            style={{ background: added ? '#333' : '#000', color: '#fff' }}
          >
            {added ? '✓  Added to Bag' : 'Add to Bag'}
          </button>
        </div>
      </div>

      {/* Sticky add to bag — mobile only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-white" style={{ borderTop: '1px solid #f0f0f0' }}>
        <button
          onClick={handleAdd}
          className="w-full py-4 text-[11px] tracking-[0.25em] uppercase font-bold transition-all duration-300 rounded-2xl"
          style={{ background: added ? '#333' : '#000', color: '#fff' }}
        >
          {added ? '✓  Added to Bag' : 'Add to Bag'}
        </button>
      </div>
    </div>
  )
}
