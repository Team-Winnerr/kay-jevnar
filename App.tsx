import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { MenuScreen } from './src/screens/student/MenuScreen';
import { CartScreen } from './src/screens/student/CartScreen';
import { OrderTrackingScreen } from './src/screens/student/OrderTrackingScreen';
import { OrderHistoryScreen } from './src/screens/student/OrderHistoryScreen';
import { AdminOrdersScreen } from './src/screens/admin/AdminOrdersScreen';
import { AdminMenuScreen } from './src/screens/admin/AdminMenuScreen';
import { Order } from './src/types';

type StudentScreenState =
  | { type: 'menu' }
  | { type: 'cart' }
  | { type: 'history' }
  | { type: 'tracking'; orderId: string };

type AdminScreenState = 'orders' | 'menu';

const MainNavigator: React.FC = () => {
  const { firebaseUser, profile, loading, isAdmin } = useAuth();
  const [studentScreen, setStudentScreen] = useState<StudentScreenState>({ type: 'menu' });
  const [adminScreen, setAdminScreen] = useState<AdminScreenState>('orders');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  if (!firebaseUser) {
    return <LoginScreen onSuccess={() => {}} />;
  }

  // Admin View
  if (isAdmin || profile?.role === 'admin') {
    if (adminScreen === 'menu') {
      return <AdminMenuScreen onBackToOrders={() => setAdminScreen('orders')} />;
    }
    return <AdminOrdersScreen onSwitchToMenu={() => setAdminScreen('menu')} />;
  }

  // Student View
  switch (studentScreen.type) {
    case 'cart':
      return (
        <CartScreen
          onBack={() => setStudentScreen({ type: 'menu' })}
          onOrderPlaced={(order: Order) =>
            setStudentScreen({ type: 'tracking', orderId: order.id })
          }
        />
      );

    case 'tracking':
      return (
        <OrderTrackingScreen
          orderId={studentScreen.orderId}
          onBackToMenu={() => setStudentScreen({ type: 'menu' })}
        />
      );

    case 'history':
      return (
        <OrderHistoryScreen
          onBack={() => setStudentScreen({ type: 'menu' })}
          onSelectOrder={(orderId) =>
            setStudentScreen({ type: 'tracking', orderId })
          }
        />
      );

    case 'menu':
    default:
      return (
        <MenuScreen
          onOpenCart={() => setStudentScreen({ type: 'cart' })}
          onOpenHistory={() => setStudentScreen({ type: 'history' })}
        />
      );
  }
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <View style={styles.container}>
            <View style={styles.navigatorWrapper}>
              <MainNavigator />
            </View>
            <StatusBar style="dark" />
          </View>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Sleek background on desktop
    alignItems: 'center',
    justifyContent: 'center'
  },
  navigatorWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 480, // Realistic mobile screen width
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
