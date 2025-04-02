
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthState } from './types';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for managing authentication state and session
 */
export function useAuthState(): [
  AuthState, 
  React.Dispatch<React.SetStateAction<AuthState>>
] {
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
            user: data,
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
                user: data,
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

  return [state, setState];
}
