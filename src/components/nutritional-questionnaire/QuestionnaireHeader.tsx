
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuestionnaireHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

const QuestionnaireHeader: React.FC<QuestionnaireHeaderProps> = ({
  currentStep,
  totalSteps,
  stepNames,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "mb-6",
      isMobile ? "mb-4" : "mb-6"
    )}>
      <div className="flex justify-between items-center mb-2">
        <h2 className={cn(
          "font-semibold text-calfit-blue",
          isMobile ? "text-base" : "text-lg"
        )}>
          Étape {currentStep + 1} sur {totalSteps}
        </h2>
        <span className={cn(
          "text-muted-foreground",
          isMobile ? "text-xs" : "text-sm"
        )}>
          {stepNames[currentStep]}
        </span>
      </div>
      
      {/* Barre de progression */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-calfit-blue h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        ></div>
      </div>
      
      {/* Indicateurs d'étapes */}
      <div className="flex justify-between mt-1">
        {stepNames.map((_, index) => (
          <div 
            key={index}
            className={cn(
              "flex-1 text-center",
              index <= currentStep ? "text-calfit-blue" : "text-gray-400",
              isMobile ? "text-[10px]" : "text-xs"
            )}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionnaireHeader;
