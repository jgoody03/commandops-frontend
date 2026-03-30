import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function loginWithEmailPassword(
  email: string,
  password: string
) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signupWithEmailPassword(
  email: string,
  password: string
) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function updateMyProfile(input: { displayName?: string }) {
  if (!auth.currentUser) {
    throw new Error("No authenticated user.");
  }

  await updateProfile(auth.currentUser, {
    displayName: input.displayName,
  });
}

export function subscribeToAuthState(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}

export async function logout() {
  return signOut(auth);
}