export default function VendorBanner({ onNavigate }) {
  return (
    <section className="px-3 sm:px-9 pt-6 pb-10">
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
        VENDOR ACCESS
      </h2>
      <button
        onClick={() => onNavigate('vendor')}
        className="w-full overflow-hidden rounded-3xl active:scale-[0.99] transition-transform block"
      >
        <img
          src="/vendor.JPEG"
          alt="Personal High Quality Vendor"
          className="w-full h-auto object-cover"
        />
      </button>
    </section>
  )
}
