import { navLinks } from '../data/products'

export default function Sidebar({ isOpen, onClose, activePage, onNavigate }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-72 rounded-r-3xl bg-white z-30 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ borderRight: '1px solid #ebebeb' }}
      >
        {/* Top */}
        <div className="flex items-center justify-between px-6 h-16" style={{ borderBottom: '1px solid #ebebeb' }}>
          <span
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.15em', color: '#000' }}
          >
            JAZZY'S DROP SHOP
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors text-black/40 hover:text-black"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-6 py-6 flex flex-col gap-0">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { onNavigate(link.id); onClose() }}
              className={`text-left py-4 text-[13px] font-semibold tracking-wide transition-colors flex items-center justify-between group ${
                activePage === link.id ? 'text-black' : 'text-black/30 hover:text-black'
              }`}
              style={{ borderBottom: '1px solid #f0f0f0' }}
            >
              {link.label}
              <svg className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${activePage === link.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </nav>

        <div className="px-6 py-6 text-[9px] text-black/20 tracking-[0.3em] uppercase font-semibold">
          © 2025 Jazzy's Drop Shop
        </div>
      </aside>
    </>
  )
}
