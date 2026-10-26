import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { LocationModal } from './components/common/LocationModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { HomeScreen } from './components/customer/HomeScreen';
import { RestaurantDiscovery } from './components/customer/RestaurantDiscovery';
import { RestaurantDetail } from './components/customer/RestaurantDetail';
import { MealCustomizerModal } from './components/customer/MealCustomizerModal';
import { CartConflictModal } from './components/customer/CartConflictModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackingView } from './components/customer/OrderTrackingView';
import { OrderHistoryView } from './components/customer/OrderHistoryView';
import { FavoritesView } from './components/customer/FavoritesView';
import { ProfileView } from './components/customer/ProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RestaurantDashboard } from './components/restaurant/RestaurantDashboard';
import { UtensilsCrossed, ShieldCheck, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRole, activeTab, setActiveTab } = useApp();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F3] text-[#222222]">
      {/* Top Navigation */}
      <Header onOpenNotifications={() => setIsNotificationsOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRole === 'admin' ? (
          <AdminDashboard />
        ) : currentRole === 'restaurant' ? (
          <RestaurantDashboard />
        ) : (
          <>
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'explore' && <RestaurantDiscovery />}
            {activeTab === 'restaurant_detail' && <RestaurantDetail />}
            {activeTab === 'order_tracking' && <OrderTrackingView />}
            {activeTab === 'orders' && <OrderHistoryView />}
            {activeTab === 'favorites' && <FavoritesView />}
            {activeTab === 'profile' && <ProfileView />}
          </>
        )}
      </main>

      {/* Footer on customer views */}
      {currentRole === 'customer' && (
        <footer className="bg-white border-t border-stone-200/80 py-10 px-4 sm:px-6 lg:px-8 mt-auto hidden md:block">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FF6B35] flex items-center justify-center text-white">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-[#222222] font-display">
                Crave with <span className="text-[#FF6B35]">Vee</span>
              </span>
              <span className="text-stone-300 mx-2">|</span>
              <span>Your cravings, delivered hot and fresh across Nigeria.</span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('explore')}
                className="hover:text-[#FF6B35] transition-colors"
              >
                Browse Restaurants
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className="hover:text-[#FF6B35] transition-colors"
              >
                Order Tracking
              </button>
              <div className="flex items-center gap-1.5 text-stone-400">
                <ShieldCheck className="w-4 h-4 text-[#2E9D63]" />
                <span>Verified Paystack & Flutterwave</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Modals & Overlays */}
      <LocationModal />
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <AuthModal />
      <MealCustomizerModal />
      <CartConflictModal />
      <CartDrawer />
      <CheckoutModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
