
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import { Toaster } from '@/components/ui/toaster';
import UserMenu from '@/components/user/UserMenu';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b">
        <div className="container max-w-md mx-auto px-4 py-3 flex justify-end">
          <UserMenu />
        </div>
      </header>
      <motion.main 
        className="flex-1 container max-w-md mx-auto px-4 py-6 pb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="page-transition">
          {children}
        </div>
      </motion.main>
      <BottomNavigation currentPath={location.pathname} />
      <Toaster />
    </div>
  );
};

export default MainLayout;
