import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Flame,
  Package,
  Plus,
  RotateCcw,
  ShoppingBag,
  Store,
  Utensils,
  X,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem, OrderStatus, Restaurant } from '../../types';

export const RestaurantDashboard: React.FC = () => {
  const {
    restaurants,
    menuItems,
    orders,
    updateRestaurant,
    updateMenuItem,
    addMenuItem,
    updateOrderStatus,
    setCurrentRole,
    openOrderTracking,
    showToast,
  } = useApp();

  // Active restaurant selection
  const [activeRestId, setActiveRestId] = useState<string>(restaurants[0]?.id || 'rest-1');
  const restaurant = restaurants.find((r) => r.id === activeRestId) || restaurants[0];

  const [activeTab, setActiveTab] = useState<'incoming' | 'menu' | 'history'>('incoming');

  // Add meal modal
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [newMealName, setNewMealName] = useState('');
  const [newMealDesc, setNewMealDesc] = useState('');
  const [newMealPrice, setNewMealPrice] = useState(3500);
  const [newMealCat, setNewMealCat] = useState('Nigerian Dishes');

  const currentKitchenOrders = orders.filter((o) => o.restaurant.id === restaurant.id);
  const incomingQueue = currentKitchenOrders.filter(
    (o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled'
  );
  const pastOrders = currentKitchenOrders.filter(
    (o) => o.orderStatus === 'delivered' || o.orderStatus === 'cancelled'
  );
  const currentMenuItems = menuItems.filter((m) => m.restaurantId === restaurant.id);

  // Daily Kitchen revenue
  const kitchenSales = currentKitchenOrders.reduce((sum, o) => sum + o.subtotal, 0);

  const handleCreateMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealName.trim()) return;

    addMenuItem({
      restaurantId: restaurant.id,
      name: newMealName,
      description: newMealDesc || 'Cooked fresh in kitchen upon order',
      price: Number(newMealPrice),
      image: restaurant.coverImage,
      category: newMealCat,
      isAvailable: true,
      isPopular: false,
      prepTimeMinutes: 20,
      spiceLevels: ['Mild', 'Medium', 'Extra Spicy'],
    });

    setNewMealName('');
    setNewMealDesc('');
    setIsAddMealOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-6 animate-fade-in">
      {/* Top Header & Kitchen Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0EB] text-[#FF6B35] flex items-center justify-center text-2xl font-bold shadow-xs">
            {restaurant.logo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#222222] font-display">
                {restaurant.name}
              </h1>
              <button
                onClick={() => updateRestaurant(restaurant.id, { isOpen: !restaurant.isOpen })}
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full transition-colors ${
                  restaurant.isOpen ? 'bg-[#E8F7EE] text-[#2E9D63]' : 'bg-red-50 text-red-600'
                }`}
              >
                {restaurant.isOpen ? '● Kitchen Open' : '● Kitchen Closed'}
              </button>
            </div>
            <p className="text-xs text-stone-500">
              {restaurant.area} · Switch restaurant view below
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Restaurant switcher */}
          <select
            value={activeRestId}
            onChange={(e) => setActiveRestId(e.target.value)}
            className="p-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800 shadow-2xs focus:outline-none"
          >
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                Switch: {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setCurrentRole('customer')}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer View</span>
          </button>
        </div>
      </div>

      {/* Daily Kitchen KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-stone-500">Live Queue (Cooking / Dispatch)</p>
          <h3 className="text-2xl font-extrabold text-[#FF6B35] tabular-nums font-display">
            {incomingQueue.length} Orders
          </h3>
          <p className="text-[11px] text-stone-400">Target prep time: ~20 mins</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-stone-500">Kitchen Sales Volume</p>
          <h3 className="text-2xl font-extrabold text-[#222222] tabular-nums font-display">
            ₦{kitchenSales.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#2E9D63] font-semibold">Excludes delivery logistics fee</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-stone-500">Customer Quality Score</p>
          <h3 className="text-2xl font-extrabold text-amber-500 tabular-nums font-display">
            ★ {restaurant.rating} / 5.0
          </h3>
          <p className="text-[11px] text-stone-400">{restaurant.reviewCount} customer ratings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'incoming'
              ? 'bg-white text-[#222222] shadow-2xs'
              : 'text-stone-500 hover:text-[#222222]'
          }`}
        >
          Live Kitchen Queue ({incomingQueue.length})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'menu'
              ? 'bg-white text-[#222222] shadow-2xs'
              : 'text-stone-500 hover:text-[#222222]'
          }`}
        >
          Menu Stock ({currentMenuItems.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'history'
              ? 'bg-white text-[#222222] shadow-2xs'
              : 'text-stone-500 hover:text-[#222222]'
          }`}
        >
          Completed ({pastOrders.length})
        </button>
      </div>

      {/* 1. INCOMING ORDERS QUEUE */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          {incomingQueue.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F7EE] text-[#2E9D63] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#222222]">Kitchen queue is all caught up!</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                New incoming orders placed by customers will appear here with instant sound and status actions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingQueue.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#FF6B35]">
                        {order.orderReference}
                      </span>
                      <p className="text-xs font-bold text-[#222222] mt-0.5">
                        {order.customerName} · {order.customerPhone}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FFF0EB] text-[#FF6B35]">
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-1.5 text-xs text-stone-700 bg-stone-50 p-3 rounded-xl">
                    {order.items.map((item) => (
                      <div key={item.cartItemId} className="flex justify-between">
                        <div>
                          <strong className="text-stone-900">{item.quantity}x</strong> {item.item.name}
                          {item.selectedSpice && (
                            <span className="text-stone-500 ml-1">({item.selectedSpice})</span>
                          )}
                          {item.selectedCustomizations.map((c) => (
                            <p key={c.groupId} className="text-[10px] text-stone-400 pl-4">
                              + {c.selectedOptions.map((o) => o.name).join(', ')}
                            </p>
                          ))}
                        </div>
                        <span className="font-semibold tabular-nums text-stone-900">
                          ₦{item.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {order.deliveryInstructions && (
                      <p className="text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded-lg border border-amber-200/60 mt-1 italic">
                        Note: "{order.deliveryInstructions}"
                      </p>
                    )}
                  </div>

                  {/* Kitchen Status Advancement Controls */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {order.orderStatus === 'placed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'restaurant_accepted')}
                        className="flex-1 py-2 rounded-xl bg-[#2E9D63] text-white text-xs font-bold hover:bg-[#258252] transition-colors"
                      >
                        Accept Order
                      </button>
                    )}

                    {order.orderStatus === 'restaurant_accepted' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="flex-1 py-2 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85924] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Flame className="w-4 h-4" />
                        <span>Start Cooking</span>
                      </button>
                    )}

                    {order.orderStatus === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready_for_pickup')}
                        className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Package className="w-4 h-4" />
                        <span>Ready for Pickup</span>
                      </button>
                    )}

                    {order.orderStatus === 'ready_for_pickup' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                        className="flex-1 py-2 rounded-xl bg-[#222222] text-white text-xs font-bold hover:bg-[#333333] transition-colors"
                      >
                        Hand to Dispatch Rider
                      </button>
                    )}

                    {order.orderStatus === 'out_for_delivery' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="flex-1 py-2 rounded-xl bg-[#2E9D63] text-white text-xs font-bold hover:bg-[#258252] transition-colors"
                      >
                        Mark as Delivered
                      </button>
                    )}

                    <button
                      onClick={() => openOrderTracking(order.id)}
                      className="px-3 py-2 rounded-xl border border-stone-200 text-stone-600 hover:text-[#222222] text-xs font-semibold"
                    >
                      View Live Map
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. MENU STOCK AVAILABILITY TAB */}
      {activeTab === 'menu' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#222222] uppercase tracking-wider">
              Dishes & Stock Availability
            </h3>
            <button
              onClick={() => setIsAddMealOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85924] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Meal to Menu</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentMenuItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-stone-200/90 flex flex-col justify-between space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#222222] truncate">{item.name}</h4>
                    <p className="text-xs font-extrabold text-[#FF6B35] tabular-nums mt-0.5">
                      ₦{item.price.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-stone-400 block">{item.category}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <button
                    onClick={() => updateMenuItem(item.id, { isAvailable: !item.isAvailable })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      item.isAvailable
                        ? 'bg-[#E8F7EE] text-[#2E9D63]'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {item.isAvailable ? 'In Stock' : 'Sold Out'}
                  </button>
                  <span className="text-[11px] text-stone-400">
                    Prep: {item.prepTimeMinutes}m
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. COMPLETED ORDER HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-[#222222] uppercase tracking-wider">
            Completed Orders Archive
          </h3>
          <div className="space-y-2">
            {pastOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-xl border border-stone-100 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-[#FF6B35]">{ord.orderReference}</span>
                  <span className="text-stone-400 mx-2">·</span>
                  <span className="text-stone-800 font-semibold">{ord.customerName}</span>
                  <p className="text-[11px] text-stone-400">{ord.createdAt}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#222222] tabular-nums">
                    ₦{ord.total.toLocaleString()}
                  </p>
                  <span className="text-[10px] font-bold text-[#2E9D63]">Delivered</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Meal Modal */}
      {isAddMealOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-[#222222]">Add New Dish to Menu</h3>
              <button onClick={() => setIsAddMealOpen(false)} className="text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateMeal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  placeholder="e.g. Asun Fried Rice Special"
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                  required
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Appetizing description..."
                  value={newMealDesc}
                  onChange={(e) => setNewMealDesc(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Price (₦)</label>
                  <input
                    type="number"
                    value={newMealPrice}
                    onChange={(e) => setNewMealPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newMealCat}
                    onChange={(e) => setNewMealCat(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  >
                    <option value="Nigerian Dishes">Nigerian Dishes</option>
                    <option value="Rice & Noodles">Rice & Noodles</option>
                    <option value="Chicken & Grills">Chicken & Grills</option>
                    <option value="Burgers & Pizza">Burgers & Pizza</option>
                    <option value="Snacks & Small Chops">Snacks & Small Chops</option>
                    <option value="Chilled Drinks">Chilled Drinks</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85924] mt-2"
              >
                Add Meal to Restaurant
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
