import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { Order } from '../types';
import { getItemPriceINR } from '../utils/price';
import { resolveFoodImage } from '../utils/image';

import { initiateRazorpayPayment } from '../services/razorpayService';

interface BiteJoyCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  onRequireAuth: () => void;
}

export const BiteJoyCartDrawer: React.FC<BiteJoyCartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
  onRequireAuth
}) => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, tax, total } = useCart();
  const { firebaseUser, profile } = useAuth();
  const [instructions, setInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [payMethod, setPayMethod] = useState<'razorpay' | 'cash'>('razorpay');

  if (!isOpen) return null;

  const handleRazorpayCheckout = async () => {
    if (items.length === 0) return;

    if (!firebaseUser) {
      onClose();
      onRequireAuth();
      return;
    }

    setSubmitting(true);
    try {
      const uid = firebaseUser.uid;
      const sName = profile?.name || 'Campus Student';
      const sEmail = profile?.email || firebaseUser.email || 'student@campus.edu';
      const sPhone = profile?.phone || '9876543210';

      if (payMethod === 'razorpay') {
        // Trigger Razorpay Test Checkout
        let paymentResponse;
        try {
          paymentResponse = await initiateRazorpayPayment({
            amountINR: total,
            studentName: sName,
            studentEmail: sEmail,
            studentPhone: sPhone,
            orderDescription: `काय Jevnar? Meal (${items.length} items)`
          });
        } catch (paymentErr: any) {
          alert('Razorpay Checkout: ' + (paymentErr.message || 'Payment not completed'));
          setSubmitting(false);
          return;
        }

        // Successfully paid via Razorpay
        const order = await createOrder(
          uid,
          sName,
          sEmail,
          items,
          subtotal,
          tax,
          total,
          instructions,
          {
            paymentMethod: 'Razorpay',
            paymentStatus: 'Paid',
            razorpayPaymentId: paymentResponse.razorpay_payment_id
          }
        );
        clearCart();
        onClose();
        onOrderSuccess(order);
      } else {
        // Pay Cash at Counter
        const order = await createOrder(
          uid,
          sName,
          sEmail,
          items,
          subtotal,
          tax,
          total,
          instructions,
          {
            paymentMethod: 'Cash at Counter',
            paymentStatus: 'Pending',
            razorpayPaymentId: ''
          }
        );
        clearCart();
        onClose();
        onOrderSuccess(order);
      }
    } catch (err: any) {
      alert('Order failed: ' + (err.message || 'Please check connection.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    /* ── Backdrop ───────────────────────────────────────────── */
    <div
      className="fixed inset-0 z-[999] flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      {/* ── Sheet ───────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-[440px] max-h-[92vh] flex flex-col bg-[#FED97C] border-4 border-black rounded-t-3xl sm:rounded-3xl shadow-[8px_8px_0px_#000] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-4 border-b-4 border-black bg-[#FED97C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-[2px_2px_0px_#555] flex-shrink-0">
              <span className="text-lg">🛍️</span>
            </div>
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-black/50 leading-none">
                Food Tray
              </p>
              <h2 className="font-headline-md text-2xl font-black uppercase tracking-wide leading-tight text-black">
                Your Cart
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#555] hover:bg-gray-800 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            aria-label="Close cart"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Item Count Badge ───────────────────────────────── */}
        {items.length > 0 && (
          <div className="flex-shrink-0 px-5 pt-3 flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-black/60 uppercase tracking-wider">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </span>
            <button
              onClick={() => clearCart()}
              className="text-[11px] font-extrabold text-accent-crimson underline underline-offset-2 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
        )}

        {/* ── Scrollable Body ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-3">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-20 h-20 rounded-3xl bg-white border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center">
                <span className="text-4xl">🛒</span>
              </div>
              <div className="text-center">
                <p className="font-headline-md text-xl font-black uppercase">Cart is empty!</p>
                <p className="text-sm text-black/60 font-medium mt-1">
                  Browse the menu and add something delicious 🍔
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 bg-accent-crimson text-white font-extrabold text-sm px-6 py-2.5 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                Browse Menu ➔
              </button>
            </div>
          ) : (
            <>
              {/* Item Cards */}
              {items.map(({ menuItem, quantity }) => (
                <div
                  key={menuItem.id}
                  className="bg-white rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] p-3 flex gap-3 items-center"
                >
                  {/* Food image */}
                  <div className="w-16 h-16 flex-shrink-0 rounded-xl border-2 border-black overflow-hidden bg-accent-mustard shadow-[2px_2px_0px_#000]">
                    <img
                      src={resolveFoodImage(menuItem.imageUrl, menuItem.name)}
                      alt={menuItem.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-sm text-black truncate leading-tight">{menuItem.name}</p>
                    <p className="text-accent-crimson font-black text-sm mt-0.5">
                      ₹{getItemPriceINR(menuItem) * quantity}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                        className="w-7 h-7 rounded-full bg-[#FED97C] border-2 border-black font-black text-base flex items-center justify-center shadow-[1px_1px_0px_#000] active:translate-x-px active:translate-y-px transition-transform leading-none"
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-black text-sm">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                        className="w-7 h-7 rounded-full bg-[#FED97C] border-2 border-black font-black text-base flex items-center justify-center shadow-[1px_1px_0px_#000] active:translate-x-px active:translate-y-px transition-transform leading-none"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(menuItem.id)}
                        className="ml-1 text-[11px] text-black/40 font-extrabold hover:text-accent-crimson transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Kitchen Note */}
              <div className="bg-white rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] p-3 mt-1">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-black/60 mb-2">
                  🍳 Kitchen Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra spicy, no onions, extra napkins..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-[#FED97C] rounded-xl border-2 border-black px-3 py-2 text-xs font-semibold text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-accent-crimson"
                />
              </div>
            </>
          )}
        </div>

        {/* ── Footer (only when items exist) ─────────────────── */}
        {items.length > 0 && (
          <div className="flex-shrink-0 bg-white border-t-4 border-black px-5 pt-4 pb-5 flex flex-col gap-3">
            {/* Price breakdown */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-extrabold text-black/60">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs font-extrabold text-black/60">
                <span>GST (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="h-px bg-black/10 my-0.5" />
              <div className="flex justify-between text-base font-black text-black">
                <span>Total</span>
                <span className="text-accent-crimson">₹{total}</span>
              </div>
            </div>

            {/* Payment Method Switcher */}
            {firebaseUser && (
              <div className="bg-[#FED97C] p-2 rounded-xl border-2 border-black flex flex-col gap-1.5 shadow-[2px_2px_0px_#000]">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black uppercase text-black/70 tracking-wider">
                    PAYMENT METHOD
                  </span>
                  <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded-full border border-black text-accent-crimson">
                    TEST MODE ACTIVE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPayMethod('razorpay')}
                    className={`py-1.5 px-2 rounded-lg border-2 border-black text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      payMethod === 'razorpay'
                        ? 'bg-[#2563EB] text-white shadow-[2px_2px_0px_#000]'
                        : 'bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    <span>💳</span>
                    <span>Razorpay UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('cash')}
                    className={`py-1.5 px-2 rounded-lg border-2 border-black text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      payMethod === 'cash'
                        ? 'bg-accent-crimson text-white shadow-[2px_2px_0px_#000]'
                        : 'bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    <span>💵</span>
                    <span>Pay at Counter</span>
                  </button>
                </div>
              </div>
            )}

            {/* Checkout CTA */}
            {!firebaseUser ? (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onRequireAuth();
                  }}
                  className="w-full bg-[#FF5B22] text-white font-black text-sm uppercase tracking-widest py-3.5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In to Place Order</span>
                  <span className="text-base">🔑</span>
                </button>
                <p className="text-center text-[11px] font-extrabold text-amber-900 bg-amber-100 py-1.5 px-3 rounded-lg border border-amber-300">
                  ⚠️ Please sign in with your college account to checkout
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={handleRazorpayCheckout}
                  disabled={submitting}
                  className={`w-full text-white font-black text-sm uppercase tracking-widest py-3.5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    payMethod === 'razorpay' ? 'bg-[#2563EB] hover:bg-blue-700' : 'bg-accent-crimson hover:bg-red-700'
                  }`}
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Payment…</span>
                    </>
                  ) : payMethod === 'razorpay' ? (
                    <>
                      <span>Pay ₹{total} via Razorpay</span>
                      <span className="text-base">⚡</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order & Pay at Counter</span>
                      <span className="text-base">🔐</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] font-extrabold text-black/50 tracking-wide">
                  Ordering as {profile?.name || firebaseUser.email} • Instant 4-digit pickup OTP
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
