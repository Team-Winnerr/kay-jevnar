import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserProfile, UserRole } from '../types';

export const signInAsGuest = async (studentName: string = 'Campus Student'): Promise<UserProfile> => {
  const cred = await signInAnonymously(auth);
  const user = cred.user;
  const profile: UserProfile = {
    id: user.uid,
    name: studentName.trim() || 'Campus Student',
    email: `student_${user.uid.slice(0, 5)}@campus.edu`,
    role: 'student',
    rollNumber: `PUNE-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: Date.now()
  };
  await setDoc(doc(db, 'users', user.uid), profile);
  return profile;
};

export const registerUser = async (
  name: string,
  email: string,
  pass: string,
  role: UserRole = 'student',
  rollNumber?: string,
  phone?: string
): Promise<UserProfile> => {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  const user = cred.user;

  const profileData: Record<string, any> = {
    id: user.uid,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    createdAt: Date.now()
  };

  if (rollNumber?.trim()) profileData.rollNumber = rollNumber.trim();
  if (phone?.trim()) profileData.phone = phone.trim();

  await setDoc(doc(db, 'users', user.uid), profileData);
  return profileData as UserProfile;
};

export const loginUser = async (email: string, pass: string): Promise<UserProfile> => {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  const user = cred.user;
  const userDoc = await getDoc(doc(db, 'users', user.uid));

  if (!userDoc.exists()) {
    // Fallback if registered without doc
    const defaultProfile: UserProfile = {
      id: user.uid,
      name: email.split('@')[0],
      email: email.toLowerCase(),
      role: email.toLowerCase().includes('admin') ? 'admin' : 'student',
      createdAt: Date.now()
    };
    await setDoc(doc(db, 'users', user.uid), defaultProfile);
    return defaultProfile;
  }

  return userDoc.data() as UserProfile;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) return null;
  return userDoc.data() as UserProfile;
};

export const subscribeToAuthState = (
  callback: (user: User | null, profile: UserProfile | null) => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null, null);
    } else {
      const profile = await getUserProfile(user.uid);
      callback(user, profile);
    }
  });
};
