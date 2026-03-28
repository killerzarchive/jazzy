import { navLinks } from '../data/products'

export default function Header({ onMenuOpen, cartCount, currentPage, onBack, onSignIn, onCartOpen, onSearchOpen, activePage, onNavigate, user }) {
  return (
    <header className="sticky top-0 z-10 bg-white" >

      {/* Breathing room from announcement bar */}
      <div className="py-5" />

      {/* Logo row */}
      <div className="flex items-center justify-between px-5 pb-3 relative">

        {/* Left icons */}
        <div className="flex items-center gap-5">
          {currentPage ? (
            <button
              onClick={onBack}
              className="text-black/50 hover:text-black transition-colors"
              aria-label="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <button onClick={onMenuOpen} aria-label="Menu" className="text-black/60 hover:text-black transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>
          )}
          <button onClick={onSearchOpen} aria-label="Search" className="text-black/60 hover:text-black transition-colors">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Logo — absolute center */}
        <button
          onClick={() => onNavigate?.('home')}
          className="absolute left-1/2 -translate-x-1/2 select-none"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.5rem',
            letterSpacing: '0.18em',
            color: '#000',
            lineHeight: 1,
          }}
        >
          JAZZY'S MARKETPLACE
        </button>

        {/* Right icons */}
        <div className="flex items-center gap-5">
          <button onClick={onSignIn} aria-label="Account" className="text-black/60 hover:text-black transition-colors">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          <button onClick={onCartOpen} aria-label="Cart" className="relative text-black/60 hover:text-black transition-colors">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Nav — spaced from logo row */}
      {!currentPage && (
        <>
          <div  />
          <nav className="flex items-center gap-7 px-5 py-3 pb-5 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {navLinks.map((link) => {
              const isActive = activePage === link.id
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate?.(link.id)}
                  className="flex-shrink-0 text-[11px] tracking-[0.2em] uppercase transition-colors whitespace-nowrap font-semibold"
                  style={{ color: isActive ? '#000' : '#aaa' }}
                >
                  {link.label}
                </button>
              )
            })}
            {user && (
              <button
                onClick={() => onNavigate?.('admin')}
                className="flex-shrink-0 text-[11px] tracking-[0.2em] uppercase whitespace-nowrap font-semibold"
                style={{ color: activePage === 'admin' ? '#000' : '#888' }}
              >
                Admin
              </button>
            )}
          </nav>
        </>
      )}
    </header>
  )
}
