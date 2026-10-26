import React, { useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  DollarSign,
  Eye,
  Flame,
  LayoutDashboard,
  Percent,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Store,
  Tag,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Truck,
  Users,
  Utensils,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem, OrderStatus, PromoCode, Restaurant } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    restaurants,
    menuItems,
    promoCodes,
    updateOrderStatus,
    updateRestaurant,
    addRestaurant,
    updateMenuItem,
    addMenuItem,
    addPromoCode,
    setCurrentRole,
    openOrderTracking,
    showToast,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'restaurants' | 'menu' | 'promos'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // New restaurant modal
  const [isAddRestOpen, setIsAddRestOpen] = useState(false);
  const [restName, setRestName] = useState('');
  const [restTagline, setRestTagline] = useState('');
  const [restArea, setRestArea] = useState('Victoria Island');
  const [restFee, setRestFee] = useState(700);

  // New promo modal
  const [isAddPromoOpen, setIsAddPromoOpen] = useState(false);
  const [promoCodeName, setPromoCodeName] = useState('');
  const [promoValue, setPromoValue] = useState(500);
  const [promoMin, setPromoMin] = useState(3000);

  // Summary Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter((o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;
  const activeRestaurantsCount = restaurants.filter((r) => r.isOpen).length;

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === 'all' || o.orderStatus === orderFilter;
    const matchesSearch =
      o.orderReference.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.restaurant.name.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restName.trim()) return;

    addRestaurant({
      name: restName,
      tagline: restTagline || 'Authentic dishes made fresh',
      description: 'Delicious cuisine prepared in our registered commercial kitchen.',
      logo: '🍲',
      coverImage: '/src/assets/images/chopnow_hero_jollof_feast_1793016288023.jpg',
      rating: 4.8,
      reviewCount: 1,
      cuisines: ['Nigerian Dishes', 'Fast Food'],
      deliveryTimeMin: 25,
      deliveryTimeMax: 35,
      deliveryFee: Number(restFee),
      minimumOrder: 2500,
      isOpen: true,
      openingHours: '10:00 AM - 10:00 PM',
      address: `Central Hub, ${restArea}`,
      area: restArea,
      city: 'Lagos',
      isFeatured: false,
      hasFreeDelivery: false,
    });
    setRestName('');
    setRestTagline('');
    setIsAddRestOpen(false);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeName.trim()) return;

    addPromoCode({
      code: promoCodeName.toUpperCase().trim(),
      description: `₦${promoValue.toLocaleString()} discount on qualifying orders`,
      discountType: 'fixed',
      discountValue: Number(promoValue),
      minimumOrder: Number(promoMin),
      isActive: true,
    });
    setPromoCodeName('');
    setIsAddPromoOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#222222] text-white flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#222222] font-display">
                Crave with Vee Master Admin Console
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Live Admin Mode
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Operations control, platform sales, restaurant catalog, and delivery queue
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentRole('customer')}
          className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Customer App</span>
        </button>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-stone-500 flex items-center justify-between">
            <span>Total Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-[#2E9D63]" />
          </p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#222222] tabular-nums font-display">
            ₦{totalRevenue.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#2E9D63] font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +18.4% vs last week
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-stone-500 flex items-center justify-between">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#FF6B35]" />
          </p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#222222] tabular-nums font-display">
            {totalOrdersCount}
          </h3>
          <p className="text-[11px] text-stone-400 font-medium">
            {activeOrdersCount} in delivery transit
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-stone-500 flex items-center justify-between">
            <span>Active Kitchens</span>
            <Store className="w-4 h-4 text-amber-500" />
          </p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#222222] tabular-nums font-display">
            {activeRestaurantsCount} / {restaurants.length}
          </h3>
          <p className="text-[11px] text-stone-400 font-medium">Lagos & Abuja hubs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-stone-500 flex items-center justify-between">
            <span>Customer Base</span>
            <Users className="w-4 h-4 text-blue-500" />
          </p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#222222] tabular-nums font-display">
            1,420
          </h3>
          <p className="text-[11px] text-stone-400 font-medium">98.2% customer retention</p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-2xl max-w-lg overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeAdminTab === 'orders'
              ? 'bg-white text-[#222222] shadow-2xs'
              : 'text-stone-500 hover:text-[#222222]'
          }`}
        >
          Orders & Dispatch ({orders.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('restaurants')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeAdminTab === 'restaurants'
              ? 'bg-white text-[#222222] shadow-2xs'
              : 'text-stone-500 hover:text-[#222222]'
          }`}
        >
          Restaurants ({restaurants.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('menu')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeAdminTab === 'menu'
              ? 'bg-white text-[#222222] shadow-2xs'
              : 'text-stone-500 hover:text-[#222222]'
          }`}
        >
          Dishes Catalog ({menuItems.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('promos')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeAdminTab === 'promos'
              ? 'bg-white text-[#222222] shadow-2xs'
              : 'text-stone-500 hover:text-[#222222]'
          }`}
        >
          Promo Codes ({promoCodes.length})
        </button>
      </div>

      {/* 1. ORDERS MANAGEMENT TAB */}
      {activeAdminTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-[#222222] uppercase tracking-wider">
              Live Order Management
            </h3>

            {/* Filter and Search */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search by CN-Ref, customer or kitchen..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#222222] w-52 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="placed">Placed</option>
                <option value="preparing">Preparing</option>
                <option value="ready_for_pickup">Ready for Pickup</option>
                <option value="out_for_delivery">On the way</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-3">Order Ref</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Restaurant</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Live Status</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#FF6B35]">
                      {ord.orderReference}
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-[#222222]">{ord.customerName}</p>
                      <p className="text-[10px] text-stone-400">{ord.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-stone-800">
                      {ord.restaurant.name}
                    </td>
                    <td className="py-3.5 px-3 text-stone-600 max-w-xs truncate">
                      {ord.items.map((i) => `${i.quantity}x ${i.item.name}`).join(', ')}
                    </td>
                    <td className="py-3.5 px-3 font-extrabold tabular-nums text-stone-900">
                      ₦{ord.total.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold py-1 px-2.5 rounded-lg border transition-colors ${
                          ord.orderStatus === 'delivered'
                            ? 'bg-[#E8F7EE] border-[#2E9D63]/30 text-[#2E9D63]'
                            : 'bg-[#FFF0EB] border-[#FF6B35]/30 text-[#FF6B35]'
                        }`}
                      >
                        <option value="placed">Order Placed</option>
                        <option value="payment_confirmed">Payment Confirmed</option>
                        <option value="restaurant_accepted">Restaurant Accepted</option>
                        <option value="preparing">Food Being Prepared</option>
                        <option value="ready_for_pickup">Ready for Pickup</option>
                        <option value="rider_assigned">Rider Assigned</option>
                        <option value="out_for_delivery">On The Way</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => openOrderTracking(ord.id)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-[#FFF0EB] text-stone-600 hover:text-[#FF6B35] transition-colors"
                        title="View live tracking"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. RESTAURANTS MANAGEMENT TAB */}
      {activeAdminTab === 'restaurants' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#222222] uppercase tracking-wider">
              Restaurant Listings & Fees
            </h3>
            <button
              onClick={() => setIsAddRestOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85924] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Restaurant</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {restaurants.map((rest) => (
              <div
                key={rest.id}
                className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{rest.logo}</span>
                    <div>
                      <h4 className="text-sm font-bold text-[#222222]">{rest.name}</h4>
                      <p className="text-[11px] text-stone-400">{rest.area}, {rest.city}</p>
                    </div>
                  </div>

                  {/* Open / Closed Toggle */}
                  <button
                    onClick={() => updateRestaurant(rest.id, { isOpen: !rest.isOpen })}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                      rest.isOpen
                        ? 'bg-[#E8F7EE] text-[#2E9D63]'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    <span>{rest.isOpen ? 'Open' : 'Closed'}</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                  <div className="flex justify-between items-center">
                    <span>Delivery Fee:</span>
                    <input
                      type="number"
                      value={rest.deliveryFee}
                      onChange={(e) =>
                        updateRestaurant(rest.id, { deliveryFee: Number(e.target.value) })
                      }
                      className="w-20 p-1 bg-stone-50 border border-stone-200 rounded-lg text-right font-bold text-xs"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Free Delivery:</span>
                    <button
                      onClick={() =>
                        updateRestaurant(rest.id, { hasFreeDelivery: !rest.hasFreeDelivery })
                      }
                      className="text-xs font-semibold text-[#FF6B35]"
                    >
                      {rest.hasFreeDelivery ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MENU ITEMS CATALOG TAB */}
      {activeAdminTab === 'menu' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#222222] uppercase tracking-wider">
              Food Item Availability & Pricing
            </h3>
            <span className="text-xs text-stone-500">{menuItems.length} menu items listed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => {
              const rest = restaurants.find((r) => r.id === item.restaurantId);
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-stone-200/90 bg-white flex flex-col justify-between space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-semibold text-stone-400 block truncate">
                        {rest?.name}
                      </span>
                      <h4 className="text-xs font-bold text-[#222222] truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-[#222222] tabular-nums">
                          ₦{item.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-stone-400">· {item.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <button
                      onClick={() => updateMenuItem(item.id, { isAvailable: !item.isAvailable })}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                        item.isAvailable
                          ? 'bg-[#E8F7EE] text-[#2E9D63]'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {item.isAvailable ? 'In Stock' : 'Sold Out'}
                    </button>

                    <button
                      onClick={() => updateMenuItem(item.id, { isPopular: !item.isPopular })}
                      className={`text-[11px] font-semibold ${
                        item.isPopular ? 'text-[#FF6B35]' : 'text-stone-400'
                      }`}
                    >
                      {item.isPopular ? '★ Popular' : 'Make Popular'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. PROMO CODES TAB */}
      {activeAdminTab === 'promos' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#222222] uppercase tracking-wider">
              Promo Codes & Discount Campaigns
            </h3>
            <button
              onClick={() => setIsAddPromoOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85924] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Promo Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promoCodes.map((p) => (
              <div
                key={p.code}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-sm text-[#FF6B35] bg-white px-2.5 py-1 rounded-lg border border-[#FF6B35]/20">
                    {p.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F7EE] text-[#2E9D63]">
                    Active
                  </span>
                </div>
                <p className="text-xs text-stone-600">{p.description}</p>
                <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-200 flex justify-between">
                  <span>Min Order: ₦{p.minimumOrder.toLocaleString()}</span>
                  <span className="font-bold text-stone-700 capitalize">{p.discountType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Restaurant Modal */}
      {isAddRestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-[#222222]">Add New Partner Restaurant</h3>
              <button onClick={() => setIsAddRestOpen(false)} className="text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateRestaurant} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Kitchen Name</label>
                <input
                  type="text"
                  placeholder="e.g. Calabar Kitchen Express"
                  value={restName}
                  onChange={(e) => setRestName(e.target.value)}
                  required
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Authentic Afang & Edikang Ikong soup"
                  value={restTagline}
                  onChange={(e) => setRestTagline(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Area</label>
                  <select
                    value={restArea}
                    onChange={(e) => setRestArea(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  >
                    <option value="Victoria Island">Victoria Island</option>
                    <option value="Lekki Phase 1">Lekki Phase 1</option>
                    <option value="Ikeja GRA">Ikeja GRA</option>
                    <option value="Wuse 2">Wuse 2 (Abuja)</option>
                    <option value="Maitama">Maitama (Abuja)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Delivery Fee (₦)
                  </label>
                  <input
                    type="number"
                    value={restFee}
                    onChange={(e) => setRestFee(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85924] mt-2"
              >
                Create Restaurant Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Promo Modal */}
      {isAddPromoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-[#222222]">Create Discount Promo Code</h3>
              <button onClick={() => setIsAddPromoOpen(false)} className="text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreatePromo} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. FLASH1000"
                  value={promoCodeName}
                  onChange={(e) => setPromoCodeName(e.target.value)}
                  required
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase font-mono font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Discount Amount (₦)
                  </label>
                  <input
                    type="number"
                    value={promoValue}
                    onChange={(e) => setPromoValue(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Minimum Order (₦)
                  </label>
                  <input
                    type="number"
                    value={promoMin}
                    onChange={(e) => setPromoMin(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85924] mt-2"
              >
                Activate Promo Code
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
