export default function VendorBanner({ onNavigate }) {
  return (
    <section className="px-3 sm:px-9 pt-6 pb-10">
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
