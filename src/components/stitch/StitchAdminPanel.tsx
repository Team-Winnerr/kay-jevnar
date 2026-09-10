import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StitchKDSBoard } from './StitchKDSBoard';
import { StitchStockManager } from './StitchStockManager';
import { StitchAnalytics } from './StitchAnalytics';

// ─── Local item images from bitejoy_site that were copied to public/items ────
const ITEM_IMAGES: { label: string; url: string }[] = [
  { label: 'Classic Burger', url: '/items/classic-beef-burger-ready-be-served.png' },
  { label: 'Paneer Burger', url: '/items/paneer_burger.png' },
  { label: 'Smash Burger', url: '/items/smash_burger.png' },
  { label: 'Layered Burger', url: '/items/hamburger-with-tomato-lettuce-leaf-beef-patties-burger-buns.png' },
  { label: 'Classic Hamburger', url: '/items/classic-hamburger-filled.png' },
  { label: 'Burger Box', url: '/items/high-angle-delicious-burger-box.png' },
  { label: 'Appetizing Burger', url: '/items/appetizing-hamburger-blue-background.png' },
  { label: 'Flatlay Burger', url: '/items/flay-lay-hamburger-with-copy-space.png' },
  { label: 'Burger + Fries', url: '/items/high-angle-delicious-burger-fries.png' },
  { label: 'Fries Cone', url: '/items/fries-cone-yellow-background.png' },
  { label: 'French Fries', url: '/items/portion-french-fries-with-ketchup.png' },
  { label: 'Onion Rings', url: '/items/onion-rings-blue-box.png' },
  { label: 'Onion Rings Box', url: '/items/onion-rings-box.png' },
  { label: 'Strawberry Cake', url: '/items/pink-strawberry-cake-portion-pink-background.png' },
  { label: 'Donuts', url: '/items/top-view-arrangement-with-doughnuts-blue-background.png' },
  { label: 'Blue Donut', url: '/items/top-view-blue-donut.png' },
  { label: 'Cold Coffee', url: '/items/zach-camp-3D0HUHFcRrk-unsplash.png' },
  { label: 'Lemon Soda', url: '/items/ian-dooley-TLD6iCOlyb0-unsplash.png' },
  { label: 'Nuggets + Fries', url: '/items/chicken-nuggets-french-fries-red.png' },
  { label: 'Food Hero Shot', url: '/items/food-photographer-6h3rdnBv900-unsplash.png' },
];

type AdminTab = 'kds' | 'stock' | 'analytics' | 'images';

// ─── Image Library Tab ────────────────────────────────────────────────────────
// Shows all local food photos from bitejoy_site so the admin can visually
// pick which one to use when editing menu items via StitchStockManager.
const ImageLibraryTab: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[480px] min-h-screen bg-[#FED97C] border-x-2 border-on-surface shadow-[6px_0px_0px_0px_#0A0A0A] flex flex-col pb-8">
        {/* Header */}
        <div className="sticky top-0 z-10 px-4 py-3 bg-[#FED97C] border-b-2 border-on-surface shadow-[0_3px_0_#000]">
          <h2 className="font-headline-md text-base font-black">📸 Food Photo Library</h2>
          <p className="text-[11px] text-gray-700 font-medium mt-0.5">
            Tap a photo to copy its path — paste into Stock Manager when adding items.
          </p>
        </div>

        {/* Toast */}
        {copied && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-white px-4 py-2 rounded-full shadow-[4px_4px_0px_#000] font-extrabold text-xs border-2 border-white">
            ✓ Path copied!
          </div>
        )}

        {/* Grid */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {ITEM_IMAGES.map((img) => (
            <button
              key={img.url}
              onClick={() => handleCopy(img.url)}
              className={`relative rounded-2xl border-2 overflow-hidden aspect-square transition-transform active:scale-95 active:translate-x-0.5 active:translate-y-0.5 shadow-[3px_3px_0px_#000] ${
                copied === img.url
                  ? 'border-[#059669] shadow-[3px_3px_0px_#059669]'
                  : 'border-on-surface hover:border-accent-crimson'
              }`}
            >
              <img
                src={img.url}
                alt={img.label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    '/items/food-photographer-6h3rdnBv900-unsplash.png';
                }}
              />
              {/* Label overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1.5">
                <p className="text-white text-[10px] font-extrabold truncate">{img.label}</p>
                <p className="text-gray-300 text-[9px] truncate">{img.url}</p>
              </div>
              {/* Copied checkmark */}
              {copied === img.url && (
                <div className="absolute inset-0 bg-[#059669]/30 flex items-center justify-center">
                  <span className="text-3xl">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Admin Panel Shell ───────────────────────────────────────────────────
export const StitchAdminPanel: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('kds');

  const TABS: { id: AdminTab; emoji: string; label: string }[] = [
    { id: 'kds',       emoji: '🍳', label: 'Live Orders' },
    { id: 'stock',     emoji: '📋', label: 'Stock / Menu' },
    { id: 'analytics', emoji: '📊', label: 'Analytics' },
    { id: 'images',    emoji: '📸', label: 'Photo Lib' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* ── Admin Identity Banner ────────────────────────────────────── */}
      <div className="w-full bg-on-surface text-white border-b-4 border-black px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Avatar initials */}
          <div className="w-7 h-7 rounded-full bg-accent-crimson border-2 border-white flex items-center justify-center text-[11px] font-black flex-shrink-0">
            {profile?.name?.charAt(0)?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <p className="text-[9px] font-extrabold opacity-50 uppercase tracking-widest leading-none">
              Admin Portal
            </p>
            <p className="text-xs font-black leading-tight">
              {profile?.name ?? 'Canteen Admin'} •{' '}
              <span className="text-accent-mustard">🌱 100% Pure Veg</span>
            </p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold bg-accent-mustard text-black px-2 py-0.5 rounded-full border border-black">
          ADMIN
        </span>
      </div>

      {/* ── Tab Bar ───────────────────────────────────────────────────── */}
      <div className="w-full bg-[#FED97C] border-b-2 border-on-surface shadow-[0_3px_0_#000] flex items-center gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-on-surface font-extrabold text-xs whitespace-nowrap transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
              activeTab === tab.id
                ? 'bg-on-surface text-white shadow-[2px_2px_0px_#555]'
                : 'bg-white text-on-surface shadow-[2px_2px_0px_#000] hover:bg-yellow-100'
            }`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content — reuse existing Stitch components ────────────── */}
      {activeTab === 'kds' && <StitchKDSBoard />}
      {activeTab === 'stock' && <StitchStockManager />}
      {activeTab === 'analytics' && <StitchAnalytics />}
      {activeTab === 'images' && <ImageLibraryTab />}
    </div>
  );
};
