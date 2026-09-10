import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export type ActiveAppView = 'menu' | 'tracking' | 'kds' | 'inventory' | 'analytics' | 'admin';

interface StitchTopNavProps {
  activeView: ActiveAppView;
  onSelectView: (view: ActiveAppView) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  hasActiveOrder: boolean;
}

export const StitchTopNav: React.FC<StitchTopNavProps> = ({
  activeView,
  onSelectView,
  onOpenCart,
  onOpenAuth,
  hasActiveOrder,
}) => {
  const { items } = useCart();
  const { firebaseUser, profile, logout } = useAuth();
  const totalCount = items.reduce((sum, it) => sum + it.quantity, 0);

  const isAdminUser = profile?.role === 'admin';
  const isAdminPanel =
    isAdminUser &&
    (activeView === 'kds' ||
      activeView === 'inventory' ||
      activeView === 'analytics' ||
      activeView === 'admin');

  return (
    <header
      className={`w-full border-b-4 border-black shadow-[0_4px_0_#000] sticky top-0 z-50 transition-colors duration-200 ${
        isAdminPanel ? 'bg-[#FED97C]' : 'bg-[#FED97C]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => onSelectView('menu')}
            className="flex items-center gap-2 cursor-pointer select-none"
            title=" काय Jevnar? Home"
          >
            <img
              src="/logo.png"
              alt="काय Jevnar? Logo"
              className="h-10 w-auto object-contain drop-shadow-[2px_2px_0px_#000]"
            />
          </div>

          {/* Mode Badge Indicator */}
          {isAdminPanel ? (
            <span className="bg-black text-[#FED97C] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border-2 border-black tracking-wider shadow-[1px_1px_0px_#000]">
              👨‍🍳 ADMIN PANEL
            </span>
          ) : (
            <span className="bg-white text-black text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border-2 border-black tracking-wider hidden sm:inline-block shadow-[1px_1px_0px_#000]">
              🎓 STUDENT PANEL
            </span>
          )}
        </div>

        {/* ── SEPARATE PANEL NAVIGATION TABS ────────────────────── */}
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {isAdminPanel ? (
            /* ── ADMIN PANEL TABS (Kitchen KDS, Stock Matrix, Analytics) ── */
            <>
              {/* 1. Kitchen KDS */}
              <button
                onClick={() => onSelectView('kds')}
                className={`px-3.5 py-1.5 rounded-full border-2 border-black font-extrabold text-xs whitespace-nowrap transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 ${
                  activeView === 'kds'
                    ? 'bg-[#2563EB] text-white shadow-[2px_2px_0px_#000]'
                    : 'bg-white text-black hover:bg-yellow-100 shadow-[1px_1px_0px_#000]'
                }`}
              >
                <span>🍳</span>
                <span>Kitchen KDS</span>
              </button>

              {/* 2. Stock Matrix */}
              <button
                onClick={() => onSelectView('inventory')}
                className={`px-3.5 py-1.5 rounded-full border-2 border-black font-extrabold text-xs whitespace-nowrap transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 ${
                  activeView === 'inventory'
                    ? 'bg-accent-crimson text-white shadow-[2px_2px_0px_#000]'
                    : 'bg-white text-black hover:bg-yellow-100 shadow-[1px_1px_0px_#000]'
                }`}
              >
                <span>📋</span>
                <span>Stock Matrix</span>
              </button>

              {/* 3. Analytics */}
              <button
                onClick={() => onSelectView('analytics')}
                className={`px-3.5 py-1.5 rounded-full border-2 border-black font-extrabold text-xs whitespace-nowrap transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 ${
                  activeView === 'analytics'
                    ? 'bg-accent-mint text-black shadow-[2px_2px_0px_#000]'
                    : 'bg-white text-black hover:bg-yellow-100 shadow-[1px_1px_0px_#000]'
                }`}
              >
                <span>📊</span>
                <span>Analytics</span>
              </button>
            </>
          ) : (
            /* ── STUDENT PANEL TABS (Menu & Order, My Order & OTP) ── */
            <>
              {/* 1. Menu & Order */}
              <button
                onClick={() => onSelectView('menu')}
                className={`px-3.5 py-1.5 rounded-full border-2 border-black font-extrabold text-xs whitespace-nowrap transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 ${
                  activeView === 'menu'
                    ? 'bg-accent-crimson text-white shadow-[2px_2px_0px_#000]'
                    : 'bg-white text-black hover:bg-yellow-100 shadow-[1px_1px_0px_#000]'
                }`}
              >
                <span>🍔</span>
                <span>Menu & Order</span>
              </button>

              {/* 2. My Order & OTP */}
              <button
                onClick={() => onSelectView('tracking')}
                className={`relative px-3.5 py-1.5 rounded-full border-2 border-black font-extrabold text-xs whitespace-nowrap transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 ${
                  activeView === 'tracking'
                    ? 'bg-accent-crimson text-white shadow-[2px_2px_0px_#000]'
                    : 'bg-white text-black hover:bg-yellow-100 shadow-[1px_1px_0px_#000]'
                }`}
              >
                <span>📦</span>
                <span>My Order & OTP</span>
                {hasActiveOrder && (
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block"></span>
                )}
              </button>
            </>
          )}
        </nav>

        {/* ── RIGHT UTILITIES & AUTH ───────────────────────────── */}
        <div className="flex items-center gap-2">
          {!isAdminPanel && (
            /* Student Panel: Food Tray */
            <button
              onClick={onOpenCart}
              className="relative bg-white hover:bg-yellow-100 text-black border-2 border-black px-3 py-1.5 rounded-full shadow-[2px_2px_0px_#000] font-extrabold text-xs flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
            >
              <span className="material-symbols-outlined text-base">shopping_bag</span>
              <span className="hidden md:inline">Food Tray</span>
              {totalCount > 0 && (
                <span className="bg-accent-crimson text-white text-[10px] w-5 h-5 rounded-full border border-black flex items-center justify-center font-bold">
                  {totalCount}
                </span>
              )}
            </button>
          )}

          {/* Authentication State */}
          {firebaseUser ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-extrabold text-black bg-white px-2.5 py-1 rounded-full border-2 border-black hidden lg:inline shadow-[1px_1px_0px_#000]">
                {profile?.role === 'admin' ? '👨‍🍳' : '👤'} {profile?.name || firebaseUser.email?.split('@')[0]}
              </span>
              <button
                onClick={() => {
                  logout();
                  onSelectView('menu');
                }}
                className="bg-black text-white px-3 py-1 rounded-full text-xs font-extrabold border-2 border-black hover:bg-gray-800 shadow-[2px_2px_0px_#000]"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold border-2 border-black hover:bg-gray-800 shadow-[2px_2px_0px_#000]"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
