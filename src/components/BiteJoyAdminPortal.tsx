import React, { useEffect, useState } from 'react';
import { listenToAllOrders, updateOrderStatus } from '../services/orderService';
import { listenToMenuItems, toggleItemAvailability } from '../services/menuService';
import { Order, MenuItem, OrderStatus } from '../types';

export const BiteJoyAdminPortal: React.FC = () => {
  const [tab, setTab] = useState<'orders' | 'menu'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderFilter, setOrderFilter] = useState<'Active' | 'Placed' | 'Preparing' | 'Ready' | 'Completed' | 'All'>('Active');

  useEffect(() => {
    const unsubOrders = listenToAllOrders(setOrders);
    const unsubMenu = listenToMenuItems(setMenuItems);
    return () => {
      unsubOrders();
      unsubMenu();
    };
  }, []);

  const handleUpdate = async (id: string, next: OrderStatus) => {
    try {
      await updateOrderStatus(id, next);
    } catch (e: any) {
      alert('Failed: ' + e.message);
    }
  };

  const handleToggleStock = async (item: MenuItem) => {
    try {
      await toggleItemAvailability(item.id, !item.isAvailable);
    } catch (e: any) {
      alert('Failed: ' + e.message);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'Active') return o.status !== 'Completed';
    if (orderFilter === 'All') return true;
    return o.status === orderFilter;
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '900', color: '#FF5B22', letterSpacing: '1.5px', textTransform: 'uppercase', background: '#FFF1EB', padding: '4px 8px', borderRadius: '8px' }}>
            CANTEEN MANAGEMENT PORTAL
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '6px 0 0', color: '#161616' }}>
            Kitchen Operations 👨‍🍳
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setTab('orders')}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              fontWeight: '900',
              cursor: 'pointer',
              backgroundColor: tab === 'orders' ? '#161616' : '#F5F5F5',
              color: tab === 'orders' ? '#FFFFFF' : '#4B5563'
            }}
          >
            Live Orders ({orders.filter(o => o.status !== 'Completed').length})
          </button>
          <button
            onClick={() => setTab('menu')}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              fontWeight: '900',
              cursor: 'pointer',
              backgroundColor: tab === 'menu' ? '#161616' : '#F5F5F5',
              color: tab === 'menu' ? '#FFFFFF' : '#4B5563'
            }}
          >
            Inventory & Stock
          </button>
        </div>
      </div>

      {tab === 'orders' ? (
        <div>
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {(['Active', 'Placed', 'Preparing', 'Ready', 'Completed', 'All'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setOrderFilter(f)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  border: orderFilter === f ? '1.5px solid #FF5B22' : '1px solid #EBE6DF',
                  background: orderFilter === f ? '#FFF2EC' : '#FFFFFF',
                  color: orderFilter === f ? '#FF5B22' : '#78716C',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '60px 20px', textAlign: 'center', border: '1.5px solid #F0ECE6' }}>
              <span style={{ fontSize: '48px' }}>🛎️</span>
              <h4 style={{ fontSize: '18px', fontWeight: '800', margin: '12px 0 4px' }}>No orders in this queue</h4>
              <p style={{ color: '#78716C', margin: 0, fontSize: '14px' }}>Incoming student orders will appear live automatically.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {filteredOrders.map((order) => {
                const timeAgo = Math.round((Date.now() - order.createdAt) / 60000);
                return (
                  <div
                    key={order.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '24px',
                      padding: '20px',
                      border: '1.5px solid #F0ECE6',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '24px', fontWeight: '900', color: '#161616' }}>
                            {order.orderNumber}
                          </div>
                          <div style={{ fontSize: '12px', color: '#78716C' }}>
                            {order.userName} • {timeAgo}m ago
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '900',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            backgroundColor: order.status === 'Ready' ? '#ECFDF5' : order.status === 'Preparing' ? '#EFF6FF' : '#FFF7ED',
                            color: order.status === 'Ready' ? '#047857' : order.status === 'Preparing' ? '#1D4ED8' : '#C2410C'
                          }}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div style={{ backgroundColor: '#FAF7F2', padding: '12px', borderRadius: '14px', marginBottom: '14px' }}>
                        {order.items.map(({ menuItem, quantity }, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '4px 0', fontWeight: '700' }}>
                            <span><span style={{ color: '#FF5B22', marginRight: '6px' }}>{quantity}x</span> {menuItem.name}</span>
                            <span>₹{menuItem.price * quantity}</span>
                          </div>
                        ))}

                        {order.specialInstructions && (
                          <div style={{ fontSize: '11px', color: '#B45309', background: '#FEF3C7', padding: '6px 8px', borderRadius: '8px', marginTop: '8px', fontWeight: '700' }}>
                            ⚠️ Note: "{order.specialInstructions}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '16px', marginBottom: '14px' }}>
                        <span>Total:</span>
                        <span>₹{order.total}</span>
                      </div>

                      {order.status === 'Placed' && (
                        <button
                          onClick={() => handleUpdate(order.id, 'Preparing')}
                          style={{ width: '100%', backgroundColor: '#2563EB', color: '#FFF', border: 'none', padding: '12px', borderRadius: '14px', fontWeight: '900', cursor: 'pointer' }}
                        >
                          🍳 Start Cooking
                        </button>
                      )}

                      {order.status === 'Preparing' && (
                        <button
                          onClick={() => handleUpdate(order.id, 'Ready')}
                          style={{ width: '100%', backgroundColor: '#059669', color: '#FFF', border: 'none', padding: '12px', borderRadius: '14px', fontWeight: '900', cursor: 'pointer' }}
                        >
                          🔔 Mark as Ready for Pickup
                        </button>
                      )}

                      {order.status === 'Ready' && (
                        <button
                          onClick={() => handleUpdate(order.id, 'Completed')}
                          style={{ width: '100%', backgroundColor: '#161616', color: '#FFF', border: 'none', padding: '12px', borderRadius: '14px', fontWeight: '900', cursor: 'pointer' }}
                        >
                          ✅ Complete Handover
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Inventory Management */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '16px',
                border: '1.5px solid #F0ECE6',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <img src={item.imageUrl} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '800', fontSize: '15px', color: '#161616' }}>{item.name}</div>
                <div style={{ fontSize: '13px', color: '#78716C', marginTop: '2px' }}>₹{item.price} • {item.category}</div>
              </div>

              <button
                onClick={() => handleToggleStock(item)}
                style={{
                  backgroundColor: item.isAvailable ? '#ECFDF5' : '#FEE2E2',
                  color: item.isAvailable ? '#059669' : '#DC2626',
                  border: `1.5px solid ${item.isAvailable ? '#10B981' : '#EF4444'}`,
                  borderRadius: '12px',
                  padding: '6px 12px',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {item.isAvailable ? 'In Stock' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
