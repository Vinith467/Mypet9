import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Capacitor } from '@capacitor/core';
import type { User } from 'firebase/auth';
import { 
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  userData: any | null; // Firestore user document data
  loading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
  signInWithGoogle: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch additional user data from Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      let user;
      
      // If we are on mobile, use the native Capacitor plugin
      if (Capacitor.getPlatform() !== 'web') {
        const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication');
        const result = await FirebaseAuthentication.signInWithGoogle();
        
        if (!result.credential?.idToken) throw new Error("No ID token returned from Google");
        const credential = GoogleAuthProvider.credential(result.credential.idToken);
        const userCredential = await signInWithCredential(auth, credential);
        user = userCredential.user;
      } else {
        // If we are on the web browser, use the standard popup
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        user = result.user;
      }
      
      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        // Create new user document as a pet parent by default
        await setDoc(userDocRef, {
          name: user.displayName || 'Pet Parent',
          email: user.email,
          type: 'user', // Default to pet parent in this app
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Google sign in failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout, signInWithGoogle }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
