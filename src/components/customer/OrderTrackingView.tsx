import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  RotateCcw,
  ShieldCheck,
  Star,
  Store,
  Truck,
  Bike,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReviewModal } from './ReviewModal';

export const OrderTrackingView: React.FC = () => {
  const { orders, trackingOrderId, setActiveTab, reorderItems, updateOrderStatus, showToast } = useApp();

  const [activeReviewOrder, setActiveReviewOrder] = useState<any>(null);
  const [mapProgress, setMapProgress] = useState(45); // percent along the simulated delivery route

  const order = orders.find((o) => o.id === trackingOrderId) || orders[0];

  useEffect(() => {
    if (!order) return;
    if (order.orderStatus === 'out_for_delivery') {
      const interval = setInterval(() => {
        setMapProgress((prev) => (prev >= 90 ? 90 : prev + 5));
      }, 3000);
      return () => clearInterval(interval);
    } else if (order.orderStatus === 'delivered') {
      setMapProgress(100);
    } else {
      setMapProgress(25);
    }
  }, [order?.orderStatus]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h2 className="text-lg font-bold text-[#222222]">No active order found</h2>
        <p className="text-xs text-stone-500 mt-1">Start browsing restaurants to place your first order.</p>
        <button
          onClick={() => setActiveTab('explore')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold"
        >
          Explore Food
        </button>
      </div>
    );
  }

  const isDelivered = order.orderStatus === 'delivered';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('orders')}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#222222] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
            {order.orderReference}
          </span>
          {isDelivered ? (
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#E8F7EE] text-[#2E9D63]">
              Delivered
            </span>
          ) : (
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FFF0EB] text-[#FF6B35] animate-pulse">
              Live Tracking
            </span>
          )}
        </div>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <p className="text-xs text-stone-400 font-semibold">Estimated Delivery Time</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222222] font-display">
                {isDelivered ? 'Order Completed' : `${order.estimatedDeliveryMinutes} - ${order.estimatedDeliveryMinutes + 10} mins`}
              </h2>
              {!isDelivered && (
                <span className="text-xs font-semibold text-[#2E9D63] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> On schedule
                </span>
              )}
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Delivering from <span className="font-bold text-[#222222]">{order.restaurant.name}</span> to{' '}
              <span className="font-bold text-[#222222]">{order.deliveryAddress.street}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isDelivered && !order.reviewed && (
              <button
                onClick={() => setActiveReviewOrder(order)}
                className="px-4 py-2.5 rounded-xl bg-[#2E9D63] text-white text-xs font-bold hover:bg-[#258252] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                Rate & Review
              </button>
            )}
            <button
              onClick={() => reorderItems(order)}
              className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reorder
            </button>
          </div>
        </div>

        {/* Live Delivery Route Simulation Card */}
        <div className="mt-6 rounded-2xl bg-stone-900 text-white p-5 overflow-hidden relative border border-stone-800">
          {/* Simulated Map Visual */}
          <div className="h-44 sm:h-52 w-full rounded-xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 relative overflow-hidden flex flex-col justify-between p-4 border border-stone-700">
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Map Header */}
            <div className="relative z-10 flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#FF6B35]" />
                Simulated Live GPS Route
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                Lekki Corridor · Traffic: Moderate
              </span>
            </div>

            {/* Simulated Road Path with Moving Rider */}
            <div className="relative z-10 my-auto py-4">
              <div className="relative h-2.5 bg-stone-700/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6B35] to-[#2E9D63] transition-all duration-1000 rounded-full"
                  style={{ width: `${mapProgress}%` }}
                />
              </div>

              {/* Waypoints & Bike Marker */}
              <div className="relative flex justify-between items-center -mt-5">
                {/* Kitchen Origin */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-stone-800 border-2 border-stone-600 flex items-center justify-center text-white shadow-sm">
                    <Store className="w-4 h-4 text-[#FF6B35]" />
                  </div>
                  <span className="text-[10px] text-stone-300 mt-1 font-semibold">Kitchen</span>
                </div>

                {/* Animated Rider Marker */}
                <div
                  className="absolute transition-all duration-1000 -top-1"
                  style={{ left: `calc(${mapProgress}% - 16px)` }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#FF6B35] border-2 border-white flex items-center justify-center text-white shadow-md animate-bounce">
                    <Bike className="w-4 h-4" />
                  </div>
                </div>

                {/* Destination */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-white shadow-sm ${
                      isDelivered ? 'bg-[#2E9D63] border-white' : 'bg-stone-800 border-stone-600'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#2E9D63]" />
                  </div>
                  <span className="text-[10px] text-stone-300 mt-1 font-semibold">Your Gate</span>
                </div>
              </div>
            </div>

            {/* Map Footer status */}
            <div className="relative z-10 flex items-center justify-between text-xs pt-1 border-t border-stone-800">
              <span className="text-stone-300">
                Speed: <span className="font-mono text-white font-bold">32 km/h</span>
              </span>
              <span className="text-[#2E9D63] font-semibold flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" /> Insured Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Rider Profile */}
        {order.rider && (
          <div className="mt-6 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={order.rider.avatar}
                alt={order.rider.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#FF6B35]/30 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#222222]">{order.rider.name}</h4>
                  <span className="text-xs font-semibold text-amber-600 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-current" /> {order.rider.rating}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  {order.rider.vehicle} · <span className="font-mono">{order.rider.plateNumber}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${order.rider.phone}`}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-[#222222] hover:border-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-[#2E9D63]" />
                <span>Call Rider</span>
              </a>
              <button
                onClick={() => showToast(`Message sent to rider ${order.rider?.name}`)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#222222] text-white hover:bg-[#333333] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Status Timeline + Order Receipt Details */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Order Progress Stepper Timeline (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-stone-200 p-6 space-y-6">
          <h3 className="text-sm font-bold text-[#222222] uppercase tracking-wider">
            Order Progress
          </h3>

          <div className="space-y-6 relative pl-2">
            {order.statusTimeline.map((step, idx) => {
              const isPast = step.completed && !step.current;
              const isNow = step.current;

              return (
                <div key={step.status} className="flex items-start gap-4 relative">
                  {/* Vertical connecting line */}
                  {idx !== order.statusTimeline.length - 1 && (
                    <div
                      className={`absolute left-3.5 top-6 bottom-[-24px] w-0.5 ${
                        step.completed ? 'bg-[#2E9D63]' : 'bg-stone-200'
                      }`}
                    />
                  )}

                  {/* Step Icon */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                      isNow
                        ? 'bg-[#FF6B35] text-white ring-4 ring-[#FFF0EB]'
                        : isPast
                        ? 'bg-[#2E9D63] text-white'
                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    ) : isNow ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-stone-300" />
                    )}
                  </div>

                  {/* Step Text */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-bold ${
                          isNow ? 'text-[#FF6B35]' : step.completed ? 'text-[#222222]' : 'text-stone-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {step.timestamp && (
                        <span className="text-[10px] text-stone-400">{step.timestamp}</span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick simulator status accelerator (for testing demo flow) */}
          <div className="pt-4 border-t border-stone-100">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              Demo Status Simulator
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  'preparing',
                  'ready_for_pickup',
                  'out_for_delivery',
                  'delivered',
                ] as const
              ).map((st) => (
                <button
                  key={st}
                  onClick={() => updateOrderStatus(order.id, st)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#FFF0EB] hover:text-[#FF6B35] text-[11px] font-semibold text-stone-600 transition-colors"
                >
                  Set to {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Receipt & Items (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#222222] uppercase tracking-wider">
              Order Details
            </h3>

            {/* Restaurant Info */}
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <img
                src={order.restaurant.coverImage}
                alt={order.restaurant.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div>
                <h4 className="text-xs font-bold text-[#222222]">{order.restaurant.name}</h4>
                <p className="text-[11px] text-stone-500 truncate max-w-[180px]">
                  {order.restaurant.address}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3 max-h-56 overflow-y-auto">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="flex justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#222222]">
                      {item.quantity}x {item.item.name}
                    </p>
                    {item.selectedSpice && (
                      <p className="text-[10px] text-stone-400">Spice: {item.selectedSpice}</p>
                    )}
                    {item.selectedCustomizations.map((c) => (
                      <p key={c.groupId} className="text-[10px] text-stone-400">
                        {c.selectedOptions.map((o) => o.name).join(', ')}
                      </p>
                    ))}
                  </div>
                  <span className="font-semibold tabular-nums text-stone-900 shrink-0">
                    ₦{item.totalPrice.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  ₦{order.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {order.deliveryFee === 0 ? 'Free' : `₦${order.deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  ₦{order.serviceFee.toLocaleString()}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#2E9D63]">
                  <span>Discount</span>
                  <span className="font-bold tabular-nums">
                    -₦{order.discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-extrabold text-[#222222]">
                <span>Paid Total</span>
                <span className="text-[#FF6B35] tabular-nums">
                  ₦{order.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-500">Payment:</span>
              <span className="font-bold text-[#222222] capitalize">
                {order.paymentMethod.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal if triggered */}
      {activeReviewOrder && (
        <ReviewModal order={activeReviewOrder} onClose={() => setActiveReviewOrder(null)} />
      )}
    </div>
  );
};
