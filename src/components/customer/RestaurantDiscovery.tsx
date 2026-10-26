import React, { useState } from 'react';
import {
  Clock,
  Filter,
  Heart,
  Search,
  SlidersHorizontal,
  Star,
  Store,
  Truck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FOOD_CATEGORIES } from '../../data/mockData';

export const RestaurantDiscovery: React.FC = () => {
  const {
    restaurants,
    menuItems,
    openRestaurantPage,
    toggleFavoriteRestaurant,
    isRestaurantFavorite,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'deliveryTime' | 'deliveryFee' | 'popular'>('popular');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [onlyFreeDelivery, setOnlyFreeDelivery] = useState(false);
  const [priceMaxDelivery, setPriceMaxDelivery] = useState<number>(1000);

  // Filter restaurants
  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      // Search matching restaurant name, cuisine or food item
      const matchesName = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCuisine = restaurant.cuisines.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesArea = restaurant.area.toLowerCase().includes(searchQuery.toLowerCase());

      // Also check if any dish in this restaurant matches the search query
      const matchesDish = menuItems.some(
        (m) =>
          m.restaurantId === restaurant.id &&
          (m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      const matchesSearch = !searchQuery || matchesName || matchesCuisine || matchesArea || matchesDish;

      // Category filter
      const matchesCategory =
        selectedCategory === 'All' ||
        restaurant.cuisines.some((c) => c.toLowerCase().includes(selectedCategory.toLowerCase()));

      // Open now filter
      const matchesOpen = !onlyOpen || restaurant.isOpen;

      // Free delivery filter
      const matchesFreeDelivery = !onlyFreeDelivery || restaurant.hasFreeDelivery;

      // Delivery fee cap
      const matchesFee = restaurant.hasFreeDelivery || restaurant.deliveryFee <= priceMaxDelivery;

      return matchesSearch && matchesCategory && matchesOpen && matchesFreeDelivery && matchesFee;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'deliveryTime') return a.deliveryTimeMin - b.deliveryTimeMin;
      if (sortBy === 'deliveryFee') {
        const feeA = a.hasFreeDelivery ? 0 : a.deliveryFee;
        const feeB = b.hasFreeDelivery ? 0 : b.deliveryFee;
        return feeA - feeB;
      }
      return b.reviewCount - a.reviewCount; // popular
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] font-display">
          Discover Food & Restaurants
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Explore {restaurants.length} kitchens and fast deliveries across Lagos and Abuja
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
        {/* Main Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by restaurant name, cuisine (e.g. Suya, Egusi, Burgers) or dish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories scrollable pill list */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {['All', ...FOOD_CATEGORIES.slice(1).map((c) => c.name)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#FF6B35] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
          {/* Quick toggle chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setOnlyOpen(!onlyOpen)}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                onlyOpen
                  ? 'bg-[#E8F7EE] border-[#2E9D63] text-[#2E9D63]'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              ● Open Now
            </button>
            <button
              onClick={() => setOnlyFreeDelivery(!onlyFreeDelivery)}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                onlyFreeDelivery
                  ? 'bg-[#FFF0EB] border-[#FF6B35] text-[#FF6B35]'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              Free Delivery
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-semibold text-xs">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="deliveryTime">Fastest Delivery</option>
              <option value="deliveryFee">Lowest Delivery Fee</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Showing <strong className="text-stone-900">{filteredRestaurants.length}</strong>{' '}
          restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
        </span>
        {(searchQuery || selectedCategory !== 'All' || onlyOpen || onlyFreeDelivery) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setOnlyOpen(false);
              setOnlyFreeDelivery(false);
            }}
            className="text-[#FF6B35] font-semibold hover:underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Restaurants Grid */}
      {filteredRestaurants.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Store className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#222222]">No restaurants match your filters</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try resetting your search query or enabling restaurants outside your current filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setOnlyOpen(false);
              setOnlyFreeDelivery(false);
            }}
            className="px-4 py-2 bg-[#FF6B35] text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => {
            const isFav = isRestaurantFavorite(restaurant.id);
            return (
              <div
                key={restaurant.id}
                onClick={() => openRestaurantPage(restaurant.id)}
                className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#FF6B35]/40 transition-all cursor-pointer group flex flex-col"
              >
                {/* Cover Image & Badges */}
                <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={restaurant.coverImage}
                    alt={restaurant.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    {restaurant.discountBadge && (
                      <span className="bg-[#FF6B35] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg shadow-xs">
                        {restaurant.discountBadge}
                      </span>
                    )}
                    {!restaurant.isOpen && (
                      <span className="bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Closed for orders
                      </span>
                    )}
                  </div>

                  {/* Favorite button */}
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

                  <div className="absolute bottom-3 left-3 text-white flex items-center gap-2 text-xs font-semibold">
                    <span className="text-2xl">{restaurant.logo}</span>
                    <span className="font-bold">{restaurant.area}</span>
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
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

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} mins
                    </span>
                    <span className="font-semibold tabular-nums text-stone-900">
                      {restaurant.hasFreeDelivery ? (
                        <span className="text-[#2E9D63] font-bold">Free Delivery</span>
                      ) : (
                        `₦${restaurant.deliveryFee}`
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
