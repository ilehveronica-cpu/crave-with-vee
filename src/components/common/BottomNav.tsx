import React from 'react';
import { Compass, Heart, Home, ShoppingBag, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cart, setIsCartOpen, currentRole } = useApp();

  const cartItemCount = cart.items.reduce((sum, it) => sum + it.quantity, 0);

  // If in admin or restaurant portal on mobile, show quick switch or standard nav
  return (
    <>
      {/* Floating Cart Indicator when cart has items */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-16 sm:bottom-6 left-0 right-0 z-30 px-4 pointer-events-none">
          <div className="max-w-lg mx-auto pointer-events-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-between p-3.5 px-4 rounded-2xl bg-[#FF6B35] text-white shadow-xl shadow-[#FF6B35]/25 hover:bg-[#E85924] active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-white/20 text-white text-xs font-bold flex items-center justify-center">
                  {cartItemCount}
                </span>
                <div className="text-left">
                  <p className="text-xs font-bold tracking-tight">View Cart</p>
                  <p className="text-[10px] text-white/80 truncate max-w-[170px]">
                    {cart.restaurant?.name || 'Selected items'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tabular-nums">
                  ₦{cart.finalTotal.toLocaleString()}
                </span>
                <span className="text-xs font-semibold bg-white text-[#FF6B35] px-2 py-0.5 rounded-lg shadow-2xs">
                  Checkout →
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Tab Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-14 px-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'home' ? 'text-[#FF6B35]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-semibold mt-1">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'explore' ? 'text-[#FF6B35]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Compass className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-semibold mt-1">Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'favorites' ? 'text-[#FF6B35]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Heart className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-semibold mt-1">Favorites</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'orders' || activeTab === 'order_tracking'
                ? 'text-[#FF6B35]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-semibold mt-1">Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'profile' ? 'text-[#FF6B35]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-semibold mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
