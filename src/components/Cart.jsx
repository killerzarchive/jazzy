export default function Cart({ cartItems, products, onRemove, onUpdateQty, onCheckout, onContinue }) {
  const enriched = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return null
      return { ...item, product }
    })
    .filter(Boolean)

  const subtotal = enriched.reduce((sum, i) => sum + i.product.price * i.qty, 0)

  if (enriched.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
        <svg className="w-10 h-10 text-gray-200 mb-5" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p className="text-[12px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-1">Your bag is empty</p>
        <p className="text-[12px] text-gray-300 mb-8">Add something you love</p>
        <button
          onClick={onContinue}
          className="text-[10px] tracking-[0.25em] uppercase font-bold text-gray-400 hover:text-black transition-colors underline underline-offset-4"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="pt-6 pb-36">
      <p className="text-[9px] tracking-[0.35em] uppercase text-gray-400 font-bold mb-6">Your Bag ({enriched.length})</p>

      <div className="flex flex-col" style={{ borderTop: '1px solid #f0f0f0' }}>
        {enriched.map((item) => (
          <div key={item.productId} className="flex gap-4 py-5" style={{ borderBottom: '1px solid #f0f0f0' }}>
            <div className="w-[72px] h-[88px] bg-gray-50 flex-shrink-0 overflow-hidden rounded-xl">
              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-[13px] text-gray-800 font-medium leading-snug">{item.product.name}</p>
                <button
                  onClick={() => onRemove(item.productId)}
                  className="text-gray-300 hover:text-black transition-colors flex-shrink-0 mt-0.5"
                  aria-label="Remove"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-[12px] text-gray-400 capitalize mb-auto">{item.product.category}</p>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpdateQty(item.productId, item.qty - 1)}
                    className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors text-xs"
                  >
                    −
                  </button>
                  <span className="text-[13px] font-bold text-gray-800 w-4 text-center">{item.qty}</span>
                  <button
                    onClick={() => onUpdateQty(item.productId, item.qty + 1)}
                    className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors text-xs"
                  >
                    +
                  </button>
                </div>
                <span className="text-[13px] font-bold text-gray-900">
                  ${(item.product.price * item.qty).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 flex flex-col gap-2.5">
        <div className="flex justify-between text-[12px]">
          <span className="text-gray-400 tracking-wide">Subtotal</span>
          <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[12px]">
          <span className="text-gray-400 tracking-wide">Shipping</span>
          <span className="text-gray-400">Calculated at checkout</span>
        </div>
        <div className="flex justify-between text-[13px] pt-2" style={{ borderTop: '1px solid #f0f0f0' }}>
          <span className="font-bold text-gray-900 tracking-wide">Total</span>
          <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-white" style={{ borderTop: '1px solid #f0f0f0' }}>
        <button
          onClick={onCheckout}
          className="w-full bg-black text-white py-4 text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 rounded-2xl"
        >
          Checkout · ${subtotal.toFixed(2)}
        </button>
        <button
          onClick={onContinue}
          className="w-full mt-3 text-[10px] tracking-[0.25em] uppercase font-bold text-gray-400 hover:text-black transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
