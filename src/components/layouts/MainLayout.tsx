
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className={`flex-1 pb-16 overflow-auto px-2 sm:px-4 md:px-6 max-w-full mx-auto ${isMobile ? 'w-full' : 'container'}`}>
        {children}
      </main>
      <BottomNavigation currentPath={currentPath} />
    </div>
  );
};

export default MainLayout;
