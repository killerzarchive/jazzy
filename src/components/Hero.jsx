export default function Hero({ onShopAll }) {
  return (
    <section className="relative overflow-hidden px-10 bg-black" style={{ height: '80vw', maxHeight: 520 }}>
      <img
        src="/jazzy.jpeg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={{ opacity: 0.5 }}
      />

      {/* Gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

      {/* Content — bottom left */}
      <div className="absolute bottom-0 left-0 right-0 px-12 pb-10">
        <p className="text-[9px] tracking-[0.45em] uppercase font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          New Drop — Limited Stock
        </p>

        <h1
          className="text-white leading-none mb-6"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(3.2rem, 16vw, 5.8rem)',
            letterSpacing: '0.02em',
            lineHeight: 0.88,
          }}
        >
          UNTIL IT'S ALL GONE
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={onShopAll}
            className="inline-flex items-center gap-2 bg-white text-black text-[11px] tracking-[0.2em] uppercase font-extrabold px-6 py-5 rounded-full transition-all duration-200 hover:bg-white/90 active:scale-[0.97]"
          >
            Shop the Drop
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
