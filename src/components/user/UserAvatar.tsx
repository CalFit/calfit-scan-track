
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface UserAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar = ({ className, size = 'md' }: UserAvatarProps) => {
  const { user } = useAuth();
  
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-12 w-12';
      default: return 'h-10 w-10';
    }
  };
  
  const getInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar className={`${getSizeClass()} ${className || ''}`}>
      <AvatarImage src={user?.avatar_url || undefined} alt={user?.name || 'Utilisateur'} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {user ? getInitials() : <User className="h-5 w-5" />}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
