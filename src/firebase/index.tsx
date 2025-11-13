
'use client';

import {
  initializeApp,
  type FirebaseOptions,
  type FirebaseApp,
} from 'firebase/app';
import {
  getAuth,
  type Auth,
  onAuthStateChanged,
  type User,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { app, auth as initialAuth, firestore as initialFirestore } from './index.ts';

interface FirebaseContextType {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <FirebaseContext.Provider value={{ app, auth: initialAuth, firestore: initialFirestore }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: typeof signInWithEmailAndPassword;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithEmail: (auth, email, password) => Promise.resolve({} as any),
  signOutUser: () => Promise.resolve(),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);
  
  const signInWithEmail = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  }

  const signOutUser = () => {
    return signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail: signInWithEmail as any, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FirebaseProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </FirebaseProvider>
  );
};
