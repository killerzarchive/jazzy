import { useState } from 'react'

export default function ProductPage({ product, onAddToCart }) {
  const images = product.images?.length ? product.images : [product.image]
  const sizes  = product.sizes || []

  const [activeImg, setActiveImg]       = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [imgLoaded, setImgLoaded]       = useState(false)
  const [added, setAdded]               = useState(false)
  const [qty, setQty]                   = useState(1)
  const [sizeError, setSizeError]       = useState(false)

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
    <div className="min-h-screen pb-28 ">
      <div className="grid grid-cols-2 mt-8 md:grid-cols-2 gap-0 md:gap-10 p-12">

        {/* ── LEFT: Media ── */}
        <div className="flex flex-col gap-3">
          {/* Main image */}
          <div className="w-full relative bg-gray-50" style={{ aspectRatio: '1/1' }}>
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-gray-100 to-gray-50" />
            )}
            <img
              key={activeImg} 
              src={images[activeImg]}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full rounded-3xl object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {onSale && (
              <span className="absolute top-4 left-4 bg-black text-white text-[9px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                Sale
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 px-5 md:px-0 overflow-x-auto pb-1">
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
        <div className="px-5 md:px-0 pt-5 md:pt-0 flex flex-col gap-5 md:justify-start">

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
                    className="h-9 px-3.5 text-[12px] font-semibold rounded-xl border transition-all duration-150 active:scale-95"
                    style={selectedSize === size
                      ? { background: '#000', color: '#fff', borderColor: '#000' }
                      : { background: '#fff', color: '#333', borderColor: '#e0e0e0' }}
                  >
                    {size}
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
