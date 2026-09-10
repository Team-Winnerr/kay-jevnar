import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Switch,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  listenToMenuItems,
  toggleItemAvailability,
  deleteMenuItem,
  addMenuItem,
  seedInitialMenuIfEmpty
} from '../../services/menuService';
import { MenuItem, FoodCategory } from '../../types';

interface AdminMenuScreenProps {
  onBackToOrders: () => void;
}

export const AdminMenuScreen: React.FC<AdminMenuScreenProps> = ({ onBackToOrders }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // New item form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exclude<FoodCategory, 'All'>>('Snacks');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [prepTime, setPrepTime] = useState('10');
  const [isVeg, setIsVeg] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToMenuItems((menuItems) => {
      setItems(menuItems);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleToggle = async (item: MenuItem) => {
    try {
      await toggleItemAvailability(item.id, !item.isAvailable);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not update item availability.');
    }
  };

  const handleDelete = (id: string, itemName: string) => {
    Alert.alert('Delete Food Item', `Are you sure you want to remove "${itemName}" from the canteen menu?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMenuItem(id);
          } catch (err: any) {
            Alert.alert('Error', 'Could not delete item.');
          }
        }
      }
    ]);
  };

  const handleAddItem = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Validation', 'Please enter item name and price.');
      return;
    }

    setSubmitting(true);
    try {
      await addMenuItem({
        name: name.trim(),
        category,
        price: parseFloat(price) || 50,
        description: description.trim() || 'Delicious cafeteria preparation.',
        imageUrl:
          imageUrl.trim() ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        isAvailable: true,
        isVeg,
        rating: 4.8,
        preparationTimeMinutes: parseInt(prepTime) || 10
      });

      setName('');
      setPrice('');
      setDescription('');
      setImageUrl('');
      setModalVisible(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not add food item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeed = async () => {
    setLoading(true);
    await seedInitialMenuIfEmpty();
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBackToOrders}>
          <Text style={styles.backBtnText}>← Orders</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu Management</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>Loading canteen inventory...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemMain}>
                <View style={styles.itemTitleRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>

                <Text style={styles.categoryTag}>
                  {item.category} • {item.isVeg ? '🌱 Veg' : '🍗 Non-Veg'}
                </Text>
                <Text style={styles.itemDesc} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>

              {/* Controls */}
              <View style={styles.controlsRow}>
                <View style={styles.switchWrapper}>
                  <Text
                    style={[
                      styles.stockLabel,
                      { color: item.isAvailable ? '#059669' : '#DC2626' }
                    ]}
                  >
                    {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </Text>
                  <Switch
                    value={item.isAvailable}
                    onValueChange={() => handleToggle(item)}
                    trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
                    thumbColor={item.isAvailable ? '#10B981' : '#9CA3AF'}
                  />
                </View>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item.id, item.name)}
                >
                  <Text style={styles.deleteBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyTitle}>Menu is Empty</Text>
              <TouchableOpacity style={styles.seedBtn} onPress={handleSeed}>
                <Text style={styles.seedBtnText}>Seed Default Campus Menu 🚀</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Add New Item Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Food Item</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formScroll}>
              <Text style={styles.inputLabel}>Dish Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Masala Dosa"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryPickerRow}>
                {(['Snacks', 'Beverages', 'Main Course', 'Quick Bites', 'Desserts'] as const).map(
                  (cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catOption,
                        category === cat && styles.catOptionActive
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.catOptionText,
                          category === cat && styles.catOptionTextActive
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              <View style={styles.twoColumn}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Price (₹) *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. 60"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Prep Time (mins)</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="10"
                    keyboardType="numeric"
                    value={prepTime}
                    onChangeText={setPrepTime}
                  />
                </View>
              </View>

              <View style={styles.vegSwitchRow}>
                <Text style={styles.inputLabel}>Vegetarian</Text>
                <Switch value={isVeg} onValueChange={setIsVeg} />
              </View>

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, { height: 60 }]}
                placeholder="Short mouth-watering description..."
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <Text style={styles.inputLabel}>Image URL (Optional)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="https://... (leave empty for default)"
                value={imageUrl}
                onChangeText={setImageUrl}
              />

              <TouchableOpacity
                style={[styles.submitFormBtn, submitting && { opacity: 0.6 }]}
                onPress={handleAddItem}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitFormBtnText}>Add to Canteen Menu</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addBtn: {
    backgroundColor: '#FF6B00',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13
  },
  list: {
    padding: 16
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  itemMain: {
    marginBottom: 10
  },
  itemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    flex: 1
  },
  itemPrice: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FF6B00'
  },
  categoryTag: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2
  },
  itemDesc: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6'
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  stockLabel: {
    fontSize: 13,
    fontWeight: '700'
  },
  deleteBtn: {
    padding: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 8
  },
  deleteBtnText: {
    fontSize: 14
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
    color: '#111827',
    marginBottom: 16
  },
  seedBtn: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12
  },
  seedBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827'
  },
  closeModalText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#9CA3AF'
  },
  formScroll: {
    paddingBottom: 30
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginTop: 10,
    marginBottom: 6
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827'
  },
  categoryPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  catOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6'
  },
  catOptionActive: {
    backgroundColor: '#111827'
  },
  catOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563'
  },
  catOptionTextActive: {
    color: '#FFFFFF'
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 12
  },
  vegSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  submitFormBtn: {
    backgroundColor: '#FF6B00',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },
  submitFormBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  }
});
