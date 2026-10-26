import React, { useState } from 'react';
import { MapPin, X, Check, Search, Navigation } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DELIVERY_AREAS } from '../../data/mockData';

export const LocationModal: React.FC = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, selectedLocation, setSelectedLocation, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<'All' | 'Lagos' | 'Abuja' | 'Port Harcourt'>('All');

  if (!isLocationModalOpen) return null;

  const filteredAreas = DELIVERY_AREAS.filter((loc) => {
    const matchesCity = selectedCity === 'All' || loc.city === selectedCity;
    const matchesSearch =
      loc.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const handleSelectArea = (item: (typeof DELIVERY_AREAS)[0]) => {
    setSelectedLocation({
      city: item.city,
      area: item.area,
      street: `Central ${item.area}`,
    });
    setIsLocationModalOpen(false);
    showToast(`Delivery location set to ${item.area}, ${item.city}`);
  };

  const handleUseCurrentLocation = () => {
    setSelectedLocation({
      city: 'Lagos',
      area: 'Lekki Phase 1',
      street: '15 Admiralty Way',
    });
    setIsLocationModalOpen(false);
    showToast('Detected current location: Admiralty Way, Lekki Phase 1');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFF9F3] border border-stone-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200/80 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFF0EB] text-[#FF6B35] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#222222]">Select Delivery Area</h2>
              <p className="text-xs text-stone-500">Find restaurants delivering fresh near you</p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Geo trigger */}
        <div className="p-6 bg-white space-y-3 border-b border-stone-200/80">
          <button
            onClick={handleUseCurrentLocation}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FFF0EB] text-[#FF6B35] hover:bg-[#FFE3D6] transition-colors text-sm font-semibold border border-[#FF6B35]/20"
          >
            <Navigation className="w-4 h-4 fill-current" />
            Use my current GPS location
          </button>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search area (e.g. Lekki, Wuse 2, Victoria Island)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all text-[#222222]"
            />
          </div>

          {/* City filter tabs */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
            {(['All', 'Lagos', 'Abuja', 'Port Harcourt'] as const).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCity === city
                    ? 'bg-[#222222] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Location List */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {filteredAreas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm font-medium text-stone-500">No delivery hubs matching your search.</p>
              <p className="text-xs text-stone-400 mt-1">Try searching for Lagos or Abuja.</p>
            </div>
          ) : (
            filteredAreas.map((loc) => {
              const isSelected = selectedLocation.city === loc.city && selectedLocation.area === loc.area;
              return (
                <button
                  key={`${loc.city}-${loc.area}`}
                  onClick={() => handleSelectArea(loc)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-white border-[#FF6B35] shadow-sm'
                      : 'bg-white/80 border-stone-200/80 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#FF6B35] text-white' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#222222]">{loc.area}</span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium">
                          {loc.city}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {loc.zone} · Avg Delivery: {loc.avgTime}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#2E9D63] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
