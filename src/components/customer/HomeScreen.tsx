import React, { useState } from 'react';
import {
  ArrowRight,
  Clock,
  Flame,
  Heart,
  MapPin,
  Percent,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Tag,
  Truck,
  Utensils,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FOOD_CATEGORIES, HERO_IMAGE } from '../../data/mockData';
import { MenuItem, Restaurant } from '../../types';

export const HomeScreen: React.FC = () => {
  const {
    user,
    selectedLocation,
    setIsLocationModalOpen,
    restaurants,
    menuItems,
    orders,
    openRestaurantPage,
    setActiveTab,
    toggleFavoriteRestaurant,
    isRestaurantFavorite,
    setCustomizerMeal,
    reorderItems,
  } = useApp();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('cat-all');

  // Greeting based on Nigerian local hour
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  const customerName = user ? user.name.split(' ')[0] : 'Craver';

  // Popular restaurants
  const popularRestaurants = restaurants.filter((r) => r.isFeatured || r.rating >= 4.8);

  // Best selling meals
  const bestSellers = menuItems.filter((m) => m.isBestSeller || m.isPopular).slice(0, 4);

  // Recommended meals
  const recommendedDishes = menuItems.slice(0, 6);

  // Recently ordered meals
  const recentOrders = orders.slice(0, 2);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('explore');
  };

  const getRestaurantForItem = (item: MenuItem): Restaurant => {
    return restaurants.find((r) => r.id === item.restaurantId) || restaurants[0];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-8 animate-fade-in">
      {/* 1. Header Location & Personalized Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="group flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-[#FF6B35] transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
            <span className="font-bold text-[#222222] group-hover:text-[#FF6B35]">
              {selectedLocation.area}, {selectedLocation.city}
            </span>
            <span className="text-[11px] text-stone-400">· Change area</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] font-display mt-1 tracking-tight">
            {greeting}, <span className="text-[#FF6B35]">{customerName}</span>! Hungry?
          </h1>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="What are you craving today?"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-11 pr-24 py-3 bg-white border border-stone-200/90 rounded-2xl text-xs sm:text-sm text-[#222222] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] shadow-2xs transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85924] transition-colors"
          >
            Find Food
          </button>
        </form>
      </div>

      {/* 2. Hero Promotional Campaign Showcase */}
      <div className="relative rounded-3xl overflow-hidden bg-[#222222] text-white shadow-xl min-h-[220px] sm:min-h-[260px] flex items-center">
        <img
          src={HERO_IMAGE}
          alt="Authentic Nigerian Jollof Feast"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 max-w-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B35] text-white text-[11px] font-extrabold uppercase tracking-wider">
              Limited Offer
            </span>
            <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-current" /> Use promo WELCOME20
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight tracking-tight">
            Smokey Party Jollof & Sizzling Grills
          </h2>

          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Get 20% off authentic Nigerian firewood jollof, succulent beef suya, and plantain combos. Delivered steaming hot to your doorstep.
          </p>

          <div className="pt-2">
            <button
              onClick={() => openRestaurantPage('rest-1')}
              className="px-5 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85924] text-white text-xs font-bold shadow-md shadow-[#FF6B35]/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Order Smokey Jollof Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Food Categories Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#222222] tracking-tight">Browse Categories</h2>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs font-semibold text-[#FF6B35] hover:underline"
          >
            See all
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          {FOOD_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveTab('explore');
                }}
                className={`flex flex-col items-center p-3 rounded-2xl border min-w-[100px] text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#FF6B35] shadow-xs'
                    : 'bg-white/80 border-stone-200/80 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                    isSelected ? 'bg-[#FFF0EB] text-[#FF6B35]' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  <Utensils className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-xs font-bold text-[#222222] leading-tight truncate w-full">
                  {cat.name}
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5">{cat.count} meals</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Popular Restaurants Carousel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#222222] tracking-tight">Popular Restaurants</h2>
            <p className="text-xs text-stone-500">Top-rated spots loved by local foodies</p>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs font-semibold text-[#FF6B35] hover:underline flex items-center gap-1"
          >
            <span>Explore all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularRestaurants.slice(0, 3).map((restaurant) => {
            const isFav = isRestaurantFavorite(restaurant.id);
            return (
              <div
                key={restaurant.id}
                onClick={() => openRestaurantPage(restaurant.id)}
                className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#FF6B35]/40 transition-all cursor-pointer group flex flex-col"
              >
                {/* Cover & Badges */}
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={restaurant.coverImage}
                    alt={restaurant.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Free delivery or discount badge */}
                  {restaurant.discountBadge && (
                    <span className="absolute top-3 left-3 bg-[#FF6B35] text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-xs">
                      {restaurant.discountBadge}
                    </span>
                  )}

                  {/* Favorite toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteRestaurant(restaurant.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-600 hover:text-red-500 transition-colors shadow-xs"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'text-red-500 fill-red-500' : ''}`} />
                  </button>

                  <div className="absolute bottom-2.5 left-3 text-white flex items-center gap-1.5 text-xs font-semibold">
                    <span className="text-xl">{restaurant.logo}</span>
                    <span className="truncate">{restaurant.area}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-[#222222] group-hover:text-[#FF6B35] transition-colors truncate">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{restaurant.rating}</span>
                        <span className="text-stone-400 font-normal">({restaurant.reviewCount})</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                      {restaurant.cuisines.join(' · ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100 text-xs text-stone-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} mins
                    </span>
                    <span className="font-semibold tabular-nums text-stone-800">
                      {restaurant.hasFreeDelivery ? (
                        <span className="text-[#2E9D63] font-bold">Free Delivery</span>
                      ) : (
                        `₦${restaurant.deliveryFee} delivery`
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Recommended Dishes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#222222] tracking-tight">Recommended For You</h2>
            <p className="text-xs text-stone-500">Mouth-watering dishes prepared fresh to order</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedDishes.map((item) => {
            const rest = getRestaurantForItem(item);
            return (
              <div
                key={item.id}
                onClick={() => setCustomizerMeal({ item, restaurant: rest })}
                className="bg-white rounded-2xl border border-stone-200/90 p-3.5 flex gap-3.5 hover:border-[#FF6B35]/40 hover:shadow-xs transition-all cursor-pointer group"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <span className="text-[10px] font-semibold text-stone-400 block truncate">
                      {rest.name}
                    </span>
                    <h4 className="text-xs font-bold text-[#222222] group-hover:text-[#FF6B35] transition-colors leading-snug line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-extrabold text-[#222222] tabular-nums">
                      ₦{item.price.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomizerMeal({ item, restaurant: rest });
                      }}
                      className="w-7 h-7 rounded-lg bg-[#FFF0EB] text-[#FF6B35] group-hover:bg-[#FF6B35] group-hover:text-white transition-all flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Special Combos & Promo Banner */}
      <div className="p-6 rounded-3xl bg-[#FFF0EB] border border-[#FF6B35]/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6B35] text-white flex items-center justify-center shrink-0">
            <Percent className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#222222]">Save with Crave with Vee Promo Codes</h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Use code <span className="font-mono font-bold text-[#FF6B35]">CRAVEVEE500</span> for ₦500 off orders over ₦3,000.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('explore')}
          className="px-5 py-2.5 rounded-xl bg-[#222222] hover:bg-[#333333] text-white text-xs font-bold transition-colors whitespace-nowrap"
        >
          View Eligible Meals
        </button>
      </div>

      {/* 7. Recently Ordered Meals Section (if any past orders) */}
      {recentOrders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-[#222222] tracking-tight">Order Again</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white p-4 rounded-2xl border border-stone-200/90 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={ord.restaurant.coverImage}
                    alt={ord.restaurant.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#222222] truncate">
                      {ord.restaurant.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">
                      {ord.items.map((i) => i.item.name).join(', ')}
                    </p>
                    <span className="text-xs font-bold text-[#FF6B35] tabular-nums mt-0.5 block">
                      ₦{ord.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => reorderItems(ord)}
                  className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-[#FFF0EB] hover:text-[#FF6B35] text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
