import React, { useEffect, useState } from 'react';
import { Minus, Plus, ShoppingBag, Sparkles, X, Check, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SelectedCustomization } from '../../types';

export const MealCustomizerModal: React.FC = () => {
  const { customizerMeal, setCustomizerMeal, addToCart, setIsCartOpen } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedSpice, setSelectedSpice] = useState<'Mild' | 'Medium' | 'Extra Spicy'>('Medium');
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<string, { id: string; name: string; price: number }[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  const meal = customizerMeal?.item;
  const restaurant = customizerMeal?.restaurant;

  // Initialize defaults on meal load
  useEffect(() => {
    if (!meal) return;
    setQuantity(1);
    setSelectedSpice(meal.spiceLevels ? meal.spiceLevels[0] : 'Medium');
    setSpecialInstructions('');

    const initialMap: Record<string, { id: string; name: string; price: number }[]> = {};
    if (meal.customizationGroups) {
      meal.customizationGroups.forEach((group) => {
        if (group.type === 'radio' && group.options.length > 0) {
          // Select first option by default
          initialMap[group.id] = [group.options[0]];
        } else {
          initialMap[group.id] = [];
        }
      });
    }
    setSelectedOptionsMap(initialMap);
  }, [meal]);

  if (!customizerMeal || !meal || !restaurant) return null;

  // Calculate live unit price
  const extrasTotal = Object.values(selectedOptionsMap).reduce((acc, optList) => {
    return acc + optList.reduce((sum, opt) => sum + opt.price, 0);
  }, 0);

  const unitPrice = meal.price + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const handleRadioSelect = (groupId: string, opt: { id: string; name: string; price: number }) => {
    setSelectedOptionsMap((prev) => ({
      ...prev,
      [groupId]: [opt],
    }));
  };

  const handleCheckboxToggle = (
    groupId: string,
    opt: { id: string; name: string; price: number },
    maxSelect?: number
  ) => {
    setSelectedOptionsMap((prev) => {
      const current = prev[groupId] || [];
      const exists = current.some((o) => o.id === opt.id);
      if (exists) {
        return {
          ...prev,
          [groupId]: current.filter((o) => o.id !== opt.id),
        };
      } else {
        if (maxSelect && current.length >= maxSelect) {
          return prev; // Hit maximum
        }
        return {
          ...prev,
          [groupId]: [...current, opt],
        };
      }
    });
  };

  const handleAddToCart = () => {
    const formattedCustomizations: SelectedCustomization[] = [];

    if (meal.customizationGroups) {
      meal.customizationGroups.forEach((group) => {
        const selected = selectedOptionsMap[group.id] || [];
        if (selected.length > 0) {
          formattedCustomizations.push({
            groupId: group.id,
            groupTitle: group.title,
            selectedOptions: selected,
          });
        }
      });
    }

    const res = addToCart(
      meal,
      restaurant,
      quantity,
      meal.spiceLevels ? selectedSpice : undefined,
      formattedCustomizations,
      specialInstructions
    );

    if (res.success) {
      setCustomizerMeal(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFF9F3] border border-stone-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-scale-up">
        {/* Modal Image Header */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-900 shrink-0">
          <img
            src={meal.image}
            alt={meal.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          {/* Close button */}
          <button
            onClick={() => setCustomizerMeal(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges / Restaurant origin */}
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-xs font-semibold text-[#FF6B35] bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg">
              {restaurant.name}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display mt-1.5 leading-snug">
              {meal.name}
            </h3>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-white">
          {/* Description & Base Price */}
          <div className="pb-4 border-b border-stone-100">
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{meal.description}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-stone-500">
              <span className="font-extrabold text-lg text-[#222222] tabular-nums">
                ₦{meal.price.toLocaleString()}
              </span>
              <span>·</span>
              <span>⏱ {meal.prepTimeMinutes} mins prep</span>
              {meal.calories && (
                <>
                  <span>·</span>
                  <span>🔥 {meal.calories} kcal</span>
                </>
              )}
            </div>
          </div>

          {/* Spice level selector if applicable */}
          {meal.spiceLevels && meal.spiceLevels.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#222222] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#FF6B35]" />
                  Choose Spice Intensity
                </label>
                <span className="text-[11px] text-stone-400">Required</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {meal.spiceLevels.map((lvl) => {
                  const isSelected = selectedSpice === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedSpice(lvl)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                        isSelected
                          ? 'bg-[#FFF0EB] border-[#FF6B35] text-[#FF6B35] shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic Customization Groups */}
          {meal.customizationGroups?.map((group) => {
            const isRadio = group.type === 'radio';
            const selectedList = selectedOptionsMap[group.id] || [];

            return (
              <div key={group.id} className="pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold text-[#222222]">{group.title}</h4>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {group.required
                      ? 'Required (Select 1)'
                      : group.maxSelect
                      ? `Select up to ${group.maxSelect}`
                      : 'Optional'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {group.options.map((opt) => {
                    const isSelected = selectedList.some((o) => o.id === opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() =>
                          isRadio
                            ? handleRadioSelect(group.id, opt)
                            : handleCheckboxToggle(group.id, opt, group.maxSelect)
                        }
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#FFF0EB]/40 border-[#FF6B35]/50'
                            : 'bg-white border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-${isRadio ? 'full' : 'md'} border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-semibold text-[#222222]">{opt.name}</span>
                        </div>
                        <span className="text-xs font-bold text-stone-600 tabular-nums">
                          {opt.price > 0 ? `+₦${opt.price.toLocaleString()}` : 'Free'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special instructions */}
          <div className="pt-2 border-t border-stone-100">
            <label className="block text-xs font-bold text-[#222222] mb-1.5">
              Special Instructions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Please put pepper sauce in a separate container, extra onions..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Modal Sticky Bottom Action */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-9 text-center text-xs font-bold tabular-nums text-[#222222]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-stone-700 hover:bg-stone-50 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 rounded-xl bg-[#FF6B35] hover:bg-[#E85924] active:scale-[0.98] text-white text-xs sm:text-sm font-bold flex items-center justify-between shadow-lg shadow-[#FF6B35]/20 transition-all"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </div>
            <span className="tabular-nums font-extrabold text-sm">
              ₦{totalPrice.toLocaleString()}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
