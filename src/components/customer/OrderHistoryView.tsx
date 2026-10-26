import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  RotateCcw,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { ReviewModal } from './ReviewModal';

export const OrderHistoryView: React.FC = () => {
  const { orders, reorderItems, openOrderTracking, setActiveTab } = useApp();
  const [selectedReviewOrder, setSelectedReviewOrder] = useState<Order | null>(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] font-display">
          My Orders & Receipts
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Track active orders, view past meals, and reorder your favorites in 1 click
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-[#FFF0EB] text-[#FF6B35] flex items-center justify-center mx-auto mb-2">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#222222]">No orders placed yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Once you order from our popular Nigerian restaurants, your meals and tracking status will appear here.
          </p>
          <button
            onClick={() => setActiveTab('explore')}
            className="mt-2 px-6 py-2.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85924] transition-colors"
          >
            Start Ordering
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => {
            const isDelivered = ord.orderStatus === 'delivered';
            const isActive = !isDelivered && ord.orderStatus !== 'cancelled';

            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-4 hover:border-stone-300 transition-all"
              >
                {/* Header row: Restaurant, date & status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={ord.restaurant.coverImage}
                      alt={ord.restaurant.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#222222]">{ord.restaurant.name}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-bold">
                          {ord.orderReference}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {ord.createdAt}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isDelivered ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F7EE] text-[#2E9D63]">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        Delivered
                      </span>
                    ) : (
                      <button
                        onClick={() => openOrderTracking(ord.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF0EB] text-[#FF6B35] hover:bg-[#FFE3D6] transition-colors animate-pulse"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Live: {ord.orderStatus.replace(/_/g, ' ')}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-1.5 text-xs text-stone-700">
                  {ord.items.map((it) => (
                    <div key={it.cartItemId} className="flex justify-between items-center">
                      <span className="truncate pr-2">
                        <strong>{it.quantity}x</strong> {it.item.name}
                        {it.selectedSpice && (
                          <span className="text-stone-400 ml-1">({it.selectedSpice})</span>
                        )}
                      </span>
                      <span className="font-semibold tabular-nums text-stone-900 shrink-0">
                        ₦{it.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer: Total & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100">
                  <div className="text-xs">
                    <span className="text-stone-400">Total: </span>
                    <strong className="text-sm font-extrabold text-[#222222] tabular-nums">
                      ₦{ord.total.toLocaleString()}
                    </strong>
                    <span className="text-[11px] text-stone-400 ml-2">
                      ({ord.paymentMethod.replace(/_/g, ' ')})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Live Tracking if active */}
                    {isActive && (
                      <button
                        onClick={() => openOrderTracking(ord.id)}
                        className="px-3.5 py-2 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85924] transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Track Delivery</span>
                      </button>
                    )}

                    {/* Rate & Review if delivered */}
                    {isDelivered && (
                      <button
                        onClick={() => setSelectedReviewOrder(ord)}
                        disabled={ord.reviewed}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                          ord.reviewed
                            ? 'bg-stone-100 text-stone-400 cursor-default'
                            : 'bg-[#E8F7EE] text-[#2E9D63] hover:bg-[#d6f0df]'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{ord.reviewed ? 'Reviewed' : 'Rate Meal'}</span>
                      </button>
                    )}

                    {/* 1-Click Reorder */}
                    <button
                      onClick={() => reorderItems(ord)}
                      className="px-3 py-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Reorder meals from this basket"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {selectedReviewOrder && (
        <ReviewModal order={selectedReviewOrder} onClose={() => setSelectedReviewOrder(null)} />
      )}
    </div>
  );
};
