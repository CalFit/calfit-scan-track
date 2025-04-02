
/**
 * Translates common Supabase auth errors to French
 */
export const translateAuthError = (errorMessage: string): string => {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Identifiants invalides',
    'Email not confirmed': 'Email non confirmé',
    'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
    'User already registered': 'Utilisateur déjà inscrit',
    'Email already registered': 'Email déjà utilisé',
  };
  
  return errorMap[errorMessage] || errorMessage;
};
