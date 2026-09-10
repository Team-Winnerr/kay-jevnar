import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { listenToMenuItems, seedInitialMenuIfEmpty } from './services/menuService';
import { listenToStudentOrders } from './services/orderService';
import { MenuItem, Order } from './types';

// Stitch Neo-Brutalist Components
import { StitchTopNav, ActiveAppView } from './components/stitch/StitchTopNav';
import { StitchStudentHome } from './components/stitch/StitchStudentHome';
import { StitchKDSBoard } from './components/stitch/StitchKDSBoard';
import { StitchStockManager } from './components/stitch/StitchStockManager';
import { StitchAnalytics } from './components/stitch/StitchAnalytics';
import { StitchOrderTracker } from './components/stitch/StitchOrderTracker';
import { StitchAdminPanel } from './components/stitch/StitchAdminPanel';

// Shared Drawers / Modals
import { BiteJoyCartDrawer } from './components/BiteJoyCartDrawer';
import { BiteJoyAuthModal } from './components/BiteJoyAuthModal';

export const ReactApp: React.FC = () => {
  const { firebaseUser, profile } = useAuth();
  const { items: cartItems } = useCart();
  const [currentView, setCurrentView] = useState<ActiveAppView>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [studentOrders, setStudentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Seed menu and listen to Firestore
  useEffect(() => {
    seedInitialMenuIfEmpty().catch(() => {});
    const unsub = listenToMenuItems((items) => {
      setMenuItems(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Listen to current student's orders
  useEffect(() => {
    if (!firebaseUser) {
      setStudentOrders([]);
      return;
    }
    const unsub = listenToStudentOrders(firebaseUser.uid, (orders) => {
      setStudentOrders(orders);
      if (!trackingOrderId && orders.length > 0) {
        setTrackingOrderId(orders[0].id);
      }
    });
    return unsub;
  }, [firebaseUser, trackingOrderId]);

  // Guard against non-admin users landing on admin-only views
  useEffect(() => {
    const isAdminView =
      currentView === 'kds' ||
      currentView === 'inventory' ||
      currentView === 'analytics' ||
      currentView === 'admin';

    if (isAdminView && profile && profile.role !== 'admin') {
      setCurrentView('menu');
    }
  }, [profile, currentView]);

  // Handle order success from Cart
  const handleOrderSuccess = (order: Order) => {
    setTrackingOrderId(order.id);
    setCurrentView('tracking');
  };

  const activeTrackingId = trackingOrderId || (studentOrders.length > 0 ? studentOrders[0].id : null);

  return (
    <div className="min-h-screen bg-[#FED97C] text-black font-body-md flex flex-col selection:bg-accent-crimson selection:text-white">
      {/* Top Application Switcher & Header */}
      <StitchTopNav
        activeView={currentView}
        onSelectView={(view) => {
          if (view === 'tracking' && !activeTrackingId && studentOrders.length > 0) {
            setTrackingOrderId(studentOrders[0].id);
          }
          setCurrentView(view);
        }}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        hasActiveOrder={Boolean(activeTrackingId)}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full flex justify-center">
        {currentView === 'menu' && (
          <StitchStudentHome
            menuItems={menuItems}
            loading={loading}
            onOpenCart={() => setCartOpen(true)}
            onViewTracker={() => {
              if (activeTrackingId) {
                setCurrentView('tracking');
              } else {
                setCartOpen(true);
              }
            }}
          />
        )}

        {currentView === 'tracking' && (
          activeTrackingId ? (
            <StitchOrderTracker
              orderId={activeTrackingId}
              onBackToMenu={() => setCurrentView('menu')}
            />
          ) : (
            <div className="w-full max-w-[480px] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center border-x-2 border-black">
              <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[6px_6px_0px_#000]">
                <span className="text-5xl">📦</span>
                <h3 className="font-headline-md text-2xl font-black mt-3">No Active Orders</h3>
                <p className="text-xs text-gray-600 mt-2">
                  You haven't placed an order yet. Select your favorite items from the menu to receive your live 4-digit pickup OTP!
                </p>
                <button
                  onClick={() => setCurrentView('menu')}
                  className="mt-5 bg-accent-crimson text-white font-extrabold text-xs px-5 py-2.5 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  Explore Delicious Menu ➔
                </button>
              </div>
            </div>
          )
        )}

        {/* Protected Admin Views (KDS, Stock Matrix, Analytics) */}
        {(currentView === 'kds' || currentView === 'inventory' || currentView === 'analytics' || currentView === 'admin') && (
          profile?.role === 'admin' ? (
            <>
              {currentView === 'kds' && <StitchKDSBoard />}
              {currentView === 'inventory' && <StitchStockManager />}
              {currentView === 'analytics' && <StitchAnalytics />}
              {currentView === 'admin' && <StitchAdminPanel />}
            </>
          ) : (
            <div className="w-full max-w-[480px] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center border-x-2 border-black">
              <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[6px_6px_0px_#000]">
                <span className="text-5xl">🔒</span>
                <h3 className="font-headline-md text-2xl font-black mt-3">Admin Panel Access</h3>
                <p className="text-xs text-gray-600 mt-2">
                  Kitchen KDS, Stock Matrix, and Analytics are reserved for authorized Canteen Admin staff.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="bg-accent-crimson text-white font-extrabold text-xs px-5 py-2.5 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    Sign In as Canteen Admin ➔
                  </button>
                  <button
                    onClick={() => setCurrentView('menu')}
                    className="text-xs font-extrabold text-gray-500 hover:text-black underline mt-1"
                  >
                    Return to Student Menu
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Cart Tray Modal */}
      <BiteJoyCartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onOrderSuccess={handleOrderSuccess}
        onRequireAuth={() => setAuthOpen(true)}
      />

      {/* Auth Modal with Role Navigation */}
      <BiteJoyAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(loggedProfile) => {
          setAuthOpen(false);
          if (loggedProfile.role === 'admin') {
            setCurrentView('kds');
          } else {
            setCurrentView('menu');
            if (cartItems.length > 0) {
              setCartOpen(true);
            }
          }
        }}
      />
    </div>
  );
};
