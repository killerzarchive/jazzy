import { useState } from 'react'

export default function BestSellers({ products, onSelect, onAddToCart }) {
  const featured = products.filter((p) => p.featured)

  return (
    <section className="pt-10 px-9 pb-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2
             className='text-2xl font-bold'
          >
            BEST SELLERS
          </h2>
        </div>
        <div className="flex flex-col items-end gap-2">
       
          <button
            onClick={() => onSelect(null)}
            className="flex items-center px-5 rounded-lg py-3 gap-1.5 bg-black text-[10px] tracking-[0.15em] uppercase font-bold text-white hover:text-black/50 transition-colors"
          >
            View All
           
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-x-3 gap-y-6">
        {featured.slice(0, 5).map((product) => (
          <ProductTile
            key={product.id}
            product={product}
            onSelect={() => onSelect(product)}
            onAddToCart={() => onAddToCart(product.id)}
          />
        ))}
      </div>

      {featured.length === 0 && (
        <p className="text-center text-black/20 py-16 text-sm tracking-wide">No featured products yet.</p>
      )}
    </section>
  )
}

function ProductTile({ product, onSelect, onAddToCart }) {
  const [loaded, setLoaded] = useState(false)
  const onSale = product.originalPrice && product.originalPrice > product.price

  return (
    <div className="flex flex-col cursor-pointer group" onClick={onSelect}>
      <div
        className="relative w-full overflow-hidden rounded-2xl mb-2"
        style={{ aspectRatio: '3/4', background: '#f4f4f4' }}
      >
        {!loaded && (
          <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 50%, #f0f0f0 100%)' }} />
        )}
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-600 group-hover:scale-[1.05] ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {onSale && (
          <span className="absolute top-2 left-2 bg-black text-white text-[8px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase">
            Sale
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart() }}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white border border-black/10 shadow-sm flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label="Add to cart"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      <p className="text-[11px] text-black font-medium leading-tight line-clamp-2 mb-0.5">{product.name}</p>
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[11px] font-bold text-black">${product.price.toFixed(2)}</span>
        {onSale && (
          <span className="text-[10px] text-black/30 line-through">${product.originalPrice.toFixed(2)}</span>
        )}
      </div>
    </div>
  )
}
