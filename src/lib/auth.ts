import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
}

export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, {
      displayName,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    });

    // Create user document in Firestore
    const userData: Omit<User, 'uid'> = {
      email: user.email!,
      displayName,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return {
      uid: user.uid,
      ...userData,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(errorMessage);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    return {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || userData?.displayName || 'Anonymous',
      photoURL: user.photoURL || userData?.photoURL,
      createdAt: userData?.createdAt || new Date(),
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(errorMessage);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(errorMessage);
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();

      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || userData?.displayName || 'Anonymous',
        photoURL: firebaseUser.photoURL || userData?.photoURL,
        createdAt: userData?.createdAt || new Date(),
      };

      callback(user);
    } else {
      callback(null);
    }
  });
}; 