import React, { useState } from 'react';
import {
  Banknote,
  Check,
  CreditCard,
  MapPin,
  Plus,
  ShieldCheck,
  Truck,
  User,
  X,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserAddress } from '../../types';
import { PaymentGatewayModal } from './PaymentGatewayModal';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    user,
    selectedLocation,
    addAddress,
    createOrder,
    showToast,
  } = useApp();

  // Address selection state
  const defaultAddr = user?.savedAddresses.find((a) => a.isDefault) || user?.savedAddresses[0] || {
    id: 'addr-temp',
    label: 'Home' as const,
    street: selectedLocation.street || '15 Admiralty Way',
    area: selectedLocation.area,
    city: selectedLocation.city,
    state: `${selectedLocation.city} State`,
    isDefault: true,
  };

  const [selectedAddress, setSelectedAddress] = useState<UserAddress>(defaultAddr);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState(selectedLocation.area);
  const [newCity, setNewCity] = useState(selectedLocation.city);
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Contact info
  const [contactName, setContactName] = useState(user?.name || 'Tunde Adeleke');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+234 803 456 7890');
  const [deliveryNotes, setDeliveryNotes] = useState('Ring doorbell twice at the main gate');

  // Delivery Speed
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'priority'>('standard');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'flutterwave' | 'cash_on_delivery'>('paystack');

  // Payment gateway popup trigger
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [activeGateway, setActiveGateway] = useState<'paystack' | 'flutterwave'>('paystack');

  if (!isCheckoutModalOpen) return null;

  const priorityExtraFee = deliverySpeed === 'priority' ? 400 : 0;
  const finalPayableTotal = cart.finalTotal + priorityExtraFee;

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) {
      showToast('Please enter street address', 'error');
      return;
    }
    const created: UserAddress = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      street: newStreet,
      area: newArea,
      city: newCity,
      state: `${newCity} State`,
      isDefault: false,
    };
    if (user) {
      addAddress(created);
    }
    setSelectedAddress(created);
    setIsAddingNewAddress(false);
    showToast('New address selected');
  };

  const handleInitiateOrder = () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      showToast('Please provide your name and phone number', 'error');
      return;
    }

    if (paymentMethod === 'cash_on_delivery') {
      // Cash on delivery: place order with pending cash
      createOrder({
        deliveryAddress: selectedAddress,
        deliveryInstructions: deliveryNotes,
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'cash_pending',
      });
      showToast('Order confirmed with Cash on Delivery!');
    } else {
      // Open Paystack or Flutterwave payment gateway modal
      setActiveGateway(paymentMethod);
      setIsGatewayOpen(true);
    }
  };

  const handlePaymentSuccess = (paymentReference: string) => {
    setIsGatewayOpen(false);
    createOrder({
      deliveryAddress: selectedAddress,
      deliveryInstructions: deliveryNotes,
      paymentMethod,
      paymentReference,
      paymentStatus: 'verified',
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#FFF9F3] border border-stone-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-scale-up">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200">
            <div>
              <p className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-wider">
                Step 2 of 2 · Final Review
              </p>
              <h2 className="text-lg font-extrabold text-[#222222] font-display">
                Complete Your Delivery
              </h2>
            </div>
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* 1. Delivery Address Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#222222] flex items-center gap-1.5 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-[#FF6B35]" />
                  1. Delivery Destination
                </label>
                {!isAddingNewAddress && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(true)}
                    className="text-xs font-semibold text-[#FF6B35] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add New Address
                  </button>
                )}
              </div>

              {isAddingNewAddress ? (
                <form
                  onSubmit={handleSaveNewAddress}
                  className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-stone-800">Add New Address</p>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="text-xs text-stone-400 hover:text-stone-600"
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
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Street address (e.g. 14 Admiralty Way, Apt 3B)"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Area (e.g. Lekki Phase 1)"
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#222222]"
                    />
                    <input
                      type="text"
                      placeholder="City (e.g. Lagos)"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#222222]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#FF6B35] text-white rounded-xl text-xs font-bold hover:bg-[#E85924] transition-colors"
                  >
                    Save & Use This Address
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(user?.savedAddresses || [selectedAddress]).map((addr) => {
                    const isSelected = selectedAddress.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white border-[#FF6B35] shadow-xs'
                            : 'bg-white/80 border-stone-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FFF0EB] text-[#FF6B35]">
                            {addr.label}
                          </span>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-[#FF6B35] text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-bold text-[#222222] mt-1">{addr.street}</p>
                        <p className="text-[11px] text-stone-500">
                          {addr.area}, {addr.city}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Contact & Delivery Notes */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#222222] flex items-center gap-1.5 uppercase tracking-wider">
                <User className="w-4 h-4 text-[#FF6B35]" />
                2. Contact & Rider Instructions
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#222222] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#222222] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Delivery Instructions for Rider
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Leave at security desk, call when outside gate"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#222222] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Delivery Speed */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#222222] flex items-center gap-1.5 uppercase tracking-wider">
                <Truck className="w-4 h-4 text-[#FF6B35]" />
                3. Delivery Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setDeliverySpeed('standard')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    deliverySpeed === 'standard'
                      ? 'bg-white border-[#FF6B35] shadow-xs'
                      : 'bg-white/80 border-stone-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#222222]">Standard Delivery</span>
                    <span className="text-xs font-bold text-stone-600">Standard</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Estimated 30 - 45 mins from kitchen dispatch
                  </p>
                </div>

                <div
                  onClick={() => setDeliverySpeed('priority')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    deliverySpeed === 'priority'
                      ? 'bg-white border-[#FF6B35] shadow-xs'
                      : 'bg-white/80 border-stone-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF6B35] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" /> Priority Express
                    </span>
                    <span className="text-xs font-bold text-[#FF6B35]">+₦400</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Direct direct-to-door rider dispatch (20 - 30 mins)
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Payment Provider Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#222222] flex items-center gap-1.5 uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-[#FF6B35]" />
                4. Payment Method (Nigeria)
              </label>
              <div className="space-y-2">
                {/* Paystack */}
                <div
                  onClick={() => setPaymentMethod('paystack')}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === 'paystack'
                      ? 'bg-white border-[#FF6B35] shadow-xs'
                      : 'bg-white/80 border-stone-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#001428] text-white flex items-center justify-center font-bold text-xs">
                      PS
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#222222]">Paystack Online Payment</p>
                      <p className="text-[11px] text-stone-500">
                        Debit Card (Verve, Mastercard, Visa), Bank Transfer, USSD
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'paystack' && (
                    <div className="w-5 h-5 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Flutterwave */}
                <div
                  onClick={() => setPaymentMethod('flutterwave')}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === 'flutterwave'
                      ? 'bg-white border-[#FF6B35] shadow-xs'
                      : 'bg-white/80 border-stone-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FB6514] text-white flex items-center justify-center font-bold text-xs">
                      FL
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#222222]">Flutterwave Checkout</p>
                      <p className="text-[11px] text-stone-500">
                        Cards, Barter, Direct Account Debit & USSD
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'flutterwave' && (
                    <div className="w-5 h-5 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'bg-white border-[#FF6B35] shadow-xs'
                      : 'bg-white/80 border-stone-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#E8F7EE] text-[#2E9D63] flex items-center justify-center">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#222222]">Pay on Delivery (Cash / POS)</p>
                      <p className="text-[11px] text-stone-500">
                        Pay cash or card swipe to dispatch rider upon arrival
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'cash_on_delivery' && (
                    <div className="w-5 h-5 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items Snapshot */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#222222] pb-2 border-b border-stone-100">
                <span>Items from {cart.restaurant?.name}</span>
                <span className="text-stone-500 font-normal">{cart.items.length} items</span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1.5 text-xs">
                {cart.items.map((it) => (
                  <div key={it.cartItemId} className="flex justify-between items-center text-stone-700">
                    <span className="truncate pr-2">
                      {it.quantity}x {it.item.name}
                    </span>
                    <span className="font-semibold tabular-nums text-stone-900 shrink-0">
                      ₦{it.totalPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Checkout Bar */}
          <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-stone-500">Total payable amount</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-[#FF6B35] tabular-nums">
                  ₦{finalPayableTotal.toLocaleString()}
                </span>
                {priorityExtraFee > 0 && (
                  <span className="text-[11px] text-stone-400">Includes Priority (₦400)</span>
                )}
              </div>
            </div>

            <button
              onClick={handleInitiateOrder}
              className="py-3.5 px-6 rounded-xl bg-[#FF6B35] hover:bg-[#E85924] active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-[#FF6B35]/25 flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {paymentMethod === 'cash_on_delivery'
                  ? 'Confirm Cash Order'
                  : `Pay with ${paymentMethod === 'paystack' ? 'Paystack' : 'Flutterwave'}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Paystack / Flutterwave Gateway Simulator */}
      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        gateway={activeGateway}
        amount={finalPayableTotal}
        customerEmail={user?.email || 'customer@cravewithvee.com'}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};
