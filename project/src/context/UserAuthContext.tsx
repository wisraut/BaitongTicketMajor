/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "../firebase.ts";

type UserAuthContextType = {
  user: User | null;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
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

  function logIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, logIn, signUp, logOut }}>
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
