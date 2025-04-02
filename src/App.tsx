
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import MacrosPage from './pages/MacrosPage';
import SettingsPage from './pages/SettingsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import FoodSearchPage from './pages/FoodSearchPage';
import ScannerPage from './pages/ScannerPage';
import MealsPage from './pages/MealsPage';
import AuthPage from './pages/AuthPage';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './providers/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <motion.div
              className="h-screen overflow-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/macros" element={
                  <ProtectedRoute>
                    <MacrosPage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/leaderboard" element={
                  <ProtectedRoute>
                    <LeaderboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/food-search" element={
                  <ProtectedRoute>
                    <FoodSearchPage />
                  </ProtectedRoute>
                } />
                <Route path="/scanner" element={
                  <ProtectedRoute>
                    <ScannerPage />
                  </ProtectedRoute>
                } />
                <Route path="/meals" element={
                  <ProtectedRoute>
                    <MealsPage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
