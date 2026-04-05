import { useState } from 'react'

export default function ProductCard({ product, onSelect, onAddToCart }) {
  const [added, setAdded] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const onSale = product.originalPrice && product.originalPrice > product.price
  const outOfStock = product.stock === 0

  function handleAdd(e) {
    e.stopPropagation()
    setAdded(true)
    onAddToCart?.()
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div className="flex flex-col group cursor-pointer" onClick={outOfStock ? undefined : onSelect}>
      <div
        className="relative w-full overflow-hidden rounded-2xl mb-3"
        style={{ aspectRatio: '3/4', background: '#f4f4f4' }}
      >
        {!loaded && (
          <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 50%, #f0f0f0 100%)' }} />
        )}
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${outOfStock ? 'brightness-75' : ''}`}
        />
        {outOfStock ? (
          <span className="absolute top-3 left-3 bg-white text-black text-[9px] font-bold px-2.5 py-0.5 rounded-full tracking-wide uppercase border border-black/10">
            Out of Stock
          </span>
        ) : onSale && (
          <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full tracking-wide uppercase">
            Sale
          </span>
        )}
        {!outOfStock && (
          <button
            onClick={handleAdd}
            aria-label="Add to cart"
            className={`absolute bottom-3 right-3 w-8 h-8 rounded-full border flex items-center justify-center shadow-sm transition-all duration-200 ${
              added
                ? 'bg-black text-white border-black scale-95'
                : 'bg-white text-black border-black/10 hover:bg-black hover:text-white'
            }`}
          >
            {added ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        )}
      </div>

      <p className={`text-[13px] font-medium leading-snug mb-1 ${outOfStock ? 'text-black/40' : 'text-black'}`}>{product.name}</p>
      <div className="flex items-center gap-2">
        <span className={`text-[13px] font-bold ${outOfStock ? 'text-black/40' : 'text-black'}`}>${product.price.toFixed(2)}</span>
        {onSale && !outOfStock && (
          <span className="text-[12px] text-black/30 line-through">${product.originalPrice.toFixed(2)}</span>
        )}
      </div>
    </div>
  )
}
