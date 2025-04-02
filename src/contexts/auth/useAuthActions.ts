
import { supabase } from '@/integrations/supabase/client';
import { AuthState } from './types';
import { translateAuthError } from './utils';
import { toast } from '@/hooks/use-toast';
import { Dispatch, SetStateAction } from 'react';

/**
 * Hook for authentication actions like signIn, signUp, etc.
 */
export function useAuthActions(
  state: AuthState,
  setState: Dispatch<SetStateAction<AuthState>>
) {
  const signUp = async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      console.log("Starting signup process for:", email);
      
      // Vérification des données d'entrée
      if (!email || !password || !name) {
        throw new Error("Tous les champs sont requis");
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        console.error('Error during signup:', error);
        throw error;
      }
      
      console.log("Signup response:", data);
      
      // Check if user was actually created
      if (data && data.user) {
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte",
        });
        
        // Si l'inscription est réussie mais que l'utilisateur doit confirmer son email
        if (data.user.identities && data.user.identities.length === 0) {
          throw new Error("L'email est déjà utilisé");
        }
      } else {
        throw new Error("Aucune donnée utilisateur n'a été retournée après l'inscription");
      }
      
    } catch (error: any) {
      console.error('Error signing up:', error);
      setState(prev => ({ 
        ...prev, 
        error: translateAuthError(error.message) || "Erreur lors de l'inscription",
        isLoading: false
      }));
    } finally {
      console.log("Signup process finished, setting isLoading to false");
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      console.log("Starting signin process for:", email);
      
      // Vérification des données d'entrée
      if (!email || !password) {
        throw new Error("Email et mot de passe requis");
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error during signin:', error);
        throw error;
      }
      
      console.log("Signin response:", data);
      
      // Check if user was actually logged in
      if (!data || !data.user) {
        throw new Error("Aucune donnée utilisateur n'a été retournée après la connexion");
      }
      
    } catch (error: any) {
      console.error('Error signing in:', error);
      setState(prev => ({ 
        ...prev, 
        error: translateAuthError(error.message) || "Erreur lors de la connexion",
        isLoading: false
      }));
    } finally {
      console.log("Signin process finished, setting isLoading to false");
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signInWithGoogle = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      console.log("Starting Google signin process");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error('Error during Google signin:', error);
        throw error;
      }
      
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Erreur lors de la connexion avec Google",
        isLoading: false
      }));
    } finally {
      console.log("Google signin process finished, setting isLoading to false");
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });
      
    } catch (error: any) {
      console.error('Error signing out:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Erreur lors de la déconnexion",
        isLoading: false
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre email pour réinitialiser votre mot de passe",
      });
      
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Erreur lors de l'envoi de l'email de réinitialisation",
        isLoading: false
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const clearErrors = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    clearErrors
  };
}
