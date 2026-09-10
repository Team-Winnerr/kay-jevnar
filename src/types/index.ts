export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rollNumber?: string;
  phone?: string;
  createdAt: number;
}

export type FoodCategory =
  | 'All'
  | 'Snacks'
  | 'Beverages'
  | 'Main Course'
  | 'Quick Bites'
  | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<FoodCategory, 'All'>;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  isVeg: boolean;
  rating?: number;
  preparationTimeMinutes: number;
  createdAt?: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus = 'Placed' | 'Preparing' | 'Ready' | 'Completed';

export interface Order {
  id: string;
  orderNumber: string; // e.g. #KJ-1042
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  specialInstructions?: string;
  createdAt: number;
  updatedAt: number;
}
