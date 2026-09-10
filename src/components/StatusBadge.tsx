import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'small' | 'medium' | 'large';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Placed':
        return {
          bg: '#FEF3C7',
          text: '#B45309',
          border: '#FDE68A',
          label: 'Order Placed'
        };
      case 'Preparing':
        return {
          bg: '#EFF6FF',
          text: '#1D4ED8',
          border: '#BFDBFE',
          label: '🍳 In Kitchen'
        };
      case 'Ready':
        return {
          bg: '#ECFDF5',
          text: '#047857',
          border: '#A7F3D0',
          label: '🔔 Ready for Pickup'
        };
      case 'Completed':
        return {
          bg: '#F3F4F6',
          text: '#4B5563',
          border: '#E5E7EB',
          label: '✅ Picked Up'
        };
      default:
        return {
          bg: '#F3F4F6',
          text: '#374151',
          border: '#E5E7EB',
          label: status
        };
    }
  };

  const current = getStatusStyles();

  const paddingStyle =
    size === 'small'
      ? { paddingVertical: 3, paddingHorizontal: 8 }
      : size === 'large'
      ? { paddingVertical: 8, paddingHorizontal: 16 }
      : { paddingVertical: 5, paddingHorizontal: 12 };

  const textSize = size === 'small' ? 11 : size === 'large' ? 15 : 13;

  return (
    <View
      style={[
        styles.badge,
        paddingStyle,
        { backgroundColor: current.bg, borderColor: current.border }
      ]}
    >
      <Text style={[styles.text, { color: current.text, fontSize: textSize }]}>
        {current.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3
  }
});
