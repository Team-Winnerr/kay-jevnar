import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderStatus } from '../types';

interface OrderProgressTrackerProps {
  status: OrderStatus;
}

const STEPS: { key: OrderStatus; label: string; icon: string }[] = [
  { key: 'Placed', label: 'Placed', icon: '📝' },
  { key: 'Preparing', label: 'Cooking', icon: '🍳' },
  { key: 'Ready', label: 'Ready', icon: '🔔' },
  { key: 'Completed', label: 'Picked Up', icon: '✨' }
];

export const OrderProgressTracker: React.FC<OrderProgressTrackerProps> = ({ status }) => {
  const getStepIndex = (s: OrderStatus) => {
    switch (s) {
      case 'Placed': return 0;
      case 'Preparing': return 1;
      case 'Ready': return 2;
      case 'Completed': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;

          return (
            <React.Fragment key={step.key}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.iconCircle,
                    isCompleted && styles.circleCompleted,
                    isCurrent && styles.circleCurrent,
                    isUpcoming && styles.circleUpcoming
                  ]}
                >
                  <Text style={styles.stepEmoji}>
                    {isCompleted ? '✓' : step.icon}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isCurrent && styles.labelCurrent,
                    isCompleted && styles.labelCompleted,
                    isUpcoming && styles.labelUpcoming
                  ]}
                >
                  {step.label}
                </Text>
              </View>

              {idx < STEPS.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    idx < currentIndex ? styles.connectorActive : styles.connectorInactive
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  stepItem: {
    alignItems: 'center',
    width: 64
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  circleCompleted: {
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#059669'
  },
  circleCurrent: {
    backgroundColor: '#FF6B00',
    borderWidth: 2,
    borderColor: '#EA580C',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4
  },
  circleUpcoming: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  stepEmoji: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  stepLabel: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600'
  },
  labelCurrent: {
    color: '#FF6B00',
    fontWeight: '800'
  },
  labelCompleted: {
    color: '#059669'
  },
  labelUpcoming: {
    color: '#9CA3AF'
  },
  connector: {
    flex: 1,
    height: 3,
    marginBottom: 22,
    borderRadius: 2
  },
  connectorActive: {
    backgroundColor: '#10B981'
  },
  connectorInactive: {
    backgroundColor: '#E5E7EB'
  }
});
