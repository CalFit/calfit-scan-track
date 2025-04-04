
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalculatedMacros } from './types';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calculatedMacros: CalculatedMacros | null;
  onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  calculatedMacros,
  onConfirm
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer votre programme nutritionnel</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir mettre à jour vos objectifs nutritionnels avec les valeurs suivantes ?
          </DialogDescription>
        </DialogHeader>
        
        {calculatedMacros && (
          <div className="py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Calories</span>
              <span>{calculatedMacros.calories} kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Protéines</span>
              <span>{calculatedMacros.protein} g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Lipides</span>
              <span>{calculatedMacros.fat} g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Glucides</span>
              <span>{calculatedMacros.carbs} g</span>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onConfirm}>
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
