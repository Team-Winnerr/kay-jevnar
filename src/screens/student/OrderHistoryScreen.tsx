import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { listenToStudentOrders } from '../../services/orderService';
import { Order } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

interface OrderHistoryScreenProps {
  onBack: () => void;
  onSelectOrder: (orderId: string) => void;
}

export const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({
  onBack,
  onSelectOrder
}) => {
  const { firebaseUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) return;
    const unsubscribe = listenToStudentOrders(firebaseUser.uid, (userOrders) => {
      setOrders(userOrders);
      setLoading(false);
    });
    return unsubscribe;
  }, [firebaseUser]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Menu</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const dateStr = new Date(item.createdAt).toLocaleString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => onSelectOrder(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.tokenText}>{item.orderNumber}</Text>
                    <Text style={styles.dateText}>{dateStr}</Text>
                  </View>
                  <StatusBadge status={item.status} size="small" />
                </View>

                <View style={styles.itemsPreview}>
                  <Text style={styles.itemSummary} numberOfLines={2}>
                    {item.items
                      .map((ci) => `${ci.quantity}x ${ci.menuItem.name}`)
                      .join(', ')}
                  </Text>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.totalText}>Total: ₹{item.total}</Text>
                  <Text style={styles.trackLink}>Track Live ➔</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Text style={styles.emptyTitle}>No Orders Placed Yet</Text>
              <Text style={styles.emptySub}>
                Your past campus orders and bills will show up here.
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
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF6B00'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827'
  },
  list: {
    padding: 16
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  tokenText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111827'
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2
  },
  itemsPreview: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12
  },
  itemSummary: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827'
  },
  trackLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B00'
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
