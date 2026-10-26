import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartConflictModal: React.FC = () => {
  const { pendingConflictItem, confirmReplaceCartAndAdd, cancelReplaceCart, cart } = useApp();

  if (!pendingConflictItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFF9F3] border border-stone-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl p-6 animate-scale-up">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={cancelReplaceCart}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-base font-bold text-[#222222]">Start a new basket?</h3>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            Your cart currently has items from{' '}
            <span className="font-bold text-[#222222]">{cart.restaurant?.name}</span>.
            To keep deliveries prompt and piping hot, Crave with Vee orders can only come from one restaurant at a time.
          </p>
          <div className="mt-4 p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-600">
            <p className="font-semibold text-stone-800">
              New item: {pendingConflictItem.item.name}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              From: {pendingConflictItem.restaurant.name}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={cancelReplaceCart}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
          >
            Keep Current Cart
          </button>
          <button
            onClick={confirmReplaceCartAndAdd}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85924] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Replace & Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
