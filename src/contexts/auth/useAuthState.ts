
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
          // Since we can't currently use Supabase queries, we'll mock the profile data
          // In a real app, this would fetch from the profiles table
          const mockUserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'User',
            avatar_url: session.user.user_metadata?.avatar_url || null,
          };
          
          setState({
            user: mockUserProfile,
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
              // Since we can't currently use Supabase queries, we'll mock the profile data
              // In a real app, this would fetch from the profiles table
              const mockUserProfile = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || 'User',
                avatar_url: session.user.user_metadata?.avatar_url || null,
              };
              
              setState({
                user: mockUserProfile,
                isLoading: false,
                error: null,
              });
              
              navigate('/');
              toast({
                title: "Connexion réussie",
                description: `Bienvenue ${mockUserProfile?.name || 'utilisateur'}!`,
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
