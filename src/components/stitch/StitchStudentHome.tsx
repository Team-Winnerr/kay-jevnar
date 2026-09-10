import React, { useState } from 'react';
import { MenuItem, FoodCategory } from '../../types';
import { useCart } from '../../context/CartContext';
import { getItemPriceINR } from '../../utils/price';
import { resolveFoodImage } from '../../utils/image';

interface StitchStudentHomeProps {
  menuItems: MenuItem[];
  loading: boolean;
  onOpenCart: () => void;
  onViewTracker: () => void;
}

export const StitchStudentHome: React.FC<StitchStudentHomeProps> = ({
  menuItems,
  loading,
  onOpenCart,
  onViewTracker,
}) => {
  const { items: cartItems, addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemToast, setAddedItemToast] = useState<string | null>(null);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotalINR = cartItems.reduce((sum, item) => {
    return sum + getItemPriceINR(item.menuItem) * item.quantity;
  }, 0);

  const handleAddToCart = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item);
    setAddedItemToast(item.name);
    setTimeout(() => setAddedItemToast(null), 2000);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ? true : item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col items-center">
      {/* Toast Notification */}
      {addedItemToast && (
        <div className="fixed top-20 z-50 bg-accent-crimson text-white font-label-md px-4 py-2 rounded-full border-2 border-on-surface shadow-[3px_3px_0px_#000] flex items-center gap-2 animate-bounce">
          <span>✓ Added {addedItemToast} to Tray!</span>
        </div>
      )}

      {/* Main Mobile/Tablet Device Canvas Wrapper */}
      <div className="w-full max-w-[480px] min-h-screen bg-[#FED97C] flex flex-col relative pb-32 border-x-2 border-on-surface shadow-[6px_0px_0px_0px_#0A0A0A]">
        {/* Main App Body */}
        <main className="px-4 flex flex-col gap-5 mt-4">
          {/* Neo-Brutalist Search Bar */}
          <section className="w-full">
            <div className="relative flex items-center bg-white rounded-2xl border-2 border-on-surface shadow-[3px_3px_0px_0px_#0A0A0A] p-1.5 transition-all focus-within:shadow-[4px_4px_0px_0px_#0A0A0A]">
              <span className="material-symbols-outlined ml-2 text-on-surface-variant text-2xl">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you craving today?..."
                className="w-full bg-transparent border-none focus:ring-0 px-2.5 py-1.5 font-body-sm text-sm text-on-surface placeholder:text-outline font-medium focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-2 text-xs font-bold text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              )}
              <div className="w-9 h-9 rounded-xl bg-accent-mustard border-2 border-on-surface flex items-center justify-center shadow-[2px_2px_0px_0px_#0A0A0A]">
                <span className="material-symbols-outlined text-on-surface text-lg">restaurant</span>
              </div>
            </div>
          </section>

          {/* Neo-Brutalist Category Filter Carousel */}
          <section className="w-full overflow-hidden -mx-4 px-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {/* All / Trending */}
              <button
                onClick={() => setSelectedCategory('All')}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-full border-2 border-on-surface font-label-md text-xs font-extrabold transition-all active:translate-x-[2px] active:translate-y-[2px] ${
                  selectedCategory === 'All'
                    ? 'bg-accent-crimson text-white shadow-[2px_2px_0px_0px_#0A0A0A]'
                    : 'bg-white text-on-surface shadow-[2px_2px_0px_0px_#0A0A0A] hover:-translate-y-0.5'
                }`}
              >
                <span>🔥</span>
                <span>Trending (All)</span>
              </button>

              {/* Burgers */}
              <button
                onClick={() => setSelectedCategory('Burgers')}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-full border-2 border-on-surface font-label-md text-xs font-extrabold transition-all active:translate-x-[2px] active:translate-y-[2px] ${
                  selectedCategory === 'Burgers'
                    ? 'bg-accent-crimson text-white shadow-[2px_2px_0px_0px_#0A0A0A]'
                    : 'bg-white text-on-surface shadow-[2px_2px_0px_0px_#0A0A0A] hover:-translate-y-0.5'
                }`}
              >
                <span>Burgers</span>
                <span>🍔</span>
              </button>

              {/* Sides */}
              <button
                onClick={() => setSelectedCategory('Sides')}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-full border-2 border-on-surface font-label-md text-xs font-extrabold transition-all active:translate-x-[2px] active:translate-y-[2px] ${
                  selectedCategory === 'Sides'
                    ? 'bg-accent-crimson text-white shadow-[2px_2px_0px_0px_#0A0A0A]'
                    : 'bg-[#fedb71] text-on-surface shadow-[2px_2px_0px_0px_#0A0A0A] hover:-translate-y-0.5'
                }`}
              >
                <span>Sides</span>
                <span>🍟</span>
              </button>

              {/* Desserts */}
              <button
                onClick={() => setSelectedCategory('Desserts')}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-full border-2 border-on-surface font-label-md text-xs font-extrabold transition-all active:translate-x-[2px] active:translate-y-[2px] ${
                  selectedCategory === 'Desserts'
                    ? 'bg-accent-crimson text-white shadow-[2px_2px_0px_0px_#0A0A0A]'
                    : 'bg-white text-on-surface shadow-[2px_2px_0px_0px_#0A0A0A] hover:-translate-y-0.5'
                }`}
              >
                <span>Desserts</span>
                <span>🍰</span>
              </button>

              {/* Drinks */}
              <button
                onClick={() => setSelectedCategory('Drinks')}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-full border-2 border-on-surface font-label-md text-xs font-extrabold transition-all active:translate-x-[2px] active:translate-y-[2px] ${
                  selectedCategory === 'Drinks'
                    ? 'bg-accent-crimson text-white shadow-[2px_2px_0px_0px_#0A0A0A]'
                    : 'bg-accent-cyan text-on-surface shadow-[2px_2px_0px_0px_#0A0A0A] hover:-translate-y-0.5'
                }`}
              >
                <span>Drinks</span>
                <span>🥤</span>
              </button>
            </div>
          </section>

          {/* Hero Promotional Card */}
          <section className="relative w-full rounded-2xl bg-accent-mustard border-2 border-on-surface shadow-[4px_4px_0px_0px_#0A0A0A] p-5 overflow-hidden">
            <div className="absolute right-3 top-3 rotate-12">
              <span className="bg-accent-crimson text-white font-label-sm text-[10px] px-2.5 py-1 rounded-full border-2 border-on-surface shadow-[2px_2px_0px_0px_#0A0A0A] font-extrabold uppercase tracking-wider inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-xs material-symbols-fill">star</span> MUST TRY
              </span>
            </div>
            <div className="relative z-10 max-w-[250px]">
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="inline-block bg-white text-on-surface font-label-sm text-[10px] px-2.5 py-0.5 rounded-full border-2 border-on-surface font-bold tracking-wide">
                  TODAY'S SPECIAL • 20% OFF
                </span>
                <span className="inline-block bg-[#2e7d32] text-white font-label-sm text-[10px] px-2 py-0.5 rounded-full border-2 border-on-surface font-extrabold tracking-wide">
                  100% PURE VEG 🟢
                </span>
              </div>
              <h1 className="font-headline-lg-mobile text-3xl font-extrabold text-on-surface tracking-wide uppercase leading-tight">
                SAVOR EVERY DELICIOUS BITE
              </h1>
              <p className="font-body-sm text-xs text-on-surface mt-1 font-medium leading-snug">
                100% Pure Veg gourmet paneer tikka, crispy smash patties & handcrafted cold brews.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => {
                    const firstItem = menuItems[0];
                    if (firstItem) addItem(firstItem);
                  }}
                  className="bg-accent-crimson text-white font-label-md text-xs font-extrabold px-4 py-2 rounded-full border-2 border-on-surface shadow-[3px_3px_0px_0px_#0A0A0A] hover:scale-105 active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center gap-1.5"
                >
                  <span>Order Combo</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <span className="font-display-xl-mobile text-2xl text-on-surface font-black leading-none">₹149</span>
              </div>
            </div>
            {/* Floating Appetizing Food Imagery */}
            <div className="absolute -right-3 -bottom-2 w-28 h-28 rotate-6">
              <img
                className="w-full h-full object-cover rounded-2xl border-2 border-on-surface shadow-[3px_3px_0px_0px_#0A0A0A]"
                alt="Cheeseburger Special"
                src="/items/paneer_burger.png"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    '/items/paneer_burger.png';
                }}
              />
            </div>
          </section>

          {/* Section Header */}
          <section className="flex justify-between items-end pt-1">
            <div>
              <span className="font-label-sm text-[11px] text-accent-crimson font-extrabold uppercase tracking-wider block">
                FRESH & CRAVEABLE
              </span>
              <h2 className="font-headline-lg-mobile text-2xl text-on-surface uppercase tracking-wide font-black">
                OUR TASTY MENU
              </h2>
            </div>
            <span className="text-xs font-bold text-on-surface-variant">
              {filteredItems.length} items
            </span>
          </section>

          {/* Bento 2-Column Grid for Menu Items */}
          {loading ? (
            <div className="py-12 text-center font-bold text-on-surface">
              <span className="material-symbols-outlined animate-spin text-3xl">refresh</span>
              <p className="mt-2 text-sm">Loading hot fresh canteen menu...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white border-2 border-on-surface rounded-2xl p-8 text-center shadow-[3px_3px_0px_0px_#0A0A0A]">
              <span className="text-3xl">🔍</span>
              <p className="mt-2 font-bold text-sm">No items found matching your filter</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-3 bg-accent-mustard px-4 py-1.5 rounded-full border-2 border-on-surface text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <section className="grid grid-cols-2 gap-3.5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`group relative bg-white rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] p-3.5 flex flex-col justify-between transition-all ${
                    !item.isAvailable ? 'opacity-65' : 'hover:-translate-y-1'
                  }`}
                >
                  {/* Image Container with Badges */}
                  <div className="relative w-full aspect-square bg-[#FFEBB8] rounded-xl border-2 border-black overflow-hidden mb-2.5">
                    <img
                      src={resolveFoodImage(item.imageUrl, item.name)}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      className="group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/items/paneer_burger.png';
                      }}
                    />
                    {/* Price Pill */}
                    <span className="absolute top-1.5 left-1.5 bg-[#FFF4DC] text-on-surface font-label-md text-[11px] px-2 py-0.5 rounded-full border-2 border-on-surface shadow-[1px_1px_0px_0px_#0A0A0A] font-extrabold">
                      ₹{getItemPriceINR(item)}
                    </span>
                    {/* Pure Veg Badge */}
                    <span className="absolute bottom-1.5 right-1.5 bg-[#2e7d32] text-white font-label-sm text-[9px] px-1.5 py-0.5 rounded-md border border-on-surface font-bold flex items-center gap-0.5">
                      VEG 🟢
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-headline-sm text-sm font-extrabold text-on-surface leading-tight line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="font-body-sm text-[11px] text-on-surface-variant font-medium mt-0.5 line-clamp-2 leading-snug">
                      {item.description}
                    </p>
                  </div>

                  {/* Rating & Action Button */}
                  <div className="mt-3 flex items-center justify-between pt-1 border-t border-gray-100">
                    <div className="flex items-center text-accent-orange font-bold text-xs gap-0.5">
                      <span className="material-symbols-outlined text-xs material-symbols-fill text-[#F99827]">star</span>
                      <span className="text-on-surface text-[11px] font-extrabold">{item.rating || 4.9}</span>
                    </div>

                    {item.isAvailable ? (
                      <button
                        onClick={(e) => handleAddToCart(item, e)}
                        className="bg-accent-crimson text-white font-label-sm text-[11px] px-3 py-1.5 rounded-full border-2 border-on-surface shadow-[2px_2px_0px_0px_#0A0A0A] hover:bg-red-700 active:translate-x-[1px] active:translate-y-[1px] font-extrabold flex items-center gap-1 transition-transform"
                      >
                        <span>+ Add</span>
                      </button>
                    ) : (
                      <span className="bg-gray-200 text-gray-600 font-label-sm text-[10px] px-2 py-1 rounded-full border border-gray-400 font-bold">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
