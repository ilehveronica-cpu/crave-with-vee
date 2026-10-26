import React, { useState } from 'react';
import { Heart, Plus, Star, Store, Trash2, Utensils } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FavoritesView: React.FC = () => {
  const {
    favorites,
    restaurants,
    menuItems,
    openRestaurantPage,
    toggleFavoriteRestaurant,
    toggleFavoriteDish,
    setCustomizerMeal,
    setActiveTab,
  } = useApp();

  const [favTab, setFavTab] = useState<'restaurants' | 'dishes'>('restaurants');

  const favoriteRestaurantsList = restaurants.filter((r) => favorites.restaurants.includes(r.id));
  const favoriteDishesList = menuItems.filter((m) => favorites.dishes.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] font-display">
          Your Saved Favorites
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Quickly re-visit your best-loved Nigerian kitchens and signature dishes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-2xl max-w-xs">
        <button
          onClick={() => setFavTab('restaurants')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            favTab === 'restaurants'
              ? 'bg-white text-[#222222] shadow-2xs'
              : 'text-stone-500 hover:text-[#222222]'
          }`}
        >
          Restaurants ({favoriteRestaurantsList.length})
        </button>
        <button
          onClick={() => setFavTab('dishes')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            favTab === 'dishes'
              ? 'bg-white text-[#222222] shadow-2xs'
              : 'text-stone-500 hover:text-[#222222]'
          }`}
        >
          Meals ({favoriteDishesList.length})
        </button>
      </div>

      {/* Restaurants List */}
      {favTab === 'restaurants' && (
        <div>
          {favoriteRestaurantsList.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF0EB] text-[#FF6B35] flex items-center justify-center mx-auto">
                <Store className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#222222]">No saved restaurants</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Tap the heart icon on any restaurant card to save it here for fast access.
              </p>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-5 py-2 rounded-xl bg-[#FF6B35] text-white text-xs font-bold"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoriteRestaurantsList.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => openRestaurantPage(restaurant.id)}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="relative h-44 w-full bg-stone-100">
                    <img
                      src={restaurant.coverImage}
                      alt={restaurant.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteRestaurant(restaurant.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-red-500 shadow-xs"
                      title="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                    <div className="absolute bottom-3 left-3 text-white flex items-center gap-1.5 text-xs font-bold">
                      <span className="text-xl">{restaurant.logo}</span>
                      <span>{restaurant.name}</span>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between text-xs">
                    <span className="text-stone-500">{restaurant.cuisines.join(', ')}</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" /> {restaurant.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dishes List */}
      {favTab === 'dishes' && (
        <div>
          {favoriteDishesList.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF0EB] text-[#FF6B35] flex items-center justify-center mx-auto">
                <Utensils className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#222222]">No saved meals</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Save your favorite jollof, soups, burgers, or grills to order them in seconds.
              </p>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-5 py-2 rounded-xl bg-[#FF6B35] text-white text-xs font-bold"
              >
                Find Meals
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoriteDishesList.map((dish) => {
                const rest = restaurants.find((r) => r.id === dish.restaurantId) || restaurants[0];
                return (
                  <div
                    key={dish.id}
                    onClick={() => setCustomizerMeal({ item: dish, restaurant: rest })}
                    className="bg-white rounded-2xl border border-stone-200 p-3.5 flex gap-3.5 hover:border-[#FF6B35]/40 transition-all cursor-pointer group"
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-stone-400 truncate">
                            {rest.name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavoriteDish(dish.id);
                            }}
                            className="text-stone-300 hover:text-red-500"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-xs font-bold text-[#222222] group-hover:text-[#FF6B35] transition-colors leading-snug line-clamp-1">
                          {dish.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                          {dish.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-extrabold text-[#222222] tabular-nums">
                          ₦{dish.price.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomizerMeal({ item: dish, restaurant: rest });
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
          )}
        </div>
      )}
    </div>
  );
};
