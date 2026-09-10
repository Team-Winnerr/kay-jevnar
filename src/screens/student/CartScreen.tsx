import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../services/orderService';
import { Order } from '../../types';
import { getItemPriceINR } from '../../utils/price';

interface CartScreenProps {
  onBack: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({ onBack, onOrderPlaced }) => {
  const { profile, firebaseUser } = useAuth();
  const { items, updateQuantity, clearCart, subtotal, tax, total } = useCart();
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    if (!firebaseUser) {
      Alert.alert('Authentication required', 'Please log in to place an order.');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder(
        firebaseUser.uid,
        profile?.name || 'Campus Student',
        profile?.email || firebaseUser.email || '',
        items,
        subtotal,
        tax,
        total,
        instructions,
        {
          paymentMethod: 'Razorpay (Test)',
          paymentStatus: 'Paid',
          razorpayPaymentId: `pay_test_${Math.random().toString(36).substring(2, 12)}`
        }
      );
      clearCart();
      onOrderPlaced(order);
    } catch (err: any) {
      console.error('Order placement error:', err);
      Alert.alert(
        'Order Failed',
        err.message || 'Unable to place order. Make sure Firestore is in test mode.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <TouchableOpacity onPress={clearCart} disabled={items.length === 0}>
          <Text style={[styles.clearBtnText, items.length === 0 && styles.disabledText]}>
            Clear
          </Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Hungry? Explore today's freshly prepared campus menu!
          </Text>
          <TouchableOpacity style={styles.browseBtn} onPress={onBack} activeOpacity={0.8}>
            <Text style={styles.browseBtnText}>Browse Menu 🍕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Items List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Items</Text>
              {items.map(({ menuItem, quantity }) => (
                <View key={menuItem.id} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{menuItem.name}</Text>
                    <Text style={styles.itemPrice}>₹{getItemPriceINR(menuItem)} each</Text>
                  </View>

                  <View style={styles.qtyContainer}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(menuItem.id, quantity - 1)}
                    >
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(menuItem.id, quantity + 1)}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.rowTotal}>₹{getItemPriceINR(menuItem) * quantity}</Text>
                </View>
              ))}
            </View>

            {/* Special Cooking Note */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cooking Instructions (Optional)</Text>
              <TextInput
                style={styles.instructionInput}
                placeholder="e.g. Extra spicy chutney, no onions, keep chai piping hot..."
                placeholderTextColor="#9CA3AF"
                value={instructions}
                onChangeText={setInstructions}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Bill Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bill Details</Text>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Item Subtotal</Text>
                <Text style={styles.billValue}>₹{subtotal}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Cafeteria GST & Packaging (5%)</Text>
                <Text style={styles.billValue}>₹{tax}</Text>
              </View>
              <View style={[styles.billRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>To Pay</Text>
                <Text style={styles.totalValue}>₹{total}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Place Order CTA Bar */}
          <View style={styles.bottomBar}>
            <View>
              <Text style={styles.bottomTotalLabel}>Total Amount</Text>
              <Text style={styles.bottomTotalValue}>₹{total}</Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutBtn, isSubmitting && styles.checkoutBtnDisabled]}
              onPress={handlePlaceOrder}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.checkoutBtnText}>
                  {!firebaseUser ? 'Sign In to Place Order ➔' : 'Place Order & Pay ➔'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </>
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
    paddingHorizontal: 10
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
  clearBtnText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600'
  },
  disabledText: {
    color: '#D1D5DB'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  itemInfo: {
    flex: 1,
    paddingRight: 8
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827'
  },
  itemPrice: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B00',
    overflow: 'hidden'
  },
  qtyBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#FF6B00'
  },
  qtyBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14
  },
  qtyText: {
    paddingHorizontal: 10,
    fontSize: 13,
    fontWeight: '800',
    color: '#C2410C'
  },
  rowTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    width: 60,
    textAlign: 'right'
  },
  instructionInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    textAlignVertical: 'top'
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  billLabel: {
    fontSize: 14,
    color: '#4B5563'
  },
  billValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827'
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827'
  },
  totalValue: {
    fontSize: 19,
    fontWeight: '900',
    color: '#10B981'
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8
  },
  bottomTotalLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600'
  },
  bottomTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827'
  },
  checkoutBtn: {
    backgroundColor: '#FF6B00',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4
  },
  checkoutBtnDisabled: {
    opacity: 0.6
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 12
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827'
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24
  },
  browseBtn: {
    backgroundColor: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15
  }
});
