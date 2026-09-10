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
  | 'Burgers'
  | 'Sides'
  | 'Desserts'
  | 'Drinks'
  | 'Snacks'
  | 'Quick Bites'
  | 'Main Course'
  | 'Beverages';

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<FoodCategory, 'All'>;
  price: number;
  priceINR?: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  isVeg: boolean;
  rating?: number;
  preparationTimeMinutes: number;
  stockCountRemaining?: number;
  badge?: string;
  createdAt?: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'Placed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  pickupOtp: string; // 4-digit verification code e.g. "8419"
  specialInstructions?: string;
  canteenNote?: string;
  estimatedReadyTimeMinutes?: number;
  createdAt: number;
  updatedAt?: number;
  paymentMethod?: 'Razorpay' | 'Cash' | 'CollegeRFID' | string;
  paymentStatus?: 'Paid' | 'Pending' | 'Failed' | string;
  razorpayPaymentId?: string;
}
