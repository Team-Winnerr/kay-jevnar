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

export const createOrder = async (
  userId: string,
  userName: string,
  userEmail: string,
  items: CartItem[],
  subtotal: number,
  tax: number,
  total: number,
  specialInstructions?: string
): Promise<Order> => {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const newDoc = doc(ordersRef);
  const randomToken = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `KJ-${randomToken}`;

  const orderData: Order = {
    id: newDoc.id,
    orderNumber,
    userId,
    userName,
    userEmail,
    items,
    subtotal,
    tax,
    total,
    status: 'Placed',
    specialInstructions: specialInstructions?.trim() || undefined,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await setDoc(newDoc, orderData);
  return orderData;
};

export const listenToStudentOrders = (
  userId: string,
  callback: (orders: Order[]) => void
) => {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  // Real-time listener for user orders
  const q = query(ordersRef, where('userId', '==', userId));

  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      orders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
    });
    // Sort descending by creation date
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
