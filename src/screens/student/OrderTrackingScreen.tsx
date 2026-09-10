import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Order } from '../../types';
import { OrderProgressTracker } from '../../components/OrderProgressTracker';
import { StatusBadge } from '../../components/StatusBadge';

interface OrderTrackingScreenProps {
  orderId: string;
  onBackToMenu: () => void;
}

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({
  orderId,
  onBackToMenu
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderDoc = doc(db, 'orders', orderId);
    const unsubscribe = onSnapshot(orderDoc, (docSnap) => {
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
      }
      setLoading(false);
    }, (err) => {
      console.warn('Error tracking order:', err);
      setLoading(false);
    });

    return unsubscribe;
  }, [orderId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>Connecting to campus kitchen...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorTitle}>Order Not Found</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={onBackToMenu}>
            <Text style={styles.primaryBtnText}>Return to Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isReady = order.status === 'Ready';
  const isCompleted = order.status === 'Completed';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBackToMenu}>
          <Text style={styles.backBtnText}>← Menu</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Order Tracking</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Ready Banner Alert */}
        {isReady && (
          <View style={styles.readyAlertBox}>
            <Text style={styles.readyAlertIcon}>🔔</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.readyAlertTitle}>FOOD IS READY FOR PICKUP!</Text>
              <Text style={styles.readyAlertSub}>
                Please head to Counter #1 or #2 and show your Order Token.
              </Text>
            </View>
          </View>
        )}

        {isCompleted && (
          <View style={styles.completedAlertBox}>
            <Text style={styles.readyAlertIcon}>✅</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.completedAlertTitle}>Order Completed & Collected</Text>
              <Text style={styles.completedAlertSub}>Hope you enjoyed your campus meal!</Text>
            </View>
          </View>
        )}

        {/* Big Pickup Token Card */}
        <View style={styles.tokenCard}>
          <Text style={styles.tokenLabel}>CANTEEN PICKUP TOKEN</Text>
          <Text style={styles.tokenNumber}>{order.orderNumber}</Text>
          <View style={styles.statusBadgeWrapper}>
            <StatusBadge status={order.status} size="large" />
          </View>
        </View>

        {/* 4-Step Visual Tracker */}
        <View style={styles.trackerCard}>
          <Text style={styles.trackerTitle}>Kitchen Status Progression</Text>
          <OrderProgressTracker status={order.status} />

          <View style={styles.statusDescriptionBox}>
            <Text style={styles.statusDescText}>
              {order.status === 'Placed' &&
                'Your order has been received by the canteen staff and is queued for preparation.'}
              {order.status === 'Preparing' &&
                'Chefs are currently preparing and cooking your fresh food in the kitchen.'}
              {order.status === 'Ready' &&
                'Your meal is packed and waiting at the counter. Pick it up with your token!'}
              {order.status === 'Completed' &&
                'Order has been successfully handed over.'}
            </Text>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Order Summary</Text>

          {order.items.map(({ menuItem, quantity }, idx) => (
            <View key={idx} style={styles.summaryItemRow}>
              <Text style={styles.summaryQty}>{quantity}x</Text>
              <Text style={styles.summaryName}>{menuItem.name}</Text>
              <Text style={styles.summaryPrice}>₹{menuItem.price * quantity}</Text>
            </View>
          ))}

          {order.specialInstructions ? (
            <View style={styles.noteBox}>
              <Text style={styles.noteLabel}>Instructions:</Text>
              <Text style={styles.noteText}>"{order.specialInstructions}"</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalPrice}>₹{order.total}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.anotherOrderBtn} onPress={onBackToMenu}>
          <Text style={styles.anotherOrderText}>Order Another Meal 🍱</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600'
  },
  errorEmoji: {
    fontSize: 50,
    marginBottom: 10
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20
  },
  primaryBtn: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  readyAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    gap: 12
  },
  readyAlertIcon: {
    fontSize: 28
  },
  readyAlertTitle: {
    color: '#065F46',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5
  },
  readyAlertSub: {
    color: '#047857',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600'
  },
  completedAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    gap: 12
  },
  completedAlertTitle: {
    color: '#374151',
    fontWeight: '800',
    fontSize: 14
  },
  completedAlertSub: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2
  },
  tokenCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3
  },
  tokenLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 1.5
  },
  tokenNumber: {
    fontSize: 44,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 2,
    marginVertical: 8
  },
  statusBadgeWrapper: {
    marginTop: 4
  },
  trackerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  trackerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12
  },
  statusDescriptionBox: {
    marginTop: 14,
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B00'
  },
  statusDescText: {
    fontSize: 13,
    color: '#C2410C',
    fontWeight: '600',
    lineHeight: 18
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12
  },
  summaryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6
  },
  summaryQty: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF6B00',
    width: 32
  },
  summaryName: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    fontWeight: '500'
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827'
  },
  noteBox: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
    marginTop: 10
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280'
  },
  noteText: {
    fontSize: 13,
    color: '#374151',
    fontStyle: 'italic',
    marginTop: 2
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B5563'
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827'
  },
  anotherOrderBtn: {
    backgroundColor: '#111827',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center'
  },
  anotherOrderText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  }
});
