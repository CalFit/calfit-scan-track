
import { useState, useEffect } from 'react';
import { ScanBarcode } from 'lucide-react';

interface ScannerPreviewProps {
  onScanComplete?: (barcode: string) => void;
}

const ScannerPreview = ({ onScanComplete }: ScannerPreviewProps) => {
  const [scanning, setScanning] = useState(false);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setScanLine((prev) => {
          if (prev >= 100) {
            setScanning(false);
            // Simulate a random barcode for the demo
            // In a real app, this would come from the camera
            const simulatedBarcodes = ["12345678", "87654321", "98765432"];
            const randomBarcode = simulatedBarcodes[Math.floor(Math.random() * simulatedBarcodes.length)];
            
            if (onScanComplete) {
              onScanComplete(randomBarcode);
            }
            return 0;
          }
          return prev + 5;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [scanning, onScanComplete]);

  const handleStartScan = () => {
    setScanning(true);
  };

  return (
    <div className="w-full aspect-[3/4] relative flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
      {!scanning ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <ScanBarcode className="w-16 h-16 text-gray-400" />
          <button 
            onClick={handleStartScan}
            className="calfit-button-secondary"
          >
            Démarrer le scan
          </button>
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-3/4 aspect-square border-2 border-white rounded-lg overflow-hidden">
              <div 
                className="absolute left-0 right-0 h-px bg-calfit-green -[0_0_10px_rgba(88,204,2,0.7)]"
                style={{ top: `${scanLine}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border border-dashed border-white/70 rounded" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScannerPreview;
