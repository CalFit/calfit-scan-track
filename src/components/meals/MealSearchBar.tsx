import React, { useState } from 'react';
import { Search, Plus, ScanBarcode, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface MealSearchBarProps {
  onSearch: (term: string) => void;
  onAddClick: () => void;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

const MealSearchBar = ({ onSearch, onAddClick, mealType }: MealSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="space-y-2 pb-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher dans ce repas..."
          className="pl-10 pr-9"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button 
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          size="sm" 
          className="flex-1 gap-1" 
          onClick={onAddClick}
        >
          <Plus size={14} />
          Ajouter
        </Button>
        
        <Link to={`/food-search?mealType=${mealType}`} className="flex-1">
          <Button 
            size="sm" 
            className="w-full gap-1" 
            variant="outline"
          >
            <Search size={14} />
            Rechercher
          </Button>
        </Link>
        
        <Link to={`/scanner?mealType=${mealType}`} className="flex-1">
          <Button 
            size="sm" 
            className="w-full gap-1" 
            variant="secondary"
          >
            <ScanBarcode size={14} />
            Scanner
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MealSearchBar;
