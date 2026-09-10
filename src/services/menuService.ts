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
  // --- BURGERS (100% Pure Veg) ---
  {
    name: 'Paneer Tikka Burger',
    category: 'Burgers',
    price: 9.90,
    priceINR: 199,
    description: 'Charred spiced paneer slab, mint chutney mayo, crisp pickled onions & melted cheddar on toasted brioche.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.9,
    badge: 'BESTSELLER',
    stockCountRemaining: 24,
    preparationTimeMinutes: 10
  },
  {
    name: 'Smash Veggie Burger',
    category: 'Burgers',
    price: 8.90,
    priceINR: 179,
    description: 'Crispy spiced potato & sweet corn smash patty with spicy peri peri sauce and crunchy lettuce.',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.8,
    badge: 'CRISPY',
    stockCountRemaining: 18,
    preparationTimeMinutes: 8
  },
  {
    name: 'Classic Veggie Cheeseburger',
    category: 'Burgers',
    price: 8.50,
    priceINR: 169,
    description: 'The all-time campus classic grilled potato & herb patty with double cheese, mustard relish and pickles.',
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.8,
    badge: 'FAVORITE',
    stockCountRemaining: 30,
    preparationTimeMinutes: 7
  },
  {
    name: 'Spicy Paneer Zinger Burger',
    category: 'Burgers',
    price: 10.50,
    priceINR: 219,
    description: 'Extra crispy battered cottage cheese block tossed in fiery ghost chili spice with crunchy coleslaw.',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.9,
    badge: 'HOT 🔥',
    stockCountRemaining: 12,
    preparationTimeMinutes: 10
  },

  // --- SIDES ---
  {
    name: 'Waffle Fries Cone (Large)',
    category: 'Sides',
    price: 4.90,
    priceINR: 110,
    description: 'Crispy criss-cross cut potato waffle fries dusted with smoky peri-peri seasoning and garlic dip.',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.9,
    badge: 'CRISPY',
    stockCountRemaining: 35,
    preparationTimeMinutes: 5
  },
  {
    name: 'Crispy Onion Rings',
    category: 'Sides',
    price: 4.50,
    priceINR: 99,
    description: 'Golden beer-battered thick sweet onion rings served steaming hot with tangy dipping sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.6,
    stockCountRemaining: 15,
    preparationTimeMinutes: 6
  },
  {
    name: 'Classic Salted French Fries',
    category: 'Sides',
    price: 3.90,
    priceINR: 80,
    description: 'Double-fried hand-cut golden Russet potato fries tossed in fine Himalayan rock salt.',
    imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.7,
    stockCountRemaining: 40,
    preparationTimeMinutes: 4
  },

  // --- DESSERTS ---
  {
    name: 'Strawberry Dream Cake',
    category: 'Desserts',
    price: 5.50,
    priceINR: 130,
    description: 'Layered fluffy sponge cake filled with Mahabaleshwar fresh strawberry compote and whipped cream.',
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.9,
    badge: 'SWEET',
    stockCountRemaining: 10,
    preparationTimeMinutes: 3
  },
  {
    name: 'Chocolate Lava Truffle',
    category: 'Desserts',
    price: 5.90,
    priceINR: 140,
    description: 'Warm molten dark chocolate cake served with vanilla bean soft serve scoop.',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.9,
    stockCountRemaining: 8,
    preparationTimeMinutes: 4
  },

  // --- DRINKS ---
  {
    name: 'Cold Coffee with Ice Cream',
    category: 'Drinks',
    price: 3.90,
    priceINR: 90,
    description: 'Rich thick blended espresso cold coffee topped with a creamy scoop of vanilla ice cream.',
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.8,
    badge: 'POPULAR',
    stockCountRemaining: 25,
    preparationTimeMinutes: 3
  },
  {
    name: 'Fresh Mint Lemon Soda',
    category: 'Drinks',
    price: 2.90,
    priceINR: 60,
    description: 'Sparkling refreshing soda infused with crushed mint leaves, fresh lime juice and black salt.',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    rating: 4.7,
    stockCountRemaining: 30,
    preparationTimeMinutes: 2
  }
];

export const seedInitialMenuIfEmpty = async (): Promise<void> => {
  try {
    const snap = await getDocs(collection(db, MENU_COLLECTION));
    const names = snap.docs.map((d) => d.data().name);
    const hasDuplicates = new Set(names).size !== names.length;

    const needsReseed =
      snap.empty ||
      hasDuplicates ||
      snap.docs.length > 15 ||
      snap.docs.some((docSnap) => {
        const data = docSnap.data();
        return (
          !data.priceINR ||
          data.price > 50 ||
          (data.imageUrl && (data.imageUrl.includes('cdn') || data.imageUrl.includes('website-files')))
        );
      });

    if (needsReseed) {
      console.log('Detected stale, broken, or duplicated menu data. Auto-cleaning menu...');
      await forceReseedMenu();
    }
  } catch (error) {
    console.warn('Could not seed menu to Firestore:', error);
  }
};

/** Wipes ALL existing menu items and re-seeds with the canonical INITIAL_MENU_ITEMS.
 *  Call this from the admin panel when images or item data need a full refresh. */
export const forceReseedMenu = async (): Promise<void> => {
  try {
    // 1. Delete every existing document in the menu collection
    const snap = await getDocs(collection(db, MENU_COLLECTION));
    const deletions = snap.docs.map((d) => deleteDoc(doc(db, MENU_COLLECTION, d.id)));
    await Promise.all(deletions);

    // 2. Re-seed with the updated INITIAL_MENU_ITEMS (local /items/ images)
    for (const item of INITIAL_MENU_ITEMS) {
      const itemRef = doc(collection(db, MENU_COLLECTION));
      await setDoc(itemRef, {
        ...item,
        id: itemRef.id,
        createdAt: Date.now()
      });
    }
  } catch (error) {
    console.error('forceReseedMenu failed:', error);
    throw error;
  }
};


export const listenToMenuItems = (callback: (items: MenuItem[]) => void): (() => void) => {
  // Trigger automatic check and repair if stale/duplicate data exists in Firestore
  seedInitialMenuIfEmpty().catch((err) => console.warn('Auto-reseed check warning:', err));

  const q = query(collection(db, MENU_COLLECTION), orderBy('name'));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        callback(
          INITIAL_MENU_ITEMS.map((item, idx) => ({
            ...item,
            id: `seed-item-${idx}`,
            createdAt: Date.now()
          }))
        );
        return;
      }
      const items: MenuItem[] = [];
      const seenNames = new Set<string>();
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<MenuItem, 'id'>;
        if (data.name && !seenNames.has(data.name)) {
          seenNames.add(data.name);
          items.push({ id: docSnap.id, ...data });
        }
      });
      callback(items);
    },
    (err) => {
      console.warn('Firestore offline, fallback to local initial menu:', err);
      callback(
        INITIAL_MENU_ITEMS.map((item, idx) => ({
          ...item,
          id: `local-item-${idx}`,
          createdAt: Date.now()
        }))
      );
    }
  );
};

export const addMenuItem = async (item: Omit<MenuItem, 'id' | 'createdAt'>): Promise<string> => {
  const itemRef = doc(collection(db, MENU_COLLECTION));
  await setDoc(itemRef, {
    ...item,
    id: itemRef.id,
    createdAt: Date.now()
  });
  return itemRef.id;
};

export const updateMenuItemAvailability = async (id: string, isAvailable: boolean): Promise<void> => {
  const itemRef = doc(db, MENU_COLLECTION, id);
  await updateDoc(itemRef, { isAvailable });
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  const itemRef = doc(db, MENU_COLLECTION, id);
  await deleteDoc(itemRef);
};

export const toggleItemAvailability = updateMenuItemAvailability;
