export default function Hero({ onShopAll }) {
  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-[45px] mx-7 sm:mx-10 bg-black">
      <img
        src="/jazzy.jpeg"
        alt=""
        className="w-full cover h-auto block"
        style={{ }}
      />

      {/* Gradient layers */}


      {/* Content — bottom left */}
      <div className=" bg-pink-300 left-0 right-0 px-3 py-2">
       

        <div className="flex items-center gap-4">
          <button
            onClick={onShopAll}
            className="inline-flex items-center gap-2 bg-white text-black uppercase font-extrabold rounded-full transition-all duration-200 hover:bg-white/90 active:scale-[0.97]"
            style={{
              fontSize: 'clamp(6px, 1.2vw, 10px)',
              letterSpacing: '0.2em',
              padding: 'clamp(5px, 1vw, 12px) clamp(10px, 2vw, 20px)',
            }}
          >
            Shop the Drop
            <svg style={{ width: 'clamp(6px, 0.9vw, 10px)', height: 'clamp(6px, 0.9vw, 10px)' }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
