import React, { createContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { authService } from '@/lib/auth-service';













export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Add a fallback timeout in case Firebase auth hangs (e.g. emulator issues)
    const fallbackTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('Firebase auth state check timed out. Forcing loading to false.');
        setLoading(false);
      }
    }, 10000);

    let unsubscribe;

    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!isMounted) return;

        try {
          setUser(firebaseUser);

          if (firebaseUser) {
            // Add a timeout specifically for profile fetching
            const profilePromise = authService.getUserProfile(firebaseUser.uid);
            const timeoutPromise = new Promise((resolve) =>
            setTimeout(() => resolve(null), 5000)
            );

            // Race the profile fetch against a 5s timeout
            const profile = await Promise.race([profilePromise, timeoutPromise]);

            if (isMounted && profile) {
              setUserProfile(profile);
            }
          } else {
            if (isMounted) {
              setUserProfile(null);
            }
          }
        } catch (err) {
          console.error('Auth state change error:', err);
        } finally {
          clearTimeout(fallbackTimeout);
          if (isMounted) {
            setLoading(false);
          }
        }
      });
    } catch (err) {
      console.error('Synchronous error setting up Firebase Auth:', err);
      // If it fails immediately (e.g. invalid API key), force loading false so we don't hang
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimeout);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signUp = useCallback(
    async (email, password, fullName, username) => {
      try {
        setError(null);
        setLoading(true);
        await authService.signUpWithEmail(email, password, fullName, username);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signIn = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      await authService.signInWithEmail(email, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignInWithGoogle = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      await authService.signInWithGoogle();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      setError(null);
      await authService.signOut();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};