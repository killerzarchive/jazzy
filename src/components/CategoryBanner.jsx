export default function CategoryBanner({ onNavigate, categories }) {
  if (!categories?.length) return null

  return (
    <section className="pt-10 px-3 sm:px-9 pb-4">
      <h2
        className="mb-4"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.7rem',
          letterSpacing: '0.05em',
          color: '#000',
          lineHeight: 1,
        }}
      >
        CATEGORIES
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onNavigate(cat.slug)}
            className="relative overflow-hidden rounded-2xl aspect-square group"
          >
            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <span
              className="absolute bottom-3 left-3 text-white font-bold tracking-widest uppercase"
              style={{ fontSize: 'clamp(9px, 2vw, 13px)' }}
            >
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
