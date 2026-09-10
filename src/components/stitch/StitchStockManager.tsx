import React, { useState, useEffect } from 'react';
import { MenuItem, FoodCategory } from '../../types';
import {
  listenToMenuItems,
  updateMenuItemAvailability,
  deleteMenuItem,
  addMenuItem,
  forceReseedMenu,
} from '../../services/menuService';
import { getItemPriceINR } from '../../utils/price';

export const StitchStockManager: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [reseeding, setReseeding] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<Exclude<FoodCategory, 'All'>>('Burgers');
  const [newItemPrice, setNewItemPrice] = useState('8.90');
  const [newItemPrepTime, setNewItemPrepTime] = useState('8');
  const [newItemDesc, setNewItemDesc] = useState('');

  useEffect(() => {
    const unsub = listenToMenuItems((menuList) => {
      setItems(menuList);
    });
    return unsub;
  }, []);

  const handleToggleStock = async (item: MenuItem) => {
    const newStatus = !item.isAvailable;
    await updateMenuItemAvailability(item.id, newStatus);
    setToastMessage(`${item.name} is now ${newStatus ? 'IN STOCK 🟢' : 'OUT OF STOCK 🔴'}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    await addMenuItem({
      name: newItemName.trim(),
      category: newItemCategory,
      price: parseFloat(newItemPrice) || 8.5,
      priceINR: Math.round((parseFloat(newItemPrice) || 8.5) * 20),
      description: newItemDesc.trim() || 'Delicious pure veg campus canteen specialty.',
      imageUrl: '/items/paneer_burger.png',
      isAvailable: true,
      isVeg: true,
      preparationTimeMinutes: parseInt(newItemPrepTime) || 8,
      stockCountRemaining: 30,
      badge: 'NEW',
    });

    setShowAddModal(false);
    setNewItemName('');
    setNewItemDesc('');
    setToastMessage('✓ New dish successfully added to menu!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleForceReseed = async () => {
    if (!window.confirm('This will DELETE all current menu items and replace them with the default campus menu with correct images. Continue?')) return;
    setReseeding(true);
    try {
      await forceReseedMenu();
      setToastMessage('✅ Menu reset! All images updated to local photos.');
    } catch (e: any) {
      setToastMessage(`❌ Reset failed: ${e.message}`);
    } finally {
      setReseeding(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCat =
      selectedCategory === 'All' ? true : item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col items-center">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 z-50 bg-black text-white font-label-md px-5 py-2 rounded-full border-2 border-accent-mustard shadow-[4px_4px_0px_#000] flex items-center gap-2 animate-bounce">
          <span className="font-extrabold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Main Mobile/Tablet Device Canvas Wrapper */}
      <main className="w-full max-w-[480px] min-h-screen bg-[#FED97C] flex flex-col relative pb-32 border-x-2 border-on-surface shadow-[6px_0px_0px_0px_#0A0A0A]">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-[#FED97C] border-b-2 border-on-surface px-4 py-3 shadow-[0px_4px_0px_0px_#0A0A0A]">
          <div className="flex justify-between items-center pb-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-mustard border-2 border-on-surface shadow-[2px_2px_0px_0px_#0A0A0A]">
                <span className="material-symbols-outlined text-on-surface text-[18px]">inventory_2</span>
              </span>
              <h1 className="font-headline-lg-mobile text-2xl font-black tracking-wide uppercase leading-none text-on-surface">
                Stock Matrix
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-accent-crimson text-white font-extrabold text-xs px-3 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1"
              >
                <span>+ Add Dish</span>
              </button>
              <button
                onClick={handleForceReseed}
                disabled={reseeding}
                title="Delete all items and re-seed with correct local food photos"
                className="bg-white text-on-surface font-extrabold text-[10px] px-2.5 py-1.5 rounded-full border-2 border-on-surface shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 disabled:opacity-50"
              >
                {reseeding ? (
                  <span className="animate-spin inline-block w-3 h-3 border-2 border-on-surface border-t-transparent rounded-full" />
                ) : (
                  <span>🔄</span>
                )}
                <span>{reseeding ? 'Resetting…' : 'Fix Images'}</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-2 relative flex items-center bg-white rounded-xl border-2 border-on-surface shadow-[2px_2px_0px_0px_#0A0A0A] p-1">
            <span className="material-symbols-outlined ml-2 text-gray-500 text-xl">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dish to toggle stock..."
              className="w-full bg-transparent border-none focus:ring-0 px-2 py-1 text-xs text-on-surface font-semibold focus:outline-none"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 pb-1 text-xs">
            {(['All', 'Burgers', 'Sides', 'Desserts', 'Drinks'] as FoodCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full border-2 border-on-surface font-extrabold whitespace-nowrap transition-transform active:translate-x-[1px] active:translate-y-[1px] ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_#F4BA1B]'
                    : 'bg-white text-gray-800 shadow-[1px_1px_0px_0px_#0A0A0A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Inventory Product Rows */}
        <section className="px-4 py-4 flex flex-col gap-3.5">
          {filteredItems.length === 0 ? (
            <div className="bg-white border-2 border-on-surface rounded-2xl p-6 text-center">
              <p className="font-bold text-sm">No items found</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <article
                key={item.id}
                className={`bg-white border-[3px] border-on-surface rounded-2xl p-3.5 shadow-[4px_4px_0px_0px_#0A0A0A] flex flex-col gap-3 transition-transform ${
                  !item.isAvailable ? 'bg-gray-50 border-gray-400 opacity-80' : ''
                }`}
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 shrink-0 rounded-xl border-2 border-on-surface overflow-hidden bg-accent-mustard shadow-[2px_2px_0px_0px_#0A0A0A]">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/items/food-photographer-6h3rdnBv900-unsplash.png';
                      }}
                    />
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-accent-crimson text-white text-[9px] font-black px-1.5 py-0.5 rounded border border-white">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h2 className="font-title-md text-sm font-black text-on-surface leading-tight truncate">
                        {item.name}
                      </h2>
                      {item.badge && (
                        <span className="bg-accent-mustard text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded-full border border-black shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-extrabold text-tertiary">
                        ₹{getItemPriceINR(item)}
                      </span>
                      <span className="text-[11px] text-gray-600 font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">timer</span>{' '}
                        {item.preparationTimeMinutes || 8} mins
                      </span>
                    </div>

                    {/* Stock status indicator pill */}
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-black ${
                          item.isAvailable ? 'bg-accent-mint text-black' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isAvailable ? 'bg-green-700' : 'bg-red-600'
                          }`}
                        ></span>
                        {item.isAvailable ? 'Serving Now' : 'Currently Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-300"></div>

                {/* Controls: Live Neo-Brutalist Toggle */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleStock(item)}
                    className={`flex-1 font-extrabold text-xs py-2 px-3 rounded-full border-2 border-on-surface shadow-[2px_2px_0px_0px_#0A0A0A] flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] transition-all ${
                      item.isAvailable
                        ? 'bg-accent-mint text-black hover:bg-emerald-400'
                        : 'bg-accent-crimson text-white hover:bg-red-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {item.isAvailable ? 'check_circle' : 'cancel'}
                    </span>
                    <span>
                      {item.isAvailable ? '✓ IN STOCK / ACTIVE' : '✕ OUT OF STOCK (Tap to Enable)'}
                    </span>
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        {/* Modal: Add New Dish */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-[#FED97C] border-4 border-black rounded-3xl p-5 w-full max-w-sm shadow-[6px_6px_0px_#000]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-headline-lg-mobile text-xl font-black uppercase">
                  + Add New Menu Item
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddNewItem} className="space-y-3">
                <div>
                  <label className="block text-xs font-black mb-1">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g. Masala Cheese Sandwich"
                    className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-black mb-1">Category</label>
                    <select
                      value={newItemCategory}
                      onChange={(e) =>
                        setNewItemCategory(e.target.value as Exclude<FoodCategory, 'All'>)
                      }
                      className="w-full bg-white border-2 border-black rounded-xl px-2 py-2 text-xs font-bold focus:outline-none"
                    >
                      <option value="Burgers">Burgers</option>
                      <option value="Sides">Sides</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Drinks">Drinks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    value={newItemPrepTime}
                    onChange={(e) => setNewItemPrepTime(e.target.value)}
                    className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    placeholder="Short description of ingredients..."
                    className="w-full bg-white border-2 border-black rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent-crimson text-white font-extrabold text-xs py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                >
                  Save & Publish to Canteen Menu
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
