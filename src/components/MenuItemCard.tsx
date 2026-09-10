import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { getItemPriceINR } from '../utils/price';
import { getLocalFoodAsset } from '../utils/image';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find((ci) => ci.menuItem.id === item.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <View style={[styles.card, !item.isAvailable && styles.cardDisabled]}>
      {/* Image with BiteJoy Floating Badge & Price Tag */}
      <View style={styles.imageWrapper}>
        <Image
          source={getLocalFoodAsset(item.name)}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Floating Price Pill (BiteJoy signature) */}
        <View style={styles.floatingPricePill}>
          <Text style={styles.floatingPriceText}>₹{getItemPriceINR(item)}</Text>
        </View>

        {/* Veg / Non-Veg Indicator */}
        <View style={[styles.vegBadge, !item.isVeg && styles.nonVegBadge]}>
          <View style={[styles.vegDot, !item.isVeg && styles.nonVegDot]} />
        </View>

        {!item.isAvailable && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>SOLD OUT</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          {item.rating && (
            <View style={styles.ratingBadge}>
              <Text style={styles.starText}>★</Text>
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.prepTimeRow}>
            <Text style={styles.categoryLabel}>{item.category}</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.prepTime}>🕒 ~{item.preparationTimeMinutes}m</Text>
          </View>

          {item.isAvailable ? (
            quantity > 0 ? (
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => updateQuantity(item.id, quantity - 1)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.qtyButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => updateQuantity(item.id, quantity + 1)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addToCart(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.addButtonText}>ADD +</Text>
              </TouchableOpacity>
            )
          ) : (
            <View style={styles.unavailablePill}>
              <Text style={styles.unavailableText}>Unavailable</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#F3EFEA',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3
  },
  cardDisabled: {
    opacity: 0.65
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 175,
    backgroundColor: '#FAF5EE'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  floatingPricePill: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#161616',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4
  },
  floatingPriceText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5
  },
  vegBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#10B981',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  nonVegBadge: {
    borderColor: '#EF4444'
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981'
  },
  nonVegDot: {
    backgroundColor: '#EF4444'
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26,26,26,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2
  },
  content: {
    padding: 16
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: '#161616',
    flex: 1,
    marginRight: 8,
    letterSpacing: -0.2
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    borderWidth: 1,
    borderColor: '#FFE8A3',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8
  },
  starText: {
    color: '#F59E0B',
    fontSize: 12,
    marginRight: 3
  },
  ratingText: {
    color: '#B45309',
    fontWeight: '800',
    fontSize: 12
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 14
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F6F3EE'
  },
  prepTimeRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF'
  },
  dotSeparator: {
    marginHorizontal: 5,
    color: '#D1D5DB'
  },
  prepTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600'
  },
  addButton: {
    backgroundColor: '#FF5B22', // BiteJoy signature orange
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 12,
    shadowColor: '#FF5B22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2EC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FF5B22',
    overflow: 'hidden'
  },
  qtyButton: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    backgroundColor: '#FF5B22'
  },
  qtyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  qtyValue: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '900',
    color: '#C2410C'
  },
  unavailablePill: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10
  },
  unavailableText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700'
  }
});
