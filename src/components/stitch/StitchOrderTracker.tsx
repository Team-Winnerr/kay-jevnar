import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Order } from '../../types';

interface StitchOrderTrackerProps {
  orderId: string;
  onBackToMenu: () => void;
}

export const StitchOrderTracker: React.FC<StitchOrderTrackerProps> = ({
  orderId,
  onBackToMenu,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const orderRef = doc(db, 'orders', orderId);
    const unsub = onSnapshot(
      orderRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
        }
        setLoading(false);
      },
      (err) => {
        console.warn('Error listening to order:', err);
        setLoading(false);
      }
    );
    return unsub;
  }, [orderId]);

  if (loading) {
    return (
      <div className="w-full max-w-[480px] mx-auto min-h-screen bg-[#FED97C] flex items-center justify-center border-x-2 border-black">
        <div className="text-center font-black">
          <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
          <p className="mt-2 text-sm">Connecting to Live Kitchen Dispatch...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full max-w-[480px] mx-auto min-h-screen bg-[#FED97C] p-6 flex flex-col items-center justify-center text-center border-x-2 border-black">
        <div className="bg-white border-4 border-black p-6 rounded-3xl shadow-[6px_6px_0px_#000]">
          <span className="text-4xl">🔍</span>
          <h2 className="font-headline-md text-xl font-black mt-2">Order Not Found</h2>
          <p className="text-xs text-gray-600 mt-1">This ticket might have expired or been archived.</p>
          <button
            onClick={onBackToMenu}
            className="mt-4 bg-accent-crimson text-white px-5 py-2 rounded-full border-2 border-black font-extrabold text-xs shadow-[2px_2px_0px_#000]"
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { label: 'Order Placed', status: 'Placed', icon: 'receipt' },
    { label: 'Kitchen Cooking', status: 'Preparing', icon: 'soup_kitchen' },
    { label: 'Ready at Counter', status: 'Ready', icon: 'notifications_active' },
    { label: 'Picked Up', status: 'Completed', icon: 'check_circle' },
  ];

  const getStepIndex = (st: string) => {
    switch (st) {
      case 'Placed':
        return 0;
      case 'Preparing':
        return 1;
      case 'Ready':
        return 2;
      case 'Completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(order.status);

  return (
    <div className="w-full flex flex-col items-center">
      <main className="w-full max-w-[480px] min-h-screen bg-[#FED97C] flex flex-col relative pb-28 border-x-2 border-on-surface shadow-[6px_0px_0px_0px_#0A0A0A]">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-[#FED97C] border-b-2 border-on-surface px-4 py-3 shadow-[0px_4px_0px_0px_#0A0A0A] flex items-center justify-between">
          <button
            onClick={onBackToMenu}
            className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            title="Back to Menu"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div className="text-center">
            <h1 className="font-headline-lg-mobile text-xl font-black uppercase leading-none">
              Live Order Tracker
            </h1>
            <span className="text-[10px] font-extrabold text-gray-700">
              TICKET #{order.orderNumber || order.id.slice(-6).toUpperCase()}
            </span>
          </div>
          <span className="w-10 h-10"></span>
        </header>

        <div className="px-4 pt-4 flex flex-col gap-4">
          {/* Prominent Red Dashed Stamp for Student Pickup OTP */}
          <section className="bg-white rounded-3xl border-4 border-black p-5 text-center shadow-[6px_6px_0px_#000] relative overflow-hidden">
            <div className="inline-block bg-accent-crimson text-white font-black text-[10px] uppercase px-3 py-0.5 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] mb-2">
              SHOW AT CANTEEN COUNTER
            </div>

            <h2 className="text-xs font-black uppercase text-gray-600 tracking-wider">
              YOUR 4-DIGIT PICKUP OTP
            </h2>

            {/* Huge 4-digit stamp boxes */}
            <div className="flex justify-center items-center gap-2.5 my-3">
              {(order.pickupOtp || order.orderNumber?.replace('KJ-', '') || '1234').slice(0, 4).split('').map((digit, idx) => (
                <div
                  key={idx}
                  className="w-14 h-16 bg-[#FED97C] border-[3.5px] border-black rounded-2xl flex items-center justify-center font-headline-md text-3xl font-black text-black shadow-[3px_3px_0px_#000] transform -rotate-1 hover:rotate-0 transition-transform"
                >
                  {digit}
                </div>
              ))}
            </div>

            <p className="text-xs font-bold text-gray-700">
              Kitchen staff will verify this PIN before handing over your hot meal tray.
            </p>
          </section>

          {/* Live Cooking Status Progress */}
          <section className="bg-white rounded-3xl border-[3.5px] border-black p-4 shadow-[4px_4px_0px_#000]">
            <div className="flex items-center justify-between mb-3 border-b-2 border-gray-100 pb-2">
              <span className="text-xs font-black uppercase">Live Order Status</span>
              <span
                className={`text-[11px] font-black px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] ${
                  order.status === 'Ready'
                    ? 'bg-accent-mint text-black animate-bounce'
                    : order.status === 'Preparing'
                    ? 'bg-accent-cyan text-black'
                    : order.status === 'Completed'
                    ? 'bg-gray-200 text-black'
                    : 'bg-accent-mustard text-black'
                }`}
              >
                {order.status === 'Ready'
                  ? '🔔 READY AT COUNTER'
                  : order.status === 'Preparing'
                  ? '🍳 CHEF IS COOKING'
                  : order.status === 'Completed'
                  ? '✓ COMPLETED'
                  : '⏳ ORDER RECEIVED'}
              </span>
            </div>

            {/* Stepper */}
            <div className="relative flex justify-between items-center my-3 px-2">
              <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-gray-200 -translate-y-1/2 -z-0">
                <div
                  className="h-full bg-accent-crimson transition-all duration-500"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                ></div>
              </div>

              {steps.map((st, i) => {
                const isPassed = i <= currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={st.status} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full border-2 border-black flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_#000] transition-transform ${
                        isCurrent
                          ? 'bg-accent-crimson text-white scale-110 ring-2 ring-black'
                          : isPassed
                          ? 'bg-accent-mint text-black'
                          : 'bg-white text-gray-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{st.icon}</span>
                    </div>
                    <span
                      className={`text-[9px] font-extrabold mt-1 text-center max-w-[60px] leading-tight ${
                        isCurrent ? 'text-accent-crimson font-black' : 'text-gray-600'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Estimated time note */}
            <div className="mt-4 bg-[#FFF4DC] border-2 border-black rounded-xl p-2.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-crimson text-xl">timer</span>
              <div className="text-xs font-bold text-gray-800">
                {order.status === 'Ready'
                  ? 'Your food is steaming hot and ready at the pickup window!'
                  : order.status === 'Completed'
                  ? 'Thank you for dining with काय Jevnar! Enjoy your meal.'
                  : 'Estimated Prep Turnaround: ~6–8 mins'}
              </div>
            </div>
          </section>

          {/* Order Summary & Items List */}
          <section className="bg-white rounded-3xl border-[3.5px] border-black p-4 shadow-[4px_4px_0px_#000]">
            <h3 className="text-xs font-black uppercase tracking-wider mb-2 border-b-2 border-gray-100 pb-1.5">
              Meal Tray Items
            </h3>
            <div className="space-y-2 mb-3">
              {order.items.map((item, idx) => {
                const priceINR = item.menuItem.priceINR || Math.round(item.menuItem.price * 83);
                return (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-on-surface">
                      <span className="bg-accent-mustard px-1.5 py-0.5 rounded border border-black mr-1 text-[10px]">
                        {item.quantity}x
                      </span>{' '}
                      {item.menuItem.name}
                    </span>
                    <span className="font-black text-tertiary">
                      ₹{priceINR * item.quantity}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t-2 border-dashed border-gray-300 pt-2 space-y-1 text-xs">
              <div className="flex justify-between font-semibold text-gray-600">
                <span>Subtotal</span>
                <span>
                  ₹{Math.round((order.subtotal || order.total * 0.95) * 83)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-gray-600">
                <span>Campus Canteen Tax (5%)</span>
                <span>
                  ₹{Math.round((order.tax || order.total * 0.05) * 83)}
                </span>
              </div>
              <div className="flex justify-between font-black text-sm text-black border-t-2 border-black pt-1">
                <span>Total Paid</span>
                <span className="text-accent-crimson">
                  ₹{Math.round(order.total * 83)}
                </span>
              </div>
            </div>
          </section>

          {/* Back to Menu CTA */}
          <button
            onClick={onBackToMenu}
            className="w-full bg-black text-white font-extrabold text-xs py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_#F4BA1B] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            ← Order More Delicious Food
          </button>
        </div>
      </main>
    </div>
  );
};
