import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert
} from 'react-native';
import { listenToAllOrders, updateOrderStatus } from '../../services/orderService';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';

interface AdminOrdersScreenProps {
  onSwitchToMenu: () => void;
}

export const AdminOrdersScreen: React.FC<AdminOrdersScreenProps> = ({ onSwitchToMenu }) => {
  const { logout, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'Active' | 'Placed' | 'Preparing' | 'Ready' | 'Completed' | 'All'>('Active');

  useEffect(() => {
    const unsubscribe = listenToAllOrders((allOrders) => {
      setOrders(allOrders);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, nextStatus);
    } catch (err: any) {
      Alert.alert('Update Failed', err.message || 'Could not update order status.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'Active') return o.status !== 'Completed';
    if (filter === 'All') return true;
    return o.status === filter;
  });

  const getNextStatusAction = (status: OrderStatus): { label: string; next: OrderStatus; color: string } | null => {
    switch (status) {
      case 'Placed':
        return { label: '🍳 Start Cooking', next: 'Preparing', color: '#2563EB' };
      case 'Preparing':
        return { label: '🔔 Mark as Ready', next: 'Ready', color: '#059669' };
      case 'Ready':
        return { label: '✅ Handover Completed', next: 'Completed', color: '#4B5563' };
      case 'Completed':
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.roleTag}>KITCHEN ADMIN PORTAL</Text>
          <Text style={styles.headerTitle}>Live Kitchen Orders 👨‍🍳</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.menuMgmtBtn}
            onPress={onSwitchToMenu}
            activeOpacity={0.8}
          >
            <Text style={styles.menuMgmtText}>🍔 Manage Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {(['Active', 'Placed', 'Preparing', 'Ready', 'Completed', 'All'] as const).map((tab) => {
          const count =
            tab === 'Active'
              ? orders.filter((o) => o.status !== 'Completed').length
              : tab === 'All'
              ? orders.length
              : orders.filter((o) => o.status === tab).length;

          const isSelected = filter === tab;

          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isSelected && styles.tabActive]}
              onPress={() => setFilter(tab)}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                {tab} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>Listening for incoming orders...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const nextAction = getNextStatusAction(item.status);
            const timeAgo = Math.round((Date.now() - item.createdAt) / 60000);

            return (
              <View style={styles.orderCard}>
                {/* Order Top Line */}
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.tokenText}>{item.orderNumber}</Text>
                    <Text style={styles.customerName}>
                      {item.userName} ({timeAgo} mins ago)
                    </Text>
                  </View>
                  <StatusBadge status={item.status} size="medium" />
                </View>

                {/* Items in Order */}
                <View style={styles.itemsBox}>
                  {item.items.map(({ menuItem, quantity }, idx) => (
                    <View key={idx} style={styles.itemRow}>
                      <Text style={styles.itemQty}>{quantity}x</Text>
                      <Text style={styles.itemName}>{menuItem.name}</Text>
                      <Text style={styles.itemPrice}>₹{menuItem.price * quantity}</Text>
                    </View>
                  ))}

                  {item.specialInstructions ? (
                    <View style={styles.instructionNote}>
                      <Text style={styles.instructionTitle}>⚠️ Note from student:</Text>
                      <Text style={styles.instructionBody}>
                        "{item.specialInstructions}"
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Total & Action Button */}
                <View style={styles.cardFooter}>
                  <Text style={styles.totalAmount}>Total: ₹{item.total}</Text>

                  {nextAction && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: nextAction.color }]}
                      onPress={() => handleUpdateStatus(item.id, nextAction.next)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.actionBtnText}>{nextAction.label}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyEmoji}>🛎️</Text>
              <Text style={styles.emptyTitle}>No Orders in this queue</Text>
              <Text style={styles.emptySub}>
                When students place orders, they will appear here instantly in real time.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  roleTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF6B00',
    letterSpacing: 1
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  menuMgmtBtn: {
    backgroundColor: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10
  },
  menuMgmtText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    padding: 8,
    borderRadius: 10
  },
  logoutText: {
    fontSize: 16
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 6
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6'
  },
  tabActive: {
    backgroundColor: '#FF6B00'
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563'
  },
  tabTextActive: {
    color: '#FFFFFF'
  },
  list: {
    padding: 16
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  tokenText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 0.5
  },
  customerName: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500'
  },
  itemsBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4
  },
  itemQty: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FF6B00',
    width: 32
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827'
  },
  instructionNote: {
    marginTop: 8,
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8
  },
  instructionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309'
  },
  instructionBody: {
    fontSize: 12,
    color: '#92400E',
    fontStyle: 'italic',
    marginTop: 2
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111827'
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280'
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 10
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827'
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20
  }
});
