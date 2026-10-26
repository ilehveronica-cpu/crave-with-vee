import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Heart,
  MapPin,
  Search,
  Star,
  Store,
  Tag,
  Truck,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem } from '../../types';

export const RestaurantDetail: React.FC = () => {
  const {
    selectedRestaurantId,
    restaurants,
    menuItems,
    reviews,
    setActiveTab,
    toggleFavoriteRestaurant,
    isRestaurantFavorite,
    setCustomizerMeal,
  } = useApp();

  const [activeMenuCategory, setActiveMenuCategory] = useState<string>('All');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [activeTabSub, setActiveTabSub] = useState<'menu' | 'reviews'>('menu');

  const restaurant = restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0];

  if (!restaurant) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-bold text-stone-700">Restaurant not found.</p>
        <button
          onClick={() => setActiveTab('explore')}
          className="mt-3 px-4 py-2 bg-[#FF6B35] text-white rounded-xl text-xs font-bold"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const isFav = isRestaurantFavorite(restaurant.id);
  const restaurantMenuItems = menuItems.filter((m) => m.restaurantId === restaurant.id);
  const restaurantReviews = reviews.filter((rev) => {
    // Show sample reviews or matching reviews
    return true;
  });

  // Extract unique categories available in this restaurant
  const categories = ['All', ...Array.from(new Set(restaurantMenuItems.map((m) => m.category)))];

  const filteredItems = restaurantMenuItems.filter((item) => {
    const matchesCat = activeMenuCategory === 'All' || item.category === activeMenuCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-6">
      {/* Back button & Breadcrumb */}
      <button
        onClick={() => setActiveTab('explore')}
        className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#222222] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Restaurants</span>
      </button>

      {/* Cover Banner & Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs">
        <div className="relative h-56 sm:h-72 w-full bg-stone-900">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

          {/* Favorite button */}
          <button
            onClick={() => toggleFavoriteRestaurant(restaurant.id)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-700 hover:text-red-500 hover:bg-white transition-all shadow-sm"
          >
            <Heart className={`w-5 h-5 ${isFav ? 'text-red-500 fill-red-500' : ''}`} />
          </button>

          {/* Restaurant identity inside banner */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:bottom-6 flex items-end justify-between">
            <div className="flex items-end gap-3.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 shadow-lg shrink-0 flex items-center justify-center text-3xl sm:text-4xl">
                {restaurant.logo}
              </div>
              <div className="text-white">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-3xl font-extrabold font-display leading-tight">
                    {restaurant.name}
                  </h1>
                  {restaurant.isOpen ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F7EE] text-[#2E9D63]">
                      Open Now
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                      Closed
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-xl">
                  {restaurant.tagline}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="p-4 sm:p-6 bg-white border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-[#222222]">{restaurant.rating} / 5.0</p>
              <p className="text-[11px] text-stone-400">{restaurant.reviewCount} verified reviews</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0EB] text-[#FF6B35] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-[#222222]">
                {restaurant.deliveryTimeMin} - {restaurant.deliveryTimeMax} mins
              </p>
              <p className="text-[11px] text-stone-400">{restaurant.openingHours}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8F7EE] text-[#2E9D63] flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-[#222222]">
                {restaurant.hasFreeDelivery ? 'Free Delivery' : `₦${restaurant.deliveryFee}`}
              </p>
              <p className="text-[11px] text-stone-400">
                Min. order: ₦{restaurant.minimumOrder.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-xs text-[#222222] truncate">{restaurant.area}</p>
              <p className="text-[11px] text-stone-400 truncate">{restaurant.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Menu vs Reviews */}
      <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTabSub('menu')}
          className={`pb-2 text-sm font-bold transition-all relative ${
            activeTabSub === 'menu' ? 'text-[#FF6B35]' : 'text-stone-500 hover:text-[#222222]'
          }`}
        >
          Menu Catalogue ({restaurantMenuItems.length})
          {activeTabSub === 'menu' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35] rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTabSub('reviews')}
          className={`pb-2 text-sm font-bold transition-all relative ${
            activeTabSub === 'reviews' ? 'text-[#FF6B35]' : 'text-stone-500 hover:text-[#222222]'
          }`}
        >
          Customer Reviews ({restaurantReviews.length})
          {activeTabSub === 'reviews' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35] rounded-full" />
          )}
        </button>
      </div>

      {/* View: Menu View */}
      {activeTabSub === 'menu' && (
        <div className="space-y-6">
          {/* Menu Search and Categories filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveMenuCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeMenuCategory === cat
                      ? 'bg-[#222222] text-white shadow-2xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Search */}
            <div className="relative sm:w-64 shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search this menu..."
                value={menuSearchQuery}
                onChange={(e) => setMenuSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>
          </div>

          {/* Food Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-3xl border border-stone-200">
              <p className="text-sm font-bold text-stone-600">No dishes found in this category.</p>
              <button
                onClick={() => {
                  setActiveMenuCategory('All');
                  setMenuSearchQuery('');
                }}
                className="mt-2 text-xs font-semibold text-[#FF6B35] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setCustomizerMeal({ item, restaurant })}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#FF6B35]/40 transition-all cursor-pointer flex flex-col group"
                >
                  {/* Dish Image */}
                  <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.isPopular && (
                      <span className="absolute top-3 left-3 bg-[#FF6B35] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        Popular
                      </span>
                    )}
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Dish Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-[#222222] group-hover:text-[#FF6B35] transition-colors leading-snug">
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100">
                      <div>
                        <span className="text-sm font-extrabold text-[#222222] tabular-nums">
                          ₦{item.price.toLocaleString()}
                        </span>
                        {item.spiceLevels && (
                          <span className="text-[10px] text-stone-400 block">
                            Customizable spice
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCustomizerMeal({ item, restaurant });
                        }}
                        className="w-8 h-8 rounded-xl bg-[#FFF0EB] text-[#FF6B35] group-hover:bg-[#FF6B35] group-hover:text-white transition-all flex items-center justify-center shadow-2xs"
                        title="Customize & Add"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View: Reviews View */}
      {activeTabSub === 'reviews' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#222222]">Customer Ratings & Reviews</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Feedback verified exclusively from completed delivery orders
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold text-[#222222] font-display">
                {restaurant.rating}
              </span>
              <div>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-stone-400">
                  Based on {restaurant.reviewCount} customer ratings
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurantReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FFF0EB] text-[#FF6B35] font-bold text-xs flex items-center justify-center">
                      {rev.userName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#222222]">{rev.userName}</h4>
                      <p className="text-[10px] text-stone-400">{rev.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>
                {rev.dishName && (
                  <span className="inline-block text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                    Ordered: {rev.dishName}
                  </span>
                )}
                <p className="text-xs text-stone-600 leading-relaxed italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
