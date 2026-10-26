import React, { useState } from 'react';
import {
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  Edit2,
  FileText,
  Heart,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MapPin,
  Plus,
  Shield,
  ShoppingBag,
  Store,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserAddress } from '../../types';
import { SupportModal } from './SupportModal';

export const ProfileView: React.FC = () => {
  const {
    user,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    setActiveTab,
    setCurrentRole,
    setIsAuthModalOpen,
    showToast,
    firebaseProjectId,
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('Lekki Phase 1');
  const [newCity, setNewCity] = useState('Lagos');

  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'terms' | 'privacy' | null>(null);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#FFF0EB] text-[#FF6B35] flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#222222]">You are browsing as Guest</h2>
        <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
          Sign in or create an account to save favorite meals, manage delivery addresses, and track orders.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="mt-5 px-6 py-3 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85924] transition-colors shadow-sm"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone });
    setIsEditingProfile(false);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) {
      showToast('Please provide a street address', 'error');
      return;
    }
    addAddress({
      label: newLabel,
      street: newStreet,
      area: newArea,
      city: newCity,
      state: `${newCity} State`,
      isDefault: false,
    });
    setNewStreet('');
    setIsAddingAddress(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6 animate-fade-in">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF0EB] text-[#FF6B35] border-2 border-[#FF6B35]/20 flex items-center justify-center text-2xl font-extrabold overflow-hidden shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-[#222222]">{user.name}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F7EE] text-[#2E9D63]">
                  Verified Customer
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{user.email}</p>
              <p className="text-xs text-stone-500 font-mono">{user.phone}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setName(user.name);
              setPhone(user.phone);
              setIsEditingProfile(true);
            }}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-[#222222]">Edit Personal Details</h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#222222] focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#222222] focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#FF6B35] text-white text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Saved Addresses Section */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#222222] uppercase tracking-wider">
              Saved Delivery Addresses
            </h2>
            <p className="text-xs text-stone-500">Fast one-tap delivery destinations</p>
          </div>
          {!isAddingAddress && (
            <button
              onClick={() => setIsAddingAddress(true)}
              className="text-xs font-bold text-[#FF6B35] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Address
            </button>
          )}
        </div>

        {isAddingAddress ? (
          <form
            onSubmit={handleAddAddressSubmit}
            className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800">New Address</span>
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="text-xs text-stone-400"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setNewLabel(lbl)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border ${
                    newLabel === lbl
                      ? 'bg-[#FFF0EB] border-[#FF6B35] text-[#FF6B35]'
                      : 'bg-white border-stone-200 text-stone-600'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Street Address (e.g. 15 Admiralty Way, Lekki)"
              value={newStreet}
              onChange={(e) => setNewStreet(e.target.value)}
              className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs text-[#222222]"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Area (e.g. Lekki Phase 1)"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="p-2.5 bg-white border border-stone-200 rounded-xl text-xs text-[#222222]"
              />
              <input
                type="text"
                placeholder="City (e.g. Lagos)"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="p-2.5 bg-white border border-stone-200 rounded-xl text-xs text-[#222222]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#FF6B35] text-white rounded-xl text-xs font-bold"
            >
              Save Address
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF0EB] text-[#FF6B35]">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-[#2E9D63] flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#222222] mt-1">{addr.street}</p>
                  <p className="text-[11px] text-stone-500">
                    {addr.area}, {addr.city}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-200/60 text-xs">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-[#FF6B35] font-semibold hover:underline"
                    >
                      Set as default
                    </button>
                  ) : (
                    <span className="text-stone-400 text-[11px]">Primary address</span>
                  )}
                  {user.savedAddresses.length > 1 && (
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-stone-400 hover:text-red-500 p-1"
                      title="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Navigation Links */}
      <div className="bg-white rounded-3xl border border-stone-200/90 divide-y divide-stone-100 overflow-hidden shadow-2xs">
        <button
          onClick={() => setActiveTab('orders')}
          className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#222222]">My Order History</p>
              <p className="text-[11px] text-stone-400">Past meals, order receipts & tracking</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#222222]">Saved Favorites</p>
              <p className="text-[11px] text-stone-400">Favorite restaurants and bookmark dishes</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        <button
          onClick={() => setIsSupportOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#222222]">Help & Support</p>
              <p className="text-[11px] text-stone-400">24/7 assistance, order issues & FAQs</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* Firebase Cloud Backend Status */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#222222]">Firebase Cloud Integration</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2E9D63] bg-[#E8F7EE] px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E9D63] animate-pulse"></span>
                Connected
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Project: <span className="font-mono text-stone-700 font-semibold">{firebaseProjectId}</span> · Auth & Firestore Synchronized
            </p>
          </div>
        </div>
      </div>

      {/* Role Switcher Portal Area */}
      <div className="bg-[#FFF0EB]/70 border border-[#FF6B35]/20 rounded-3xl p-6 space-y-3">
        <h3 className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
          Platform Portals
        </h3>
        <p className="text-xs text-stone-600">
          Switch role to preview administrative orders or restaurant kitchen operations:
        </p>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setCurrentRole('restaurant')}
            className="p-3 bg-white rounded-2xl border border-[#FF6B35]/30 text-left hover:border-[#FF6B35] transition-all flex items-center gap-2.5"
          >
            <Store className="w-5 h-5 text-[#FF6B35]" />
            <div>
              <p className="text-xs font-bold text-[#222222]">Restaurant Portal</p>
              <p className="text-[10px] text-stone-400">Manage kitchen queue & stock</p>
            </div>
          </button>
          <button
            onClick={() => setCurrentRole('admin')}
            className="p-3 bg-white rounded-2xl border border-stone-200 text-left hover:border-[#222222] transition-all flex items-center gap-2.5"
          >
            <LayoutDashboard className="w-5 h-5 text-[#222222]" />
            <div>
              <p className="text-xs font-bold text-[#222222]">Admin Dashboard</p>
              <p className="text-[10px] text-stone-400">Sales, catalog & promo control</p>
            </div>
          </button>
        </div>
      </div>

      {/* Legal & Logout */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-2 px-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveLegalModal('terms')}
            className="hover:text-[#222222] hover:underline"
          >
            Terms & Conditions
          </button>
          <span>·</span>
          <button
            onClick={() => setActiveLegalModal('privacy')}
            className="hover:text-[#222222] hover:underline"
          >
            Privacy Policy
          </button>
        </div>

        <button
          onClick={logout}
          className="text-red-600 font-bold hover:underline flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log out</span>
        </button>
      </div>

      {/* Support Modal */}
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />

      {/* Legal Modals */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl max-h-[80vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-[#222222]">
                {activeLegalModal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
              </h3>
              <button onClick={() => setActiveLegalModal(null)} className="text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-stone-600 leading-relaxed space-y-2">
              <p>
                Welcome to Crave with Vee. By using our platform, you agree to comply with our honest
                delivery standards, single-restaurant cart protocols, and secure verified payment
                policies.
              </p>
              <p>
                All customer orders are verified with licensed Nigerian payment processors (Paystack
                / Flutterwave). We never store raw card pins or passwords. Delivery times are live
                estimates subject to local road conditions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
