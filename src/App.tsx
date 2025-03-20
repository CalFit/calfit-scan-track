import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import MacrosPage from './pages/MacrosPage';
import SettingsPage from './pages/SettingsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import FoodSearchPage from './pages/FoodSearchPage';
import ScannerPage from './pages/ScannerPage';
import MealsPage from './pages/MealsPage';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './providers/ThemeProvider';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="h-screen overflow-auto">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/macros" element={<MacrosPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/food-search" element={<FoodSearchPage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
