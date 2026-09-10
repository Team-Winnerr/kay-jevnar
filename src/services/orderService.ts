import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order, OrderStatus, CartItem } from '../types';

const ORDERS_COLLECTION = 'orders';

// Recursively removes all undefined fields to prevent Firestore serialization errors
const deepCleanData = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(deepCleanData);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc: any, [key, val]) => {
      if (val !== undefined) {
        acc[key] = deepCleanData(val);
      }
      return acc;
    }, {});
  }
  return obj;
};

export const createOrder = async (
  userId: string,
  userName: string,
  userEmail: string,
  items: CartItem[],
  subtotal: number,
  tax: number,
  total: number,
  specialInstructions?: string,
  paymentDetails?: {
    paymentMethod?: string;
    paymentStatus?: string;
    razorpayPaymentId?: string;
  }
): Promise<Order> => {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const newDoc = doc(ordersRef);
  const randomToken = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `KJ-${randomToken}`;
  const pickupOtp = String(randomToken);

  const orderData: Order = {
    id: newDoc.id,
    orderNumber,
    studentId: userId,
    studentName: userName,
    studentEmail: userEmail,
    userId,
    userName,
    userEmail,
    items,
    subtotal,
    tax,
    total,
    status: 'Placed',
    pickupOtp,
    specialInstructions: specialInstructions?.trim() || '',
    estimatedReadyTimeMinutes: 10,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    paymentMethod: paymentDetails?.paymentMethod || 'Razorpay (Test)',
    paymentStatus: paymentDetails?.paymentStatus || 'Paid',
    razorpayPaymentId: paymentDetails?.razorpayPaymentId || ''
  };

  const cleanedData = deepCleanData(orderData);
  await setDoc(newDoc, cleanedData);
  return orderData;
};

export const listenToStudentOrders = (
  userId: string,
  callback: (orders: Order[]) => void
) => {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  // Real-time listener for user orders - try both userId and studentId
  return onSnapshot(ordersRef, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as any;
      if (data.userId === userId || data.studentId === userId) {
        orders.push({ id: docSnap.id, ...data });
      }
    });
    orders.sort((a, b) => b.createdAt - a.createdAt);
    callback(orders);
  }, (err) => {
    console.warn('Error listening to student orders:', err);
  });
};

export const listenToAllOrders = (callback: (orders: Order[]) => void) => {
  const ordersRef = collection(db, ORDERS_COLLECTION);

  return onSnapshot(ordersRef, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      orders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
    });
    // Sort descending by creation date
    orders.sort((a, b) => b.createdAt - a.createdAt);
    callback(orders);
  }, (err) => {
    console.warn('Error listening to all orders:', err);
  });
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  const orderDoc = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(orderDoc, {
    status,
    updatedAt: Date.now()
  });
};

export const verifyOrderOtp = async (
  orderId: string,
  enteredOtp: string,
  actualOtp: string
): Promise<{ success: boolean; message: string }> => {
  const cleanEntered = enteredOtp.replace(/\s+/g, '').trim();
  const cleanActual = (actualOtp || '').replace(/\s+/g, '').trim();

  if (!cleanEntered || cleanEntered !== cleanActual) {
    return { success: false, message: 'Invalid 4-digit OTP! Check with student.' };
  }

  const orderDoc = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(orderDoc, {
    status: 'Completed',
    updatedAt: Date.now()
  });
  return { success: true, message: 'OTP verified! Order successfully handed over.' };
};

