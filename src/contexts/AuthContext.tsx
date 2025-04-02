
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, UserProfile } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearErrors: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check for initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user profile from profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) throw error;
            
          setState({
            user: data as UserProfile,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setState({
          user: null,
          isLoading: false,
          error: 'Erreur lors de la vérification de la session',
        });
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({ ...prev, isLoading: true }));
        
        if (event === 'SIGNED_IN' && session) {
          // Using setTimeout to avoid Supabase deadlock issues
          setTimeout(async () => {
            try {
              // Get user profile from profiles table
              const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error) throw error;
                
              setState({
                user: data as UserProfile,
                isLoading: false,
                error: null,
              });
              
              navigate('/');
              toast({
                title: "Connexion réussie",
                description: `Bienvenue ${data?.name || 'utilisateur'}!`,
              });
            } catch (error) {
              console.error('Error fetching user profile:', error);
              setState(prev => ({ 
                ...prev, 
                isLoading: false,
                error: "Erreur lors de la récupération du profil"
              }));
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            isLoading: false,
            error: null,
          });
          navigate('/auth');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;
      
      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte",
      });
      
    } catch (error: any) {
      console.error('Error signing up:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Erreur lors de l'inscription" 
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
    } catch (error: any) {
      console.error('Error signing in:', error);
      setState(prev => ({ 
        ...prev, 
        error: translateAuthError(error.message) || "Erreur lors de la connexion" 
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signInWithGoogle = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Erreur lors de la connexion avec Google" 
      }));
    } finally {
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
        error: error.message || "Erreur lors de la déconnexion" 
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
        error: error.message || "Erreur lors de l'envoi de l'email de réinitialisation" 
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const clearErrors = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Helper function to translate common Supabase auth errors to French
  const translateAuthError = (errorMessage: string): string => {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Identifiants invalides',
      'Email not confirmed': 'Email non confirmé',
      'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
      'User already registered': 'Utilisateur déjà inscrit',
    };
    
    return errorMap[errorMessage] || errorMessage;
  };

  const value = {
    ...state,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    clearErrors,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
