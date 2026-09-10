import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { MenuItem, FoodCategory } from '../../types';
import { listenToMenuItems, seedInitialMenuIfEmpty } from '../../services/menuService';
import { MenuItemCard } from '../../components/MenuItemCard';
import { CategoryFilter } from '../../components/CategoryFilter';

interface MenuScreenProps {
  onOpenCart: () => void;
  onOpenHistory: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  onOpenCart,
  onOpenHistory
}) => {
  const { profile, logout } = useAuth();
  const { itemCount, total } = useCart();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed initial items if database is freshly created
    seedInitialMenuIfEmpty().catch(() => {});

    // Listen to real-time changes
    const unsubscribe = listenToMenuItems((menuItems) => {
      setItems(menuItems);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.canteenTag}>CAMPUS CANTEEN</Text>
          <Text style={styles.appName}>Kay Jevnar 🍱</Text>
        </View>

        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.actionIconBtn}
            onPress={onOpenHistory}
            activeOpacity={0.7}
          >
            <Text style={styles.iconEmoji}>🧾</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cartIconBtn}
            onPress={onOpenCart}
            activeOpacity={0.7}
          >
            <Text style={styles.iconEmoji}>🛒</Text>
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={logout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting Banner */}
      <View style={styles.greetingBanner}>
        <Text style={styles.greetingText}>
          Hello, <Text style={styles.studentName}>{profile?.name || 'Student'}</Text> 👋
        </Text>
        <Text style={styles.greetingSub}>
          {profile?.rollNumber ? `ID: ${profile.rollNumber} • ` : ''}What are you eating today?
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search samosa, chai, biryani, burgers..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Food Items List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>Fetching today's hot menu...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MenuItemCard item={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyTitle}>No food items found</Text>
              <Text style={styles.emptySubtitle}>
                Try searching for something else or pick another category.
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Bottom Cart Bar */}
      {itemCount > 0 && (
        <View style={styles.floatingCartBar}>
          <View>
            <Text style={styles.floatingCartCount}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'} added
            </Text>
            <Text style={styles.floatingCartPrice}>
              ₹{total} <Text style={styles.taxNote}>(incl. tax)</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={styles.viewCartBtn}
            onPress={onOpenCart}
            activeOpacity={0.8}
          >
            <Text style={styles.viewCartText}>View Cart ➔</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDFBF7' // Warm BiteJoy background
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F3EFEA'
  },
  canteenTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FF5B22',
    letterSpacing: 1.5
  },
  appName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#161616',
    letterSpacing: -0.5
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  actionIconBtn: {
    padding: 9,
    backgroundColor: '#F7F4EF',
    borderRadius: 14
  },
  cartIconBtn: {
    padding: 9,
    backgroundColor: '#FFF1EB',
    borderRadius: 14,
    position: 'relative'
  },
  logoutBtn: {
    padding: 9,
    backgroundColor: '#FEE2E2',
    borderRadius: 14
  },
  logoutText: {
    fontSize: 16
  },
  iconEmoji: {
    fontSize: 18
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF5B22',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900'
  },
  greetingBanner: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 4
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#161616',
    letterSpacing: -0.5
  },
  studentName: {
    color: '#FF5B22'
  },
  greetingSub: {
    fontSize: 13,
    color: '#78716C',
    marginTop: 2,
    fontWeight: '600'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EFEAE3',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#161616',
    fontWeight: '500'
  },
  clearSearch: {
    fontSize: 16,
    color: '#9CA3AF',
    padding: 4
  },
  listContainer: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 95
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#78716C',
    fontWeight: '700'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 10
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#161616'
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#78716C',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    right: 18,
    backgroundColor: '#161616', // BiteJoy dark contrast drawer
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8
  },
  floatingCartCount: {
    color: '#A8A29E',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  floatingCartPrice: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900'
  },
  taxNote: {
    fontSize: 11,
    fontWeight: '500',
    color: '#78716C'
  },
  viewCartBtn: {
    backgroundColor: '#FF5B22',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    shadowColor: '#FF5B22',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3
  },
  viewCartText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5
  }
});
