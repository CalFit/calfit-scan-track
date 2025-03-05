
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container max-w-md mx-auto px-4 py-6 pb-20">
        <div className="page-transition">
          {children}
        </div>
      </main>
      <BottomNavigation currentPath={location.pathname} />
      <Toaster />
    </div>
  );
};

export default MainLayout;
