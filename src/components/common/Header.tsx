import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  ShoppingBag,
  Store,
  User,
  UtensilsCrossed,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  onOpenNotifications: () => void;
}

export const Header: React.FC<Props> = ({ onOpenNotifications }) => {
  const {
    activeTab,
    setActiveTab,
    user,
    cart,
    setIsCartOpen,
    setIsAuthModalOpen,
    setIsLocationModalOpen,
    selectedLocation,
    notifications,
    currentRole,
    setCurrentRole,
    logout,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const cartItemCount = cart.items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F3]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FF6B35] flex items-center justify-center text-white shadow-xs group-hover:bg-[#E85924] transition-colors">
              <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold tracking-tight text-[#222222] font-display">
                Crave with <span className="text-[#FF6B35]">Vee</span>
              </span>
            </div>
          </button>

          {/* Quick Location Badge (visible on tablet+) */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-200/90 text-xs font-semibold text-stone-700 hover:border-[#FF6B35]/40 hover:text-[#FF6B35] transition-colors ml-2"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
            <span className="truncate max-w-[140px]">{selectedLocation.area}</span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>
        </div>

        {/* Zone 2: 4-5 Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-stone-600">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'home'
                ? 'text-[#FF6B35]'
                : 'hover:text-[#222222]'
            }`}
          >
            Home
            {activeTab === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'explore'
                ? 'text-[#FF6B35]'
                : 'hover:text-[#222222]'
            }`}
          >
            Discover
            {activeTab === 'explore' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'orders' || activeTab === 'order_tracking'
                ? 'text-[#FF6B35]'
                : 'hover:text-[#222222]'
            }`}
          >
            My Orders
            {(activeTab === 'orders' || activeTab === 'order_tracking') && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'favorites'
                ? 'text-[#FF6B35]'
                : 'hover:text-[#222222]'
            }`}
          >
            Saved Meals
            {activeTab === 'favorites' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35] rounded-full" />
            )}
          </button>

          {/* Quick Role Toggle Bar */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs">
            <button
              onClick={() => setCurrentRole('customer')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                currentRole === 'customer'
                  ? 'bg-white text-[#222222] shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setCurrentRole('restaurant')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                currentRole === 'restaurant'
                  ? 'bg-white text-[#FF6B35] shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Restaurant
            </button>
            <button
              onClick={() => setCurrentRole('admin')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                currentRole === 'admin'
                  ? 'bg-white text-[#222222] shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Admin
            </button>
          </div>
        </nav>

        {/* Zone 3: Notification, Cart trigger & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Location Button */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="sm:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
            title="Select location"
          >
            <MapPin className="w-5 h-5 text-[#FF6B35]" />
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-stone-600 hover:text-[#222222] hover:bg-stone-100/80 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B35] ring-2 ring-[#FFF9F3]" />
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200/90 text-stone-700 hover:border-[#FF6B35] transition-all shadow-2xs group"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 group-hover:text-[#FF6B35] transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF6B35] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold tabular-nums text-[#222222]">
              {cartItemCount > 0 ? `₦${cart.finalTotal.toLocaleString()}` : 'Cart'}
            </span>
          </button>

          {/* User Menu / Sign In */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-stone-100/80 transition-colors border border-transparent focus:border-stone-300"
              >
                <div className="w-8 h-8 rounded-full bg-[#FFF0EB] text-[#FF6B35] border border-[#FF6B35]/20 flex items-center justify-center text-xs font-bold overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <span className="hidden lg:inline text-xs font-semibold text-[#222222] max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="hidden lg:block w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-[#222222] truncate">{user.name}</p>
                      <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        My Profile & Addresses
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('favorites');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-stone-400" />
                        Saved Restaurants & Meals
                      </button>
                    </div>

                    <div className="py-1 border-t border-stone-100">
                      <p className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Portal Views
                      </p>
                      <button
                        onClick={() => {
                          setCurrentRole('customer');
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          currentRole === 'customer' ? 'bg-[#FFF0EB] text-[#FF6B35] font-bold' : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4" /> Customer Ordering
                        </span>
                        {currentRole === 'customer' && <span className="text-[10px]">Active</span>}
                      </button>
                      <button
                        onClick={() => {
                          setCurrentRole('restaurant');
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          currentRole === 'restaurant' ? 'bg-[#FFF0EB] text-[#FF6B35] font-bold' : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Store className="w-4 h-4" /> Restaurant Dashboard
                        </span>
                        {currentRole === 'restaurant' && <span className="text-[10px]">Active</span>}
                      </button>
                      <button
                        onClick={() => {
                          setCurrentRole('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          currentRole === 'admin' ? 'bg-[#FFF0EB] text-[#FF6B35] font-bold' : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <LayoutDashboard className="w-4 h-4" /> Admin Console
                        </span>
                        {currentRole === 'admin' && <span className="text-[10px]">Active</span>}
                      </button>
                    </div>

                    <div className="pt-1 border-t border-stone-100">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold transition-colors shadow-2xs whitespace-nowrap"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
