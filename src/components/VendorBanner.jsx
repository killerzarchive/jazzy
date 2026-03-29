export default function VendorBanner({ onNavigate }) {
  return (
    <section className="px-3 sm:px-9 pt-6 pb-10">
      <button
        onClick={() => onNavigate('vendor')}
        className="w-full relative overflow-hidden rounded-3xl bg-black text-white active:scale-[0.99] transition-transform"
        style={{ minHeight: 320 }}
      >
        {/* Stars */}
        <Star size={52} top="6%" left="3%" filled />
        <Star size={36} top="18%" left="1%" />
        <Star size={28} top="42%" left="5%" />
        <Star size={44} top="70%" left="2%" />
        <Star size={32} top="85%" left="8%" filled />
        <Star size={40} top="8%" right="5%" />
        <Star size={28} top="30%" right="2%" />
        <Star size={50} top="55%" right="3%" />
        <Star size={34} top="78%" right="7%" filled />
        <Star size={22} top="90%" right="12%" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center py-14 px-6 text-center gap-4">
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/40 font-semibold">
            Jazzy's Showcase
          </p>

          <h2
            className="leading-none"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(2.8rem, 10vw, 4.5rem)',
              color: '#f0b8d8',
              textShadow: '0 0 40px rgba(240,184,216,0.3)',
              lineHeight: 1.05,
            }}
          >
            Personal<br />
            High Quality<br />
            Vendor
          </h2>

          <div
            className="mt-2 px-8 py-3"
            style={{
              border: '2px solid #f0b8d8',
              borderRadius: 6,
            }}
          >
            <span
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontStyle: 'italic',
                fontSize: '1.6rem',
                color: '#f0b8d8',
              }}
            >
              Become a Vendor
            </span>
          </div>

          <p className="text-[11px] text-white/35 leading-relaxed mt-1 max-w-xs">
            Vendor guide and product list will be sent via email
          </p>
        </div>
      </button>
    </section>
  )
}

function Star({ size, top, left, right, filled }) {
  const style = {
    position: 'absolute',
    top,
    left,
    right,
    width: size,
    height: size,
    opacity: filled ? 0.9 : 0.35,
  }
  return (
    <svg style={style} viewBox="0 0 24 24" fill={filled ? 'white' : 'none'} stroke="white" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
}
