/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "../firebase";

type UserAuthContextType = {
  user: User | null;
  loading: boolean;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<UserCredential>;
  logOut: () => Promise<void>;
};

const UserAuthContext = createContext<UserAuthContextType | null>(null);

type UserAuthContextProviderProps = {
  children: ReactNode;
};

export function UserAuthContextProvider({
  children,
}: UserAuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  function logIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(
    email: string,
    password: string,
    name: string
  ): Promise<UserCredential> {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    const trimmedName = name.trim();
    if (trimmedName) {
      await updateProfile(cred.user, { displayName: trimmedName });
    }

    return cred;
  }

  function logOut() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser?.uid, currentUser?.email);
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, loading, logIn, signUp, logOut }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) {
    throw new Error("useUserAuth must be used within UserAuthContextProvider");
  }
  return ctx;
}
