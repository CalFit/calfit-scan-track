
import { useState, useEffect, useRef } from 'react';
import { ScanBarcode, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScannerPreviewProps {
  onScanComplete?: (barcode: string) => void;
}

const ScannerPreview = ({ onScanComplete }: ScannerPreviewProps) => {
  const [scanning, setScanning] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Effet pour initialiser la caméra
  useEffect(() => {
    const setupCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("L'API de caméra n'est pas disponible sur cet appareil");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setCameraReady(true);
          };
        }
      } catch (error) {
        console.error("Erreur d'accès à la caméra:", error);
        setErrorMessage(error instanceof Error ? error.message : "Erreur d'accès à la caméra");
      }
    };

    setupCamera();

    // Nettoyage: arrête le flux de la caméra quand le composant est démonté
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (scanning && cameraReady) {
      // Animation de la ligne de scan
      const interval = setInterval(() => {
        setScanLine((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 2;
        });
      }, 30);

      // Simulation d'une détection de code-barres après 3 secondes
      // Dans une vraie application, on utiliserait une bibliothèque de lecture de code-barres
      const timeoutId = setTimeout(() => {
        simulateBarcodeScan();
      }, 3000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeoutId);
      };
    }
  }, [scanning, cameraReady]);

  const simulateBarcodeScan = () => {
    // Capturer une image de la vidéo
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Simuler la détection d'un code-barres
        const simulatedBarcodes = ["3760249570058", "5449000000996", "3228886048436"];
        const randomBarcode = simulatedBarcodes[Math.floor(Math.random() * simulatedBarcodes.length)];
        
        setScanning(false);
        if (onScanComplete) {
          onScanComplete(randomBarcode);
        }
      }
    }
  };

  const handleStartScan = () => {
    if (cameraReady) {
      setScanning(true);
    }
  };

  return (
    <div className="w-full aspect-[3/4] relative flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
      {errorMessage ? (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <ScanBarcode className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-500 mb-2">Erreur de caméra</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{errorMessage}</p>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className={`absolute inset-0 object-cover w-full h-full ${!scanning || !cameraReady ? 'opacity-50' : 'opacity-100'}`}
          />
          
          <canvas ref={canvasRef} className="hidden" />
          
          {!cameraReady ? (
            <div className="z-10 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-calfit-blue animate-spin mb-4" />
              <p className="text-sm font-medium">Initialisation de la caméra...</p>
            </div>
          ) : !scanning ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/20">
              <ScanBarcode className="w-16 h-16 text-white mb-4" />
              <button 
                onClick={handleStartScan}
                className="calfit-button-secondary"
              >
                Démarrer le scan
              </button>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="relative w-3/4 aspect-square border-2 border-white rounded-lg overflow-hidden">
                <div 
                  className="absolute left-0 right-0 h-1 bg-calfit-green shadow-[0_0_10px_rgba(88,204,2,0.7)]"
                  style={{ top: `${scanLine}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border border-dashed border-white/70 rounded" />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScannerPreview;
