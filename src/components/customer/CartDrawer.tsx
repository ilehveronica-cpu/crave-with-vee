import React, { useState } from 'react';
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutModalOpen,
    user,
    setIsAuthModalOpen,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, error: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FFF9F3] w-full max-w-md h-full flex flex-col border-l border-stone-200 shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFF0EB] text-[#FF6B35] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#222222]">Your Basket</h2>
              <p className="text-xs text-stone-500">
                {cart.restaurant ? cart.restaurant.name : '0 items'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cart.items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-stone-400 hover:text-red-500 transition-colors p-1"
                title="Clear cart"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart items list or Empty state */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center px-4">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF0EB] flex items-center justify-center text-[#FF6B35] mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#222222]">Your basket is empty</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                Explore popular Nigerian dishes, rice, grills, and burgers to satisfy your craving today.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-6 py-2.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85924] transition-colors shadow-sm"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            cart.items.map((cartItem) => (
              <div
                key={cartItem.cartItemId}
                className="p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-100"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#222222] leading-tight">
                        {cartItem.item.name}
                      </h4>
                      <p className="text-xs font-extrabold text-[#FF6B35] mt-1 tabular-nums">
                        ₦{cartItem.unitTotalPrice.toLocaleString()}
                      </p>

                      {/* Display Customizations */}
                      {cartItem.selectedSpice && (
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Spice: <span className="font-semibold">{cartItem.selectedSpice}</span>
                        </p>
                      )}
                      {cartItem.selectedCustomizations.map((group) => (
                        <p key={group.groupId} className="text-[10px] text-stone-500">
                          {group.selectedOptions.map((o) => o.name).join(', ')}
                        </p>
                      ))}
                      {cartItem.specialInstructions && (
                        <p className="text-[10px] italic text-stone-400 mt-0.5">
                          "{cartItem.specialInstructions}"
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(cartItem.cartItemId)}
                    className="text-stone-300 hover:text-red-500 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Stepper & Total */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                    <button
                      onClick={() => updateCartQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                      className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-stone-700 hover:bg-stone-50 shadow-2xs transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold tabular-nums text-[#222222]">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                      className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-stone-700 hover:bg-stone-50 shadow-2xs transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-xs font-bold text-[#222222] tabular-nums">
                    ₦{cartItem.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Promo code & Order Summary */}
        {cart.items.length > 0 && (
          <div className="p-5 bg-white border-t border-stone-200 space-y-4">
            {/* Promo Code Input */}
            <div>
              {cart.appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#E8F7EE] border border-[#2E9D63]/30 text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2E9D63]" />
                    <div>
                      <span className="font-bold text-[#2E9D63]">{cart.appliedPromo.code}</span>
                      <p className="text-[10px] text-stone-600">{cart.appliedPromo.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-stone-400 hover:text-red-500 font-semibold text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. WELCOME20)"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoMessage(null);
                      }}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-[#222222]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoMessage && (
                <p
                  className={`text-[11px] mt-1 font-medium ${
                    promoMessage.error ? 'text-red-500' : 'text-[#2E9D63]'
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  ₦{cart.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {cart.deliveryFee === 0 ? (
                    <span className="text-[#2E9D63] font-bold">Free</span>
                  ) : (
                    `₦${cart.deliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge (2.5%)</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  ₦{cart.serviceFee.toLocaleString()}
                </span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-[#2E9D63]">
                  <span>Discount ({cart.appliedPromo?.code})</span>
                  <span className="font-bold tabular-nums">
                    -₦{cart.discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-extrabold text-[#222222]">
                <span>Total Amount</span>
                <span className="text-base text-[#FF6B35] tabular-nums">
                  ₦{cart.finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleProceedCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-[#FF6B35] hover:bg-[#E85924] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-between shadow-lg shadow-[#FF6B35]/25 transition-all"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-1.5">
                <span className="tabular-nums font-extrabold">₦{cart.finalTotal.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
