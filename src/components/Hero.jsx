export default function Hero({ onShopAll }) {
  return (
    <section className="relative overflow-hidden px-10 bg-black">
      <img
        src="/jazzy.jpeg"
        alt=""
        className="w-full h-auto block"
        style={{ opacity: 0.5 }}
      />

      {/* Gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />

      {/* Content — bottom left */}
      <div className="absolute bottom-0 left-0 right-0 px-[5vw] pb-[4vw]">
        <p
          className="uppercase font-semibold mb-[1vw]"
          style={{ fontSize: 'clamp(7px, 1.8vw, 13px)', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.5)' }}
        >
          New Drop — Limited Stock
        </p>

        <h1
          className="text-white leading-none mb-[2.5vw]"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(2rem, 10vw, 5.8rem)',
            letterSpacing: '0.02em',
            lineHeight: 0.88,
          }}
        >
          UNTIL IT'S ALL GONE
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={onShopAll}
            className="inline-flex items-center gap-2 bg-white text-black uppercase font-extrabold rounded-full transition-all duration-200 hover:bg-white/90 active:scale-[0.97]"
            style={{
              fontSize: 'clamp(8px, 1.8vw, 13px)',
              letterSpacing: '0.2em',
              padding: 'clamp(8px, 1.5vw, 18px) clamp(14px, 3vw, 28px)',
            }}
          >
            Shop the Drop
            <svg style={{ width: 'clamp(8px, 1.2vw, 13px)', height: 'clamp(8px, 1.2vw, 13px)' }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
