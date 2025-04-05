
import React from 'react';

interface BarcodeInfoProps {
  barcode: string;
}

const BarcodeInfo: React.FC<BarcodeInfoProps> = ({ barcode }) => {
  if (!barcode) return null;
  
  return (
    <div className="px-4 py-3 bg-calfit-light-blue dark:bg-blue-900/20 rounded-lg text-sm">
      <p>Code-barres détecté : <span className="font-mono font-medium">{barcode}</span></p>
      <p className="text-xs text-muted-foreground mt-1">
        Cet aliment sera ajouté à notre base de données
      </p>
    </div>
  );
};

export default BarcodeInfo;
