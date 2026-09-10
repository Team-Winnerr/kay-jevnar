import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { MenuItem } from '../types';

const MENU_COLLECTION = 'menu';

export const INITIAL_MENU_ITEMS: Omit<MenuItem, 'id'>[] = [
  {
    name: 'Double Loaded Cheeseburger',
    category: 'Quick Bites',
    price: 130,
    description: 'Juicy patties layered with melted cheddar, crisp lettuce, caramelized onions, and signature BiteJoy sauce.',
    imageUrl: 'https://cdn.prod.website-files.com/678b0c0393efc5b8320e8818/678fe621e2a33326f65cbd06_cheeseburger-with-double-beef.png',
    isAvailable: true,
    isVeg: false,
    rating: 4.9,
    preparationTimeMinutes: 10
  },
  {
    name: 'Crispy Fries Cone',
    category: 'Snacks',
    price: 60,
    description: 'Golden, extra crunchy potato fries tossed in peri-peri seasoning, served with creamy garlic dip.',
    imageUrl: 'https://cdn.prod.website-files.com/678b0c0393efc5b8320e8818/678b0c0393efc5b8320e88fe_fries-cone-yellow-background.png',
    isAvailable: true,
    isVeg: true,
    rating: 4.8,
    preparationTimeMinutes: 6
  },
  {
    name: 'Crunchy Onion Rings',
    category: 'Snacks',
    price: 75,
    description: 'Crisp batter-dipped sweet onion rings fried golden brown, served with smoky BBQ dip.',
    imageUrl: 'https://cdn.prod.website-files.com/678b0c0393efc5b8320e8818/678b0c0393efc5b8320e88ef_onion-rings-blue-box.png',
    isAvailable: true,
    isVeg: true,
    rating: 4.7,
    preparationTimeMinutes: 7
  },
  {
    name: 'Crispy Samosa Plate (2 pcs)',
    category: 'Snacks',
    price: 30,
    description: 'Crisp golden pastry stuffed with spiced potatoes and peas, served with mint & tamarind chutney.',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.9,
    preparationTimeMinutes: 4
  },
  {
    name: 'Special Masala Chai',
    category: 'Beverages',
    price: 20,
    description: 'Freshly brewed aromatic tea infused with crushed ginger, cardamom, and fresh milk.',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.9,
    preparationTimeMinutes: 3
  },
  {
    name: 'Thick Cold Coffee with Ice Cream',
    category: 'Beverages',
    price: 60,
    description: 'Rich blended espresso with creamy vanilla ice cream, chocolate drizzle, and roasted coffee dust.',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.8,
    preparationTimeMinutes: 5
  },
  {
    name: 'Punjabi Chole Bhature Combo',
    category: 'Main Course',
    price: 120,
    description: 'Two fluffy piping hot bhatures served with spiced chickpea curry, pickled onions, and green chili.',
    imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.9,
    preparationTimeMinutes: 12
  },
  {
    name: 'Royal Paneer Biryani',
    category: 'Main Course',
    price: 150,
    description: 'Fragrant basmati rice layered with marinated paneer cubes, saffron, and aromatic spices. Served with raita.',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.8,
    preparationTimeMinutes: 15
  },
  {
    name: 'Pink Strawberry Velvet Cake',
    category: 'Desserts',
    price: 85,
    description: 'Layers of moist sponge topped with light strawberry cream, white chocolate curls, and glaze.',
    imageUrl: 'https://cdn.prod.website-files.com/678b0c0393efc5b8320e8818/678b0c0393efc5b8320e8904_pink-strawberry-cake-portion-pink-background.png',
    isAvailable: true,
    isVeg: true,
    rating: 4.9,
    preparationTimeMinutes: 2
  },
  {
    name: 'Glazed Sugar Doughnuts (2 pcs)',
    category: 'Desserts',
    price: 70,
    description: 'Soft pillowy golden doughnuts coated in a sweet sugar glaze and rainbow sprinkles.',
    imageUrl: 'https://cdn.prod.website-files.com/678b0c0393efc5b8320e8818/678b0c0393efc5b8320e8905_top-view-arrangement-with-doughnuts-blue-background.png',
    isAvailable: true,
    isVeg: true,
    rating: 4.8,
    preparationTimeMinutes: 2
  }
];

export const listenToMenuItems = (callback: (items: MenuItem[]) => void) => {
  const menuRef = collection(db, MENU_COLLECTION);
  return onSnapshot(menuRef, (snapshot) => {
    const items: MenuItem[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...(docSnap.data() as Omit<MenuItem, 'id'>) });
    });
    // Sort by name or category
    callback(items);
  }, (err) => {
    console.warn('Error listening to menu items:', err);
  });
};

export const seedInitialMenuIfEmpty = async (): Promise<boolean> => {
  try {
    const menuRef = collection(db, MENU_COLLECTION);
    const existing = await getDocs(menuRef);
    if (existing.empty) {
      for (const item of INITIAL_MENU_ITEMS) {
        const newDoc = doc(menuRef);
        await setDoc(newDoc, {
          ...item,
          createdAt: Date.now()
        });
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error seeding initial menu:', error);
    return false;
  }
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<string> => {
  const menuRef = collection(db, MENU_COLLECTION);
  const newDoc = doc(menuRef);
  await setDoc(newDoc, {
    ...item,
    createdAt: Date.now()
  });
  return newDoc.id;
};

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>): Promise<void> => {
  const itemDoc = doc(db, MENU_COLLECTION, id);
  await updateDoc(itemDoc, updates);
};

export const toggleItemAvailability = async (id: string, isAvailable: boolean): Promise<void> => {
  const itemDoc = doc(db, MENU_COLLECTION, id);
  await updateDoc(itemDoc, { isAvailable });
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  const itemDoc = doc(db, MENU_COLLECTION, id);
  await deleteDoc(itemDoc);
};
