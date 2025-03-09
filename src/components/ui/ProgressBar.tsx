import { cn } from '@/lib/utils';
interface ProgressBarProps {
  percentage: number;
  label?: string;
  color?: string;
  height?: string;
  animate?: boolean;
  showDate?: boolean;
}
const ProgressBar = ({
  percentage,
  label,
  color = 'bg-calfit-orange',
  height = 'h-2.5',
  animate = true,
  showDate = false
}: ProgressBarProps) => {
  // Get current date in "Vendredi 7 mars 2025" format
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  return <div className="w-full space-y-1.5">
      {label}
      
      
    </div>;
};
export default ProgressBar;