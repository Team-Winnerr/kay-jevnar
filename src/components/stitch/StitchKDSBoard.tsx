import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { listenToAllOrders, updateOrderStatus, verifyOrderOtp } from '../../services/orderService';

export const StitchKDSBoard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Placed' | 'Preparing' | 'Ready'>('All');
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [otpErrors, setOtpErrors] = useState<Record<string, string>>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    const unsub = listenToAllOrders((allOrders) => {
      // Keep only active / non-completed orders for KDS dispatch (plus recent completed if needed)
      setOrders(allOrders);
    });
    return unsub;
  }, []);

  const newOrders = orders.filter((o) => o.status === 'Placed');
  const cookingOrders = orders.filter((o) => o.status === 'Preparing');
  const readyOrders = orders.filter((o) => o.status === 'Ready');
  const completedOrders = orders.filter((o) => o.status === 'Completed');

  const filteredOrders = orders.filter((o) => {
    if (selectedFilter === 'All') return o.status !== 'Completed' && o.status !== 'Cancelled';
    return o.status === selectedFilter;
  });

  const handleStartPreparing = async (orderId: string) => {
    await updateOrderStatus(orderId, 'Preparing');
    setSuccessToast(`Order updated: Started Cooking 🍳`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleMarkReady = async (orderId: string) => {
    await updateOrderStatus(orderId, 'Ready');
    setSuccessToast(`Order updated: Ready for Pickup 🔔`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleVerifyOtp = async (order: Order) => {
    const entered = otpInputs[order.id] || '';
    if (entered.length < 4) {
      setOtpErrors((prev) => ({ ...prev, [order.id]: 'Please enter all 4 digits of the OTP' }));
      return;
    }

    const result = await verifyOrderOtp(order.id, entered, order.pickupOtp);
    if (!result.success) {
      setOtpErrors((prev) => ({ ...prev, [order.id]: result.message }));
    } else {
      setOtpErrors((prev) => ({ ...prev, [order.id]: '' }));
      setSuccessToast(`✓ ${result.message}`);
      setTimeout(() => setSuccessToast(null), 3500);
    }
  };

  const handleOtpChange = (orderId: string, val: string) => {
    const numeric = val.replace(/\D/g, '').slice(0, 4);
    setOtpInputs((prev) => ({ ...prev, [orderId]: numeric }));
    if (otpErrors[orderId]) {
      setOtpErrors((prev) => ({ ...prev, [orderId]: '' }));
    }
  };

  const getElapsedMins = (createdAt: number) => {
    const diffMs = Date.now() - createdAt;
    const mins = Math.floor(diffMs / 60000);
    return mins <= 0 ? 'just now' : `${mins}m ago`;
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-20 z-50 bg-[#059669] text-white font-label-md px-5 py-2.5 rounded-full border-2 border-on-surface shadow-[4px_4px_0px_#000] flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="font-extrabold text-sm">{successToast}</span>
        </div>
      )}

      {/* Mobile/Tablet Viewport Container */}
      <main className="w-full max-w-[480px] min-h-screen bg-[#FED97C] flex flex-col relative pb-32 border-x-2 border-on-surface shadow-[6px_0px_0px_0px_#0A0A0A]">
        
        {/* Sticky Header with Live Status Counters */}
        <header className="sticky top-0 z-40 bg-[#FED97C] border-b-2 border-on-surface px-4 py-3 shadow-[0px_4px_0px_0px_#0A0A0A]">
          <div className="flex items-center justify-between pb-2 border-b-2 border-on-surface">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-mustard border-2 border-on-surface shadow-[2px_2px_0px_0px_#0A0A0A]">
                <span className="material-symbols-outlined text-on-surface text-[18px]">soup_kitchen</span>
              </span>
              <h1 className="font-headline-lg-mobile text-2xl font-black tracking-wide uppercase leading-none text-on-surface">
                काय Jevnar? KDS
              </h1>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 bg-accent-crimson text-white font-label-sm text-[11px] px-2.5 py-0.5 rounded-full border-2 border-on-surface shadow-[2px_2px_0px_0px_#0A0A0A] font-extrabold">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                LIVE QUEUE
              </span>
            </div>
          </div>

          {/* Quick Stats Banner (3 Counters) */}
          <div className="grid grid-cols-3 gap-2 pt-3">
            <div className="bg-white border-2 border-on-surface rounded-xl p-1.5 text-center shadow-[2px_2px_0px_0px_#0A0A0A] flex flex-col items-center justify-center">
              <span className="text-[11px] font-extrabold text-on-surface">🔥 In Queue</span>
              <span className="font-headline-lg-mobile text-2xl font-black leading-tight text-on-surface">
                {newOrders.length}
              </span>
            </div>

            <div className="bg-[#FED97C] border-2 border-on-surface rounded-xl p-1.5 text-center shadow-[2px_2px_0px_0px_#0A0A0A] flex flex-col items-center justify-center">
              <span className="text-[11px] font-extrabold text-on-surface">🍳 Cooking</span>
              <span className="font-headline-lg-mobile text-2xl font-black leading-tight text-on-surface">
                {cookingOrders.length}
              </span>
            </div>

            <div className="bg-accent-mint border-2 border-on-surface rounded-xl p-1.5 text-center shadow-[2px_2px_0px_0px_#0A0A0A] flex flex-col items-center justify-center">
              <span className="text-[11px] font-extrabold text-on-surface">🔔 Ready</span>
              <span className="font-headline-lg-mobile text-2xl font-black leading-tight text-on-surface">
                {readyOrders.length}
              </span>
            </div>
          </div>

          {/* Filter Pill Tabs */}
          <nav className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedFilter('All')}
              className={`rounded-full border-2 border-on-surface px-3 py-1 font-extrabold whitespace-nowrap transition-transform active:translate-x-[2px] active:translate-y-[2px] ${
                selectedFilter === 'All'
                  ? 'bg-accent-mustard text-black shadow-[2px_2px_0px_0px_#0A0A0A]'
                  : 'bg-white text-gray-700'
              }`}
            >
              All Active ({newOrders.length + cookingOrders.length + readyOrders.length})
            </button>

            <button
              onClick={() => setSelectedFilter('Placed')}
              className={`rounded-full border-2 border-on-surface px-3 py-1 font-extrabold whitespace-nowrap transition-transform active:translate-x-[2px] active:translate-y-[2px] ${
                selectedFilter === 'Placed'
                  ? 'bg-accent-crimson text-white shadow-[2px_2px_0px_0px_#0A0A0A]'
                  : 'bg-white text-gray-700'
              }`}
            >
              🔥 New ({newOrders.length})
            </button>

            <button
              onClick={() => setSelectedFilter('Preparing')}
              className={`rounded-full border-2 border-on-surface px-3 py-1 font-extrabold whitespace-nowrap transition-transform active:translate-x-[2px] active:translate-y-[2px] ${
                selectedFilter === 'Preparing'
                  ? 'bg-accent-cyan text-black shadow-[2px_2px_0px_0px_#0A0A0A]'
                  : 'bg-white text-gray-700'
              }`}
            >
              🍳 Cooking ({cookingOrders.length})
            </button>

            <button
              onClick={() => setSelectedFilter('Ready')}
              className={`rounded-full border-2 border-on-surface px-3 py-1 font-extrabold whitespace-nowrap transition-transform active:translate-x-[2px] active:translate-y-[2px] ${
                selectedFilter === 'Ready'
                  ? 'bg-accent-mint text-black shadow-[2px_2px_0px_0px_#0A0A0A]'
                  : 'bg-white text-gray-700'
              }`}
            >
              🔔 Ready ({readyOrders.length})
            </button>
          </nav>
        </header>

        {/* Orders Kanban Stream */}
        <section className="px-4 py-4 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white border-2 border-on-surface rounded-2xl p-8 text-center shadow-[4px_4px_0px_0px_#0A0A0A]">
              <span className="text-4xl">👨‍🍳</span>
              <h3 className="font-headline-sm text-lg font-black mt-2">All Clear, Chef!</h3>
              <p className="text-xs text-gray-600 mt-1">
                No orders pending in this section. Place an order on the student app to see live tickets arrive!
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const enteredOtp = otpInputs[order.id] || '';
              const hasOtpError = otpErrors[order.id];

              // STATE 1: NEW ORDER (PLACED)
              if (order.status === 'Placed') {
                return (
                  <article
                    key={order.id}
                    className="bg-white rounded-2xl border-[3.5px] border-on-surface shadow-[4px_4px_0px_0px_#0A0A0A] p-4 relative overflow-hidden transition-all hover:rotate-[-0.5deg]"
                  >
                    {/* Top Flash Pill */}
                    <div className="flex items-center justify-between border-b-2 border-on-surface pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-lg-mobile text-2xl font-black text-on-surface leading-none">
                          #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="bg-[#ffdad6] text-[#ba1a1a] border-2 border-on-surface text-[11px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-[1px_1px_0px_0px_#0A0A0A]">
                          <span className="material-symbols-outlined text-[14px]">timer</span>{' '}
                          {getElapsedMins(order.createdAt)}
                        </span>
                        {order.paymentStatus === 'Paid' ? (
                          <span className="bg-emerald-100 text-emerald-800 border-2 border-on-surface text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                            💳 PAID
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 border-2 border-on-surface text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                            💵 COLLECT ₹{order.total}
                          </span>
                        )}
                      </div>
                      <span className="bg-accent-crimson text-white text-[11px] font-black px-2.5 py-1 rounded-full border-2 border-on-surface uppercase tracking-wider shadow-[2px_2px_0px_0px_#0A0A0A]">
                        🔥 NEW ORDER
                      </span>
                    </div>

                    {/* Student Details & OTP Stamp Box */}
                    <div className="flex items-center justify-between mb-3 bg-[#FFF4DC] p-2.5 rounded-xl border-2 border-on-surface">
                      <div>
                        <span className="text-[10px] font-extrabold text-gray-600 block uppercase">STUDENT</span>
                        <span className="font-title-md text-sm text-on-surface font-extrabold flex items-center gap-1">
                          {order.studentName || order.userName || 'Student'}
                          <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                        </span>
                      </div>

                      {/* Prominent Red Dashed OTP Box */}
                      <div className="bg-white border-2 border-dashed border-accent-crimson rounded-lg px-2.5 py-1 text-center shadow-[2px_2px_0px_0px_#BA2424]">
                        <span className="text-[9px] font-black text-accent-crimson block tracking-wide">
                          STUDENT OTP
                        </span>
                        <span className="font-headline-md text-lg font-black text-accent-crimson tracking-widest leading-none">
                          {(order.pickupOtp || order.orderNumber?.replace('KJ-', '') || '1234').slice(0, 4).split('').join(' ')}
                        </span>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="space-y-2 mb-4 bg-[#fcf8f8] p-3 rounded-xl border-2 border-on-surface">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
                        >
                          <div className="flex-1 pr-2">
                            <p className="text-sm text-on-surface font-extrabold">
                              <span className="bg-accent-mustard text-black px-1.5 py-0.5 rounded border border-on-surface mr-1.5 text-xs">
                                {item.quantity}x
                              </span>
                              {item.menuItem.name}
                            </p>
                            {order.specialInstructions && (
                              <p className="text-xs text-tertiary font-bold ml-6 mt-0.5">
                                ⚠️ {order.specialInstructions}
                              </p>
                            )}
                          </div>
                          <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded border border-on-surface font-mono font-bold">
                            100% VEG
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button: Start Cooking */}
                    <button
                      onClick={() => handleStartPreparing(order.id)}
                      className="w-full bg-[#2563EB] text-white text-sm py-3 px-4 rounded-full border-2 border-on-surface shadow-[4px_4px_0px_0px_#0A0A0A] flex items-center justify-center gap-2 uppercase tracking-wider font-extrabold hover:bg-blue-700 active:translate-x-[2px] active:translate-y-[2px] transition-all"
                    >
                      <span>▶ START PREPARING (Move to Cooking)</span>
                      <span className="text-base">🍳</span>
                    </button>
                  </article>
                );
              }

              // STATE 2: COOKING IN PROGRESS (PREPARING)
              if (order.status === 'Preparing') {
                return (
                  <article
                    key={order.id}
                    className="bg-white rounded-2xl border-[3.5px] border-on-surface shadow-[4px_4px_0px_0px_#0A0A0A] p-4 relative overflow-hidden transition-all hover:rotate-[0.5deg]"
                  >
                    {/* Top Details */}
                    <div className="flex items-center justify-between border-b-2 border-on-surface pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-lg-mobile text-2xl font-black text-on-surface leading-none">
                          #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="bg-[#fedb71] text-black border-2 border-on-surface text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-[1px_1px_0px_0px_#0A0A0A]">
                          <span className="material-symbols-outlined text-[14px]">soup_kitchen</span>{' '}
                          {order.studentName || 'Student'}
                        </span>
                      </div>
                      <span className="bg-accent-cyan text-on-surface text-[11px] font-black px-2.5 py-1 rounded-full border-2 border-on-surface uppercase tracking-wider shadow-[2px_2px_0px_0px_#0A0A0A] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-black animate-ping inline-block"></span>
                        Cooking: ~6 mins
                      </span>
                    </div>

                    {/* Animated Progress Meter */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-[11px] font-black mb-1.5">
                        <span className="flex items-center gap-1">⏱ GRILL & FRYER LOAD</span>
                        <span className="text-on-surface bg-accent-mustard px-2 py-0.5 rounded border border-on-surface shadow-[1px_1px_0px_0px_#0A0A0A]">
                          75% DONE
                        </span>
                      </div>
                      <div className="w-full h-4 bg-gray-200 rounded-full border-2 border-on-surface overflow-hidden p-0.5">
                        <div className="h-full bg-accent-cyan rounded-full border border-on-surface animated-stripes w-3/4"></div>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="space-y-2 mb-4 bg-[#fcf8f8] p-3 rounded-xl border-2 border-on-surface">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
                        >
                          <p className="text-sm text-on-surface font-extrabold">
                            <span className="bg-accent-cyan text-black px-1.5 py-0.5 rounded border border-on-surface mr-1.5 text-xs">
                              {item.quantity}x
                            </span>
                            {item.menuItem.name}
                          </p>
                          <span className="text-[10px] font-bold bg-accent-mint text-black px-2 py-0.5 rounded border border-on-surface">
                            ON GRILL
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Action Button: Mark Ready */}
                    <button
                      onClick={() => handleMarkReady(order.id)}
                      className="w-full bg-[#059669] text-white text-sm py-3 px-4 rounded-full border-2 border-on-surface shadow-[4px_4px_0px_0px_#0A0A0A] flex items-center justify-center gap-2 uppercase tracking-wider font-extrabold hover:bg-emerald-700 active:translate-x-[2px] active:translate-y-[2px] transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                      <span>MARK READY FOR PICKUP</span>
                    </button>
                  </article>
                );
              }

              // STATE 3: READY AT COUNTER & OTP VERIFICATION
              if (order.status === 'Ready') {
                return (
                  <article
                    key={order.id}
                    className="bg-white rounded-2xl border-[3.5px] border-on-surface shadow-[4px_4px_0px_0px_#0A0A0A] p-4 relative overflow-hidden transition-all border-l-[10px] border-l-[#059669]"
                  >
                    {/* Top Status */}
                    <div className="flex items-center justify-between border-b-2 border-on-surface pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-lg-mobile text-2xl font-black text-on-surface leading-none">
                          #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="bg-gray-200 border-2 border-on-surface text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {order.studentName || 'Student'}
                        </span>
                      </div>
                      <span className="bg-accent-crimson/15 text-accent-crimson text-[11px] font-black px-2.5 py-1 rounded-full border-2 border-accent-crimson uppercase tracking-wider">
                        Waiting for OTP
                      </span>
                    </div>

                    {/* Big Banner Notification */}
                    <div className="bg-accent-mint border-2 border-on-surface rounded-xl p-2.5 text-center mb-3 shadow-[2px_2px_0px_0px_#0A0A0A] flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-on-surface text-[20px]">notifications</span>
                      <span className="text-xs text-on-surface uppercase tracking-wide font-extrabold">
                        COUNTER READY • BELL RUNG 🔔
                      </span>
                    </div>

                    {/* Quick Summary of Bag */}
                    <div className="bg-[#FFF4DC] border-2 border-on-surface rounded-xl p-2.5 mb-3 flex items-center justify-between text-xs">
                      <span className="font-extrabold">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} Items (Bagged & Sealed)
                      </span>
                      <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        TRAY #{order.id.slice(-2)}
                      </span>
                    </div>

                    {/* OTP Verification Keypad Input Box */}
                    <div className="bg-[#fcf8f8] border-2 border-on-surface rounded-xl p-3 mb-4 text-center">
                      <p className="text-[10px] font-black text-gray-700 mb-2 uppercase tracking-wider">
                        ENTER 4-DIGIT STUDENT HANDOVER OTP
                      </p>

                      <div className="flex justify-center items-center gap-2 mb-2">
                        {[0, 1, 2, 3].map((idx) => {
                          const digit = enteredOtp[idx] || '';
                          return (
                            <div
                              key={idx}
                              className={`w-11 h-11 border-2 border-on-surface rounded-xl flex items-center justify-center font-headline-md text-xl font-black shadow-[2px_2px_0px_0px_#0A0A0A] ${
                                digit
                                  ? 'bg-accent-mustard text-black ring-2 ring-black'
                                  : 'bg-white text-gray-400'
                              }`}
                            >
                              {digit || '•'}
                            </div>
                          );
                        })}
                      </div>

                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        value={enteredOtp}
                        onChange={(e) => handleOtpChange(order.id, e.target.value)}
                        placeholder="Type 4-digit code..."
                        className="w-44 text-center py-1.5 px-2 bg-white rounded-lg border-2 border-black font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-accent-crimson shadow-[2px_2px_0px_#000]"
                      />

                      {/* Hint showing target OTP for frictionless testing */}
                      <p className="text-[10px] text-gray-500 font-semibold mt-1.5">
                        (Student OTP Code is: <span className="font-bold text-accent-crimson">{order.pickupOtp}</span>)
                      </p>

                      {hasOtpError && (
                        <p className="text-xs text-red-600 font-bold mt-1">{hasOtpError}</p>
                      )}
                    </div>

                    {/* Action Button: Verify OTP & Complete Handover */}
                    <button
                      onClick={() => handleVerifyOtp(order)}
                      className="w-full bg-[#059669] text-white text-sm py-3 px-4 rounded-full border-2 border-on-surface shadow-[4px_4px_0px_0px_#0A0A0A] flex items-center justify-center gap-2 uppercase tracking-wider font-extrabold hover:bg-emerald-600 active:translate-x-[2px] active:translate-y-[2px] transition-all"
                    >
                      <span>VERIFY OTP & HAND OVER MEAL</span>
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    </button>
                  </article>
                );
              }

              return null;
            })
          )}
        </section>
      </main>
    </div>
  );
};
