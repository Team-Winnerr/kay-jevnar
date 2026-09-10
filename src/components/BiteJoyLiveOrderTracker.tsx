import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order, OrderStatus } from '../types';

interface BiteJoyLiveOrderTrackerProps {
  orderId: string;
  onBackToMenu: () => void;
}

const STEPS: { key: OrderStatus; label: string; icon: string }[] = [
  { key: 'Placed', label: 'Order Placed', icon: '📝' },
  { key: 'Preparing', label: 'Cooking in Kitchen', icon: '🍳' },
  { key: 'Ready', label: 'Ready for Pickup', icon: '🔔' },
  { key: 'Completed', label: 'Picked Up', icon: '✨' }
];

export const BiteJoyLiveOrderTracker: React.FC<BiteJoyLiveOrderTrackerProps> = ({
  orderId,
  onBackToMenu
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'orders', orderId), (docSnap) => {
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
      }
      setLoading(false);
    });
    return unsub;
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>🍳</div>
        <h3 style={{ fontSize: '20px', fontWeight: '900' }}>Connecting to campus kitchen...</h3>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h3>Order not found.</h3>
        <button onClick={onBackToMenu} style={{ backgroundColor: '#FF5B22', color: '#FFF', padding: '10px 20px', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
          Return to Menu
        </button>
      </div>
    );
  }

  const getStepIndex = (s: OrderStatus) => {
    switch (s) {
      case 'Placed': return 0;
      case 'Preparing': return 1;
      case 'Ready': return 2;
      case 'Completed': return 3;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(order.status);
  const isReady = order.status === 'Ready';

  return (
    <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 20px' }}>
      {/* Ready Alert */}
      {isReady && (
        <div style={{ backgroundColor: '#ECFDF5', border: '2px solid #10B981', borderRadius: '20px', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <span style={{ fontSize: '36px' }}>🔔</span>
          <div>
            <div style={{ color: '#065F46', fontWeight: '900', fontSize: '18px' }}>
              YOUR FOOD IS READY FOR PICKUP!
            </div>
            <div style={{ color: '#047857', fontSize: '14px', marginTop: '4px', fontWeight: '600' }}>
              Please show your Pickup Token at Canteen Counter #1 or #2.
            </div>
          </div>
        </div>
      )}

      {/* Big Token Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
          padding: '36px 24px',
          textAlign: 'center',
          border: '2px solid #F0ECE6',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.06)',
          marginBottom: '28px'
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: '900', color: '#A8A29E', letterSpacing: '2px', textTransform: 'uppercase' }}>
          CAMPUS PICKUP TOKEN
        </div>
        <div style={{ fontSize: '56px', fontWeight: '900', color: '#161616', letterSpacing: '2px', margin: '10px 0' }}>
          {order.orderNumber}
        </div>
        <div
          style={{
            display: 'inline-block',
            backgroundColor: order.status === 'Ready' ? '#ECFDF5' : order.status === 'Preparing' ? '#EFF6FF' : '#FFF7ED',
            color: order.status === 'Ready' ? '#047857' : order.status === 'Preparing' ? '#1D4ED8' : '#C2410C',
            fontWeight: '900',
            fontSize: '14px',
            padding: '8px 20px',
            borderRadius: '20px'
          }}
        >
          {order.status === 'Placed' && '📝 Order Placed'}
          {order.status === 'Preparing' && '🍳 Cooking in Kitchen'}
          {order.status === 'Ready' && '🔔 Ready for Pickup'}
          {order.status === 'Completed' && '✅ Completed'}
        </div>
      </div>

      {/* 4-Step Visual Tracker */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '24px', border: '1.5px solid #F0ECE6', marginBottom: '28px' }}>
        <h4 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '900', color: '#161616' }}>
          Live Status Progression
        </h4>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: isDone ? '#10B981' : isCurrent ? '#FF5B22' : '#F5F5F5',
                    color: isDone || isCurrent ? '#FFFFFF' : '#A8A29E',
                    border: isCurrent ? '3px solid #FF5B22' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '18px',
                    marginBottom: '8px',
                    boxShadow: isCurrent ? '0 4px 14px rgba(255, 91, 34, 0.4)' : 'none'
                  }}
                >
                  {isDone ? '✓' : step.icon}
                </div>
                <div style={{ fontSize: '12px', fontWeight: isCurrent ? '900' : '700', color: isCurrent ? '#FF5B22' : isDone ? '#10B981' : '#A8A29E', textAlign: 'center' }}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '24px', border: '1.5px solid #F0ECE6', marginBottom: '28px' }}>
        <h4 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '900', color: '#161616' }}>
          Order Items
        </h4>

        {order.items.map(({ menuItem, quantity }, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F5F1EB' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#161616' }}>
              <span style={{ color: '#FF5B22', marginRight: '8px' }}>{quantity}x</span>
              {menuItem.name}
            </span>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#161616' }}>
              ₹{menuItem.price * quantity}
            </span>
          </div>
        ))}

        {order.specialInstructions && (
          <div style={{ backgroundColor: '#FAF7F2', padding: '10px 14px', borderRadius: '10px', marginTop: '12px', fontSize: '13px', color: '#78716C', fontStyle: 'italic' }}>
            Note: "{order.specialInstructions}"
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed #E5E1DA', fontSize: '16px', fontWeight: '900', color: '#161616' }}>
          <span>Total Paid</span>
          <span style={{ color: '#10B981', fontSize: '20px' }}>₹{order.total}</span>
        </div>
      </div>

      <button
        onClick={onBackToMenu}
        style={{
          width: '100%',
          backgroundColor: '#161616',
          color: '#FFFFFF',
          border: 'none',
          padding: '16px',
          borderRadius: '16px',
          fontWeight: '900',
          fontSize: '15px',
          cursor: 'pointer'
        }}
      >
        Order Another Meal 🍱
      </button>
    </div>
  );
};
