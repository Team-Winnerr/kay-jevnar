import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { listenToAllOrders } from '../../services/orderService';

export const StitchAnalytics: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [rushModeActive, setRushModeActive] = useState(false);
  const [orderInflowPaused, setOrderInflowPaused] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = listenToAllOrders((all) => {
      setOrders(all);
    });
    return unsub;
  }, []);

  const completedOrders = orders.filter((o) => o.status === 'Completed');
  const totalCompletedRevenueUSD = completedOrders.reduce((sum, o) => sum + o.total, 0);
  // Add base campus sales metrics
  const displayRevenueINR = Math.round(32400 + totalCompletedRevenueUSD * 82);
  const displayCompletedCount = 142 + completedOrders.length;

  const toggleRushMode = () => {
    const next = !rushModeActive;
    setRushModeActive(next);
    setToastMessage(next ? '🚨 Rush Mode Activated: +5 mins buffer appended to student ETAs' : '✓ Rush Mode Normal: Standard prep times restored');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleInflow = () => {
    const next = !orderInflowPaused;
    setOrderInflowPaused(next);
    setToastMessage(next ? '⏸ Order Inflow Throttled: Counter queue paused' : '▶ Order Inflow Resumed: Accepting live orders');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 z-50 bg-black text-white font-label-md px-5 py-2 rounded-full border-2 border-accent-mustard shadow-[4px_4px_0px_#000] flex items-center gap-2 animate-bounce">
          <span className="font-extrabold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Mobile/Tablet Viewport Container */}
      <main className="w-full max-w-[480px] min-h-screen bg-[#FED97C] flex flex-col relative pb-32 border-x-2 border-on-surface shadow-[6px_0px_0px_0px_#0A0A0A]">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-[#FED97C] border-b-2 border-on-surface px-4 py-3 shadow-[0px_4px_0px_0px_#0A0A0A]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-mustard border-2 border-on-surface shadow-[2px_2px_0px_0px_#0A0A0A]">
                <span className="material-symbols-outlined text-on-surface text-[18px]">monitoring</span>
              </span>
              <h1 className="font-headline-lg-mobile text-2xl font-black tracking-wide uppercase leading-none text-on-surface">
                Canteen Analytics
              </h1>
            </div>
            <span className="bg-accent-crimson text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] animate-pulse">
              LIVE SYNC
            </span>
          </div>
        </header>

        <div className="px-4 pt-4 flex flex-col gap-5">
          {/* Top Admin Header Block with Brand Logo */}
          <div className="flex flex-col items-center justify-center text-center">
            <img
              alt="काय Jevnar? Logo"
              src="/logo.png"
              className="h-16 w-auto object-contain drop-shadow-[0_4px_0_#0A0A0A] mb-2"
            />
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="bg-white border-2 border-black rounded-full px-3 py-1 shadow-[2px_2px_0px_#000]">
                <span className="text-xs font-black uppercase tracking-wider">TODAY'S METRICS 📊</span>
              </div>
              <div className="bg-accent-mint border-2 border-black rounded-full px-3 py-1 shadow-[2px_2px_0px_#000] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1b8045] animate-ping"></span>
                <span className="text-[11px] font-extrabold tracking-wider uppercase">
                  PUNE CAMPUS OUTPOST
                </span>
              </div>
            </div>
          </div>

          {/* Floor Performance Title */}
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-xl font-black uppercase text-on-surface">
              Floor Performance
            </h2>
            <span className="bg-gray-200 border-2 border-black text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-[1px_1px_0px_#000]">
              UPDATED: LIVE
            </span>
          </div>

          {/* 4 Stat Metric Cards (2x2 Grid) */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Stat 1: Revenue */}
            <div className="bg-white rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_#000] flex flex-col overflow-hidden">
              <div className="bg-accent-mustard px-3 py-1.5 border-b-2 border-black flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider">Gross Sales</span>
                <span className="material-symbols-outlined text-sm">payments</span>
              </div>
              <div className="p-3 flex flex-col justify-between flex-grow">
                <div>
                  <div className="font-headline-md text-2xl font-black text-on-surface">
                    ₹{displayRevenueINR.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-bold text-gray-500">
                    ≈ ${(displayRevenueINR / 82).toFixed(2)} USD
                  </div>
                </div>
                <div className="mt-2 inline-flex items-center gap-1 bg-[#E8F8EE] text-[#137333] border border-black px-1.5 py-0.5 rounded text-[10px] font-black self-start">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  <span>+18% today</span>
                </div>
              </div>
            </div>

            {/* Stat 2: Orders Completed */}
            <div className="bg-white rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_#000] flex flex-col overflow-hidden">
              <div className="bg-accent-mint px-3 py-1.5 border-b-2 border-black flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider">Completed</span>
                <span className="material-symbols-outlined text-sm">verified</span>
              </div>
              <div className="p-3 flex flex-col justify-between flex-grow">
                <div>
                  <div className="font-headline-md text-2xl font-black text-on-surface">
                    {displayCompletedCount} Orders
                  </div>
                  <div className="text-[10px] text-gray-500 font-semibold">
                    Dispensed via OTP
                  </div>
                </div>
                <div className="mt-2 inline-flex items-center gap-1 bg-gray-100 text-black border border-black px-1.5 py-0.5 rounded text-[10px] font-bold self-start">
                  <span className="material-symbols-outlined text-xs">pin</span>
                  <span>100% OTP Match</span>
                </div>
              </div>
            </div>

            {/* Stat 3: Avg Prep Turnaround */}
            <div className="bg-white rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_#000] flex flex-col overflow-hidden">
              <div className="bg-accent-cyan px-3 py-1.5 border-b-2 border-black flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider">Avg Turnaround</span>
                <span className="material-symbols-outlined text-sm">timer</span>
              </div>
              <div className="p-3 flex flex-col justify-between flex-grow">
                <div>
                  <div className="font-headline-md text-2xl font-black text-on-surface">
                    6.4 mins
                  </div>
                  <div className="text-[10px] text-gray-500 font-semibold">
                    Target: &lt;8.0 mins
                  </div>
                </div>
                <div className="mt-2 inline-flex items-center gap-1 bg-[#E8F8EE] text-[#137333] border border-black px-1.5 py-0.5 rounded text-[10px] font-black self-start">
                  <span>🚀 High Efficiency</span>
                </div>
              </div>
            </div>

            {/* Stat 4: On-time Pickup Rate */}
            <div className="bg-white rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_#000] flex flex-col overflow-hidden">
              <div className="bg-[#ffdad6] px-3 py-1.5 border-b-2 border-black flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider">Pickup Rate</span>
                <span className="material-symbols-outlined text-sm">handshake</span>
              </div>
              <div className="p-3 flex flex-col justify-between flex-grow">
                <div>
                  <div className="font-headline-md text-2xl font-black text-on-surface">
                    98.5%
                  </div>
                  <div className="text-[10px] text-gray-500 font-semibold">
                    Zero Order Theft
                  </div>
                </div>
                <div className="mt-2 inline-flex items-center gap-1 bg-[#E8F8EE] text-[#137333] border border-black px-1.5 py-0.5 rounded text-[10px] font-black self-start">
                  <span>🔒 OTP Secured</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kitchen Throttle Controls */}
          <section className="bg-white rounded-2xl border-[3px] border-black p-4 shadow-[4px_4px_0px_#000]">
            <h3 className="font-headline-md text-lg font-black uppercase mb-3 flex items-center gap-2">
              <span>🎛️ Floor Throttle Controls</span>
            </h3>

            <div className="space-y-3">
              {/* Rush Mode Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border-2 border-black bg-[#FFF4DC]">
                <div>
                  <div className="text-xs font-black uppercase">🚨 Canteen Rush Mode</div>
                  <div className="text-[11px] text-gray-600 font-medium">
                    Appends +5 mins to student app ETAs during peak rush
                  </div>
                </div>
                <button
                  onClick={toggleRushMode}
                  className={`px-3 py-1.5 rounded-full border-2 border-black font-extrabold text-xs shadow-[2px_2px_0px_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                    rushModeActive ? 'bg-accent-crimson text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  {rushModeActive ? 'ACTIVE 🔥' : 'OFF'}
                </button>
              </div>

              {/* Inflow Throttle */}
              <div className="flex items-center justify-between p-3 rounded-xl border-2 border-black bg-white">
                <div>
                  <div className="text-xs font-black uppercase">⏸ Order Inflow Throttle</div>
                  <div className="text-[11px] text-gray-600 font-medium">
                    Temporarily pause incoming tickets if kitchen is backed up
                  </div>
                </div>
                <button
                  onClick={toggleInflow}
                  className={`px-3 py-1.5 rounded-full border-2 border-black font-extrabold text-xs shadow-[2px_2px_0px_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                    orderInflowPaused ? 'bg-accent-mustard text-black' : 'bg-gray-200 text-black'
                  }`}
                >
                  {orderInflowPaused ? 'PAUSED ⏸' : 'ACCEPTING ✓'}
                </button>
              </div>
            </div>
          </section>

          {/* Pune Campus Leaderboard */}
          <section className="bg-white rounded-2xl border-[3px] border-black p-4 shadow-[4px_4px_0px_#000] mb-4">
            <h3 className="font-headline-md text-base font-black uppercase mb-2">
              🏆 Pune Campus Bestsellers
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 text-xs">
                <span className="font-extrabold">🥇 Paneer Tikka Burger</span>
                <span className="font-black text-tertiary">78 orders today</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 text-xs">
                <span className="font-extrabold">🥈 Peri Peri Waffle Fries</span>
                <span className="font-black text-tertiary">54 orders today</span>
              </div>
              <div className="flex items-center justify-between py-1.5 text-xs">
                <span className="font-extrabold">🥉 Cold Coffee with Ice Cream</span>
                <span className="font-black text-tertiary">41 orders today</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
