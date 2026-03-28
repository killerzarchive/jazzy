const CATEGORIES = [
  { id: 'bags',        image: '/categories/bags.jpeg' },
  { id: 'rugs',        image: '/categories/rugs.jpeg' },
  { id: 'accessories', image: '/categories/accessories.jpeg' },
  { id: 'footwear',    image: '/categories/footwear.jpeg' },
]

export default function CategoryBanner({ onNavigate }) {
  return (
    <section className="pt-10 px-9 pb-4">
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
      <div className="grid grid-cols-4 gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onNavigate(cat.id)}
            className="relative overflow-hidden rounded-2xl aspect-square "
          >
            <img
              src={cat.image}
              alt={cat.id}
              className="h-54 object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>
    </section>
  )
}
